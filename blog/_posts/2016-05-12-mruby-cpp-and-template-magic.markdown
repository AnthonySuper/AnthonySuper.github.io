---
title: "mruby, C++, and Template Magic"
layout: post
categories: ["programming", "c++", "ruby"]
---

For the past few days I've been trying my hand at making a [simple 2D game engine.](https://github.com/AnthonySuper/Experimental-2D-Engine)
It's a challenge that involves math and programming, two subjects I greatly enjoy.

I decided early on that I would use Ruby as the engine's scripting language.
Ruby's pretty much my favorite language, and its ability to create DSLs seems like it would be highly useful in enabling users of the engine to be productive.
The normal ruby interpreter, of course, isn't well suited to embedding&mdash;it's way too big and heavy.
Thankfully, there's another implementation called [mruby](https://github.com/mruby/mruby), which is designed to be used in more resource-constrained contexts.
That matches my use case pretty well, so I set it up.

Now, I needed some way to bind ruby methods to my native code.
Ideally, I'd be able to expose C++ classes and their associated methods to ruby natively.
I found a library called [mrubybind](https://github.com/ktaobo/mrubybind) that seemed to do what I wanted, but I soon found it had limitations.
The biggest limitation was how it handled parameter types.
With mrubybind, your methods can take ints, booleans, strings, floats, and void pointers.
That didn't sit well with me.
`void *` is a horribly unsafe construct.
It has its uses, of course, but I'd rather have something with a bit more type information.

It soon became clear that I would need to bite the bullet and write my own library.
Hopefully, I could make use of C++ templates to design something with an interface that isn't *too* terrible.

<!--more-->

Okay, first up, I had to figure out how the hell mruby defined native type sharing.
I found a few articles, which helped me a bit, but they didn't go in-depth on what I actually wanted to do.
Thankfully, mruby is open-source, so I can read the code myself.

After a bit of searching I found the header [`data.h`](https://github.com/mruby/mruby/blob/master/include/mruby/data.h).
This seemed to have what I wanted&mdash;the macro `DATA_WRAP_STRUCT` seems almost exactly like what I want to do.
That macro calls out to `mrb_data_object_alloc` and returns a `struct RData`.
`struct RData` starts with the macro `MRB_OBJCET_HEADER`, so we know that `struct RData` represents some object.
In this case, it represents a native data type.

So, what makes a native data object different from a ruby one?
Well, let's check out the definition:

```c
struct RData {
  MRB_OBJECT_HEADER;
  struct iv_tbl *iv;
  const mrb_data_type *type;
  void *data;
};
```

So, we have an instance variable table called `iv`, which I don't see much use for at the moment.
We also have a `void *` called `data`, which is probably a pointer to whatever native struct we're wrapping.
Seems simple enough.

The interesting member is of type `mrb_data_type*`.
Thankfully, that type is defined a few lines up:

```c
/**
 * Custom data type description.
 */ 
typedef struct mrb_data_type {
  /** data type name */
  const char *struct_name;

  /** data type release function pointer */
  void (*dfree)(mrb_state *mrb, void*);
} mrb_data_type;

```

Okay, seems like we just need one of these for each type we want to share with mruby.
Seems like a job for static members.
First, though, I want to write something to generate that `dfree` function.
Seems like a great job for C++ templates.

# A destructor template

So, I need something that takes in a `void *` to a given type, and then frees it.
Seems pretty easy:

```cpp
namespace mrb{
template<typename T>
void destructor_value(mrb_state *mrb, void *self) {
    T* type = reinterpret_cast<T*>(self);
    delete type;
}
}
```

Great. So, now I should be able to just do:

```cpp
class Vector {        
    public:
        const static struct mrb_data_type mrb_type = {"Vector", &mrb::destructor_value<Vector>};
};
```

Unfortunately, this gave me an error:

```
error: in-class initializer for static data member of type 'const struct mrb_data_type' requires 'constexpr' specifier
        const static struct mrb_data_type mrb_type = {"Vector", &mrb::destructor_value<Vector>};
                                          ^          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        constexpr 
1 error generated.
```

So the obvious solution is to add a constexpr, right?
Well, maybe, but doing so just breaks it in a different way.
See, i need to take a pointer to this value, and (as far as I can tell), `constexpr` doesn't let you do that.
The error message actually just claimed that it had no such member when I tried to take a pointer, even though just printing the values worked.

<img src="/assets/kanye.gif" />


Ah well.

I also figured out that I'd need to initialize this member outside of the header file.
Previously, I'd moved all the definitions for the `Vector` class into its header, after benchmarks on my collision detection algorithm showed that I was paying a fairly significant performance penalty for certain `Vector` operations not getting inlined.
Unfortunately, when I initialized the member via the header, I get a large amount of `duplicate symbol` errors. 
So now I have a `vector.cpp` file, which contains only the lines:

```cpp

#include "vector.hpp"

namespace NM {
    const struct mrb_data_type Vector::mrb_type =  {"Vector", &mrb::destructor_value<Vector>};
}

```

# Determining sharable types with templates

Okay, so now I have a good idea of how this is going to work.
Types with a `mrb_data_type` static member named `mrb_type` are going to be shareable with mruby.
Otherwise, they aren't.

It would be nice if I could determine this automatically.
Thankfully, I can!
First up, let's write a helper template to determine if a type `T` is equal to `const struct mrb_data_type`.
The standard library has `std::is_same<T, U>`, which does exactly what we want.
We can use that to implement our struct:

```cpp
namespace NM::mrb::traits {
     /**
         Determine if a given type is a struct mrb_data_type
         Pretty much just a helper function
         */
        template<typename T>
        struct is_data_type_struct {
            constexpr static bool value = std::is_same<const struct mrb_data_type, T>::value;
        };
}
```

This works because different templates have different types.
So `is_data_type_struct<bool>` is a different type than `is_data_type_struct<const struct mrb_data_type>`.
These types can have different static members&mdash;in this case, `is_data_type_struct<T>::value = true` if and only if `T = const struct mrb_data_type`.

Great. Now we can write another struct to determine if this is a engine-defined type we can share.
To do this, we'll use `std::enable_if`.
The way this works is a bit tricky.
Basically, `enable_if` has a typedef `type` if and only if its argument is true.
Otherwise, it provides no such typedef.
We can use it to create `traits::is_shared_native` as follows.

First, we define the default template:

```cpp
/**
Type trait which determines if this is a user-defiend object type we can share with MRB.
*/
template<typename T, typename Enable = void>
struct is_shared_native {
  constexpr static bool value = false;
};

```

This takes two template parameters, but the first one is defaulted to void.
So, by default, `traits::is_shared_native<T>::value` is equal to `false`.

Now, we define a template *specialization*.


```cpp

template<typename T>
struct is_shared_native <T,
typename std::enable_if<is_data_type_struct<decltype(T::mrb_type)>::value>::type> {
    constexpr static bool value = true;
};

```

The way this works is kind of complicated, and, if I'm being honest, a bit unclear to me in certain places.
Basically, we're defining a specialization of the two-argument template we declared earlier.
It has one argument, of some type `T`.
The specialization has two arguments, `T` and `std::enable_if<is_data_type_struct<decltype(T::mrb_type)>::value>::type`.

So, how does it actually work?
Well, the key is the second argument to this template specialization.
Remember, `std::enable_if<Condition>::type` only exists if `Condition` is true.
If it isn't, there's no `::type` member.
If I were to simply do:

```cpp
typename std::enable_if<false>::type q;
```

I would get a compiler error: `no type named 'type' in 'std::enable_if<false, void>'`

However, in the context of templates, substitution failure is *not* an error.
So if our compiler can't resolve `std::enable_if<is_data_type_struct<decltype(T::mrb_type)>::value>::type`, it'll just shrug its shoulders and use the default template.

Now, you may be wondering why we can't do:

```cpp
template<typename T>
struct is_shared_native_easy {
    static constexpr bool value = is_data_type_struct<decltype(T::mrb_type)>::value;
};
```

Well, the problem here is the `decltype(T::mrb_type)`.
What if `T::mrb_type` doesn't exist?
The compiler goes looking for a different version of `is_shared_native_easy` it can actually use, but it doesn't find anything.
This results in a compilation failure.
Meanwhile, with our original implementation, the compiler can once again find the default value.

Great. Now, let's define one last template to determine if a given type can be shared with mrb at all.
MRB's primitive types include `mrb_bool`, `mrb_int`, and `mrb_float`.
We'll also handle `mrb_string`.
`mrb_hash` and `mrb_array` are going to have to wait for another blog post.

We have a list of types we can handle, so implementing this is easy:

```cpp
/**
Type trait which determines if this is any type we can share with MRB, including primitive types
such as mrb_float, mrb_bool, and so on.
*/
template<typename T>
struct is_convertable {
  constexpr static bool value = (is_shared_native<T>::value
                                 || std::is_integral<T>::value
                                 || std::is_same<bool, T>::value
                                 || std::is_floating_point<T>::value
                                 || std::is_same<std::string, T>::value
                                 || std::is_same<const char*, T>::value);
};
```

Great. Now we have a pretty good base. Let's expand on it!

# Objects to Value Types
At the core of mrb is the `mrb_value` type.
It wraps any kind of object MRB can handle, and is often passed around.
It would be nice if we could make some conversion functions to turn different C++ types into `mrb_values`.
Maybe a `to_value` function that takes an `mrb_state` and some type we can share with ruby (be it one of the types we defined or a primitive) and returns an mrb_value.
Thankfully, with C++ templates, this is easy. Kind of.

Once again, we're going to use `std::enable_if`.
This time, however, we're going to use the two-parameter version.
In this version, the second parameter is the type to use for `std::enable_if<T>::type` if `T` is true.
So `std::enable_if<true, mrb_value>::type` is equal to `mrb_value`, and `std::enable_if<false, mrb_value>::type` doesn't exist.

We can use this to specialize our `to_value` function.
An example will probably make it more clear:

```cpp
template<typename T>
inline typename std::enable_if<std::is_integral<T>::value, mrb_value>::type to_value(mrb_state *mrb, T i) {
    return mrb_fixnum_value(i);
}
```

`std::is_integral` returns, as the name implies, `true` if `T` is some kind of integral, and `false` otherwise. Now, let's say we make this call:

```cpp
mrb_value val = to_value(mrb, 1000);
```

The compiler looks for a suitable specialization of `to_value`.
In this case, `T` is equal to `int`.
`std::is_integral<int>` returns true, so the previous overload has a viable return type of `mrb_value`.

Meanwhile, if we do:

```cpp
mrb_value val = to_value(mrb, 100.0);
```

The compiler again looks for a suitable overload, but finds none.
We then get the relatively nice error message of "no matching function to call for to_value".
It even includes a list of overloads it found non-viable, to make debugging a bit easier!

Now, with that out of the way, we can define some more conversions:

```cpp
template<typename T>
inline typename std::enable_if<std::is_floating_point<T>::value, mrb_value>::type to_value(mrb_state *mrb, T i) {
    return mrb_float_value(mrb, i);
}

// No need to template this, since it only works for strings!
inline mrb_value to_value(mrb_state *mrb, std::string s) {
    return mrb_str_new(mrb, s.c_str(), s.length());
}

/**
 Convert a user-defined type into an mruby object.
 Note that we can only convert copy-constructable objects at the current moment, and cannot handle pointers at all.
 That is going to change soon, hopefulyl!
 */
template<typename T>
typename std::enable_if<traits::is_shared_native<T>::value && std::is_copy_constructible<T>::value, mrb_value>::type to_value(mrb_state *mrb, T obj) {
    const mrb_data_type *type = data_type<T>::value();
    struct RClass* klass = mrb_class_get(mrb, type->struct_name);
    // We create a copy here
    T *n = new T(obj);
    return mrb_obj_value(Data_Wrap_Struct(mrb, klass, type, n));
}
```

Now, there's actually a small problem here.
See, `std::is_integral<bool>::value` is `true`. 
This is because booleans are represented as integers in C, and in most hardware.
In ruby, though, this is *not* the case.
So, to fix it, let's first disallow booleans from using our integral overload:

```cpp
template<typename T>
    inline typename std::enable_if<std::is_integral<T>::value && ! std::is_same<bool, T>::value, mrb_value>::type to_value(mrb_state *mrb, T i) {
        return mrb_fixnum_value(i);
    }
```

And add a separate overload for booleans:

```cpp
inline mrb_value to_value(mrb_state *mrb, bool b) {
    return mrb_bool_value(b);
}
```

That was interesting, but pretty complicated.
`enable_if` is powerful, but sort of ugly to use.
Hopefully, at some point, [Concepts](https://en.wikipedia.org/wiki/Concepts_%28C%2B%2B%29) are finally going to get into the C++ standard.
If that ever happens, I'm fairly certain we could replace all that template grossness with stuff like:

```cpp
mrb_value to_value(mrb_state *mrb, Integral i) {
    return mrb_fixnum_value(mrb, i);
}
```

Much more readable, even if it essentially works the same under the hood.

So far this has been pretty fun, actually.
I definitely gave myself several headaches trying to implement all this stuff, but it's been really interesting at the same time.

# Binding Methods, Part 1

Let's take a bit of a detour here and talk about mruby methods.
All mruby methods are of the form:

```cpp
mrb_value method(mrb_state *mrb, mrb_value self);
```

The param names are pretty self-explanatory.
The first parameter is the current interpreter state, and the second parameter is the value this method is being called on.

Let's quickly typedef that:

```cpp
typedef mrb_value (*callable)(mrb_state*, mrb_value);
```

So, how do we get parameters to our function?
Well, for that, we need `mrb_get_args`.
How does that work?
Well, let's start with its signature:

```cpp
int mrb_get_args(mrb_state *mrb, const char *format, ...);
```
<img src="/assets/warroom.png">

Okay. That's not super helpful.
It looks suspiciously like the signature for printf, actually.
Well, thankfully it has some documentation:

```cpp
/**
 * Retrieve arguments from mrb_state.
 *
 * When applicable, implicit conversions (such as `to_str`, `to_ary`, `to_hash`) are
 * applied to received arguments.
 * Used inside a function of mrb_func_t type.
 *
 * @param mrb The current MRuby state.
 * @param format [mrb_args_format] is a list of format specifiers
 * @param ... The passing variadic arguments must be a pointer of retrieving type.
 * @return the number of arguments retrieved.
 * @see mrb_args_format
 */
```

Oh, so it does work like printf.
Well, I now need to somehow come up with a way to do this in a template, including statically constructing the format string and finding some way to statically pass the right number of parameters.

<img src="/assets/noready.png">

Okay, let's do this.

## Format Specifier

It seems like the right place to start is to figure out how to turn a single type into the right character.
The appropriate characters are fairly well documented:

```cpp
/**
 * Format specifiers for {mrb_get_args} function
 *
 * Must be a C string composed of the following format specifiers:
 *
 * | char | Ruby type      | C types           | Notes                                               |
 * |:----:|----------------|-------------------|----------------------------------------------------|
 * | `o`  | {Object}       | {mrb_value}       | Could be used to retrieve any type of argument     |
 * | `C`  | {Class}/{Module} | {mrb_value}     |                                                    |
 * | `S`  | {String}       | {mrb_value}       | when `!` follows, the value may be `nil`           |
 * | `A`  | {Array}        | {mrb_value}       | when `!` follows, the value may be `nil`           |
 * | `H`  | {Hash}         | {mrb_value}       | when `!` follows, the value may be `nil`           |
 * | `s`  | {String}       | char *, {mrb_int} |  Receive two arguments; `s!` gives (`NULL`,`0`) for `nil`       |
 * | `z`  | {String}       | char *            | `NULL` terminated string; `z!` gives `NULL` for `nil`           |
 * | `a`  | {Array}        | {mrb_value} *, {mrb_int} | Receive two arguments; `a!` gives (`NULL`,`0`) for `nil` |
 * | `f`  | {Float}        | {mrb_float}       |                                                    |
 * | `i`  | {Integer}      | {mrb_int}         |                                                    |
 * | `b`  | boolean        | {mrb_bool}        |                                                    |
 * | `n`  | {Symbol}       | {mrb_sym}         |                                                    |
 * | `&`  | block          | {mrb_value}       |                                                    |
 * | `*`  | rest arguments | {mrb_value} *, {mrb_int} | Receive the rest of arguments as an array.  |
 * | &vert; | optional     |                   | After this spec following specs would be optional. |
 * | `?`  | optional given | {mrb_bool}        | `TRUE` if preceding argument is given. Used to check optional argument is given. |
 *
 * @see mrb_get_args
 */
```

Gotcha. So this isn't quite as bad as it theoretically could be.
Well, first off, let's write some templates that get just *one* character.
We can use enable_if for this one again. First, our base template:

```cpp
template<typename T, typename Extern = void>
    struct param_char {
    };
```

Okay, now let's add specializations for the types.
We'll give the structs a `constexpr` member representing their character value.

```cpp
// o is for object
    template<typename T>
    struct param_char<T, typename std::enable_if<traits::is_shared_native<T>::value>::type> {
        constexpr static const auto value = 'o';
    };
    
    // f is for float
    template<typename T>
    struct param_char<T, typename std::enable_if<std::is_floating_point<T>::value>::type> {
        constexpr static const auto value = 'f';
    };
    
    // i is for integer
    template<typename T>
    struct param_char<T, typename std::enable_if<std::is_integral<T>::value && ! std::is_same<bool, T>::value>::type> {
        constexpr static auto value = 'i';
    };
    
    // b is for bool
    template<typename T>
    struct param_char<T, typename std::enable_if<std::is_same<bool, T>::value>::type> {
        constexpr static auto value = 'b';
    };
```

C++ templates can take a variable number of arguments.
We can use this to our advantage here.
We'll define one template that takes an arbitrary number of arguments.
It will then take those arguments, pass them to the `param_char` template we defined earlier, and put everything in one string.

As it turns out, this is pretty simple:


```cpp
template<typename ...Args>
    struct param_format_string {
        static const char value[];
    };

template<typename ...Args>
    const char param_format_string<Args...>::value[] = {(param_char<Args>::value)..., '\0'};
```

The way this works is deceptively simple.
The important part is the `...` in `(param_char<Args>::value)...`.
This tells the our compiler to expand the list of template arguments into their individual values.
So, if we do `param_format_string<double, int, NM::Vector>`, it will translate to `param_char<double>::value, param_char<int>::value, param_char<NM::Vector>::value, '\0'`.
This lets us construct the proper format specifier at *compile time*!

This is called [pack expansion](http://en.cppreference.com/w/cpp/language/parameter_pack#Pack_expansion), and we use it to rather... disgusting effects later on.

Okay, onto our next trick:

# Binding Methods 2: Compile Time Wrappers

Let's start to write something that binds methods!
Remember, all mruby-visible functions need to take an `mrb_state` and an `mrb_value` and return another `mrb_value`. 
I don't think we want to write all our C++ methods like that, so we'll have to do something that translates functions of that form to functions of the proper one at compile-time.
The best way to properly do this is to write a template that generates a function mrb can understand, but which eventually calls a native C++ method with the right argument types.

First off, we know that we're going to be doing other, similar things to translate native C++ objects into Ruby-land.
Let's make a struct to contain all these things—a translator for some type `T`.

```cpp
tempalte<typename T>
struct translator {
  static_assert(traits::is_shared_native<T>::value,
                "Can only translate shared native types!");
};
```

We will define all our other structures under this.

Okay, so now we need to create a template to add individual methods.
In C++, methods can have overloaded argument types, so we can't really deduce which version we want to expose to ruby-land at compile time.
I figured the best solution to this would be to have users pass in the parameter lists explicitly.
They also pass in the return type.
I think this is technically unnecessary, but I couldn't figure out a way to avoid it.
So, for now, to bind a method you must specify its format again.

```cpp
template<typename T, typename ...Args>
struct method {

};
```

Okay, so far so good.
We're going to need to refer to methods of this format multiple times while we write this.
For convenience, let's define a `typedef` underneath our struct to make that easier:

```cpp

typedef Ret(T::*funcType(Args...);
```

As you can see, C++'s syntax for method pointers is kind of nasty.
Thankfully, we can now use `funcType` instead of that whole mess.

Now we want to be able to bind specific methods.
To do this, we're going to need to generate an mruby-usable function which calls our method.
I think the best way to do this is with another template, so let's nest another struct:

```
templatefuncType func>
struct binder {

private:
  static mrb_value method(mrb_state *mrb, mrb_value self) {

  }
}
```

Now, `method` needs to take in the arguments from mruby, convert them to the right argument types, call the method, convert the method's return value into an `mrb_value`, and return this `mrb_value`.

<img src="/assets/mikeconfused.gif" />

Okay, this can't be *that* bad.

## Arguments from mruby

Let's take this one step at a time, shall we?
Our first concern is getting arguments from mruby.
If you remember from earlier in this blog post, one can obtain those through the use of `mrb_get_args`, which takes in a format string and a list of pointers to the argument types mruby wants to fill.
We already did the format string, so let's add that in:

```cpp
static mrb_value method(mrb_state *mrb, mrb_value self) {
  std::string format = param_format_string<Args...>::value;
```

Great. Now, we also need to pass a list of pointers to locations in which we are storing those arguments.
So if we want to take in a `double`, an `int`, and an `NM::Vector`, we need to provide an `mrb_float *`, an `mrb_fixnum *`, and a `mrb_value *`.
We then need to convert those values into a `double`, an `int`, and an `NM::Vector`, for use in our C++ code.

This seems like a good job for a helper struct.
This helper struct can be templated based on the argument type, and provide the correct valus.
Let's name it a `conversion_helper`.
It should have a method to get a pointer to relevant storage, and one to get back the desired type.
We can once again use `enable_if` to specialize our templates.
Let's start with something simple and write one for integers.

```cpp
// Specialization for integral types
    template<typename T>
    struct conversion_helper<T,
    typename std::enable_if<std::is_integral<T>::value>::type> {
        mrb_int i;
        mrb_state *mrb;
        
        operator T() {
            return static_cast<T>(i);
        }
        
        void* to_ptr() {
            return (void *) &i;
        }
    };
```


This works pretty well.
If we call `to_ptr()` it provides a `void *` that points to an `mrb_int`, just like we wanted.
We also define a *conversion operator* that we can use to convert back to whatever `T` is&mdash;in most cases an int, but maybe a `long` or a `uint64_t` occasionally.

We can then define a bunch of further specializations, which we won't elaborate on here.

Now, we can finally add another line to our `method` template function:

```cpp
  std::tuple<conversion_helper<Args>...> t;
```

Using `...`, this will expand out the `Args` template argument.
So if we're binding a method with arguments of `double, int`, this becomes (after expansion)

```cpp
  std::tuple<conversion_helper<double>, conversion_helper<int>> t;
```

[`std::tuple`](http://en.cppreference.com/w/cpp/utility/tuple) is a "fixed-size collection of heterogeneous values."
In normal English, this means that it "Holds a bunch of values of possibly different types with a given order."
In this case, it's a bunch of specializations of `conversion_helper` in a list.
The important thing is that the list is a *compile time* list.
You don't use `tuple.get(0)` to get the first element of the list, you use `std::get<1>(tuple)`.
That means that we can iterate over the values at *compile time*, and pass each value into `mrb_get_args`.

How?
Well, we can use `std::index_sequence`.
I'll be real here, how this works is freaking gross.
Basically, it creates a compile-time variable argument list, counting upwards.
In this case, we want a list of all the *indexes* of the *argument tuple.*
So, continuing our `double, int` case, we want a compile-time list of integers that looks like `<0, 1>`.
Remember, this is a compile-time list, so we can use it with templates!

We can obtain this list with `std::index_sequence_for<Args...>{}`.

This allows us to write another helper method:

```cpp 
template<class Tuple, std::size_t... indexes>
        static void fill_tuple(std::string format,
                               mrb_state *mrb,
                               Tuple &t,
                               std::index_sequence<indexes...>) {
            mrb_get_args(mrb, format.c_str(), (std::get<indexes>(t).to_ptr())...);
        }
```

<img src="/assets/loaf.gif" />

No, no, chill out. This isn't that bad.
It's a bit disgusting, but it's not dark magic.

The first template argument, `Tuple`, exists so we can take arbitrary tuple types.
So, in our `double, int` case, this is type `std::tupe<conversion_helper<double>, conversion_helper<int>>`.
The second argument is where things get clever.

Previously, we used `std::index_sequence_for<Args...>{}` to generate an index sequence.
Continuing the `double, int` example, we generated `std::index_sequence<0, 1>`.
When we pass this as the last argument of `fill_tuple`, the compiler sees that `indexes` must be equal to `<0, 1>`.
It then fills in the variadic template argument `indexes` with the values of `0, 1`.

Now, in the actual call, we use `(std::get<indexes>(t).to_ptr())...`
The `...` causes a template argument expansion, just as before.
This time, however, it's expanding on the template argument `indexes`.
So, in the `double, int` case, this expands out to `mrb_get_args(mrb, format.c_str(), (std::get<0>(t).to_ptr()), (std::get<1>(t).to_ptr()))`.

In effect, this means that we pass the `conversion_helpers` for all our arguments to `mrb_get_args`, filling them all out!

## Arguments back to C++
Now, to convert back into C++ values, we occasionally need to use an `mrb_state*`. 
This is mostly true for native types mruby is handling.
I wrote a function which uses the same parameter pack expansion to set the `mrb` member of each `conversion_helper`.
That's not really important for this blog post, so we're going to ignore it for now.
So, let's add more lines here:

```cpp
fill_tuple(format, mrb, t, std::index_sequence_for<Args...>{});
fill_mrb_values(mrb, t, std::index_sequence_for<Args...>{});
```

Okay, so now we need an object to call this method on.
That's wrapped in the `self` parameter of this function, so we can just grab the pointer from that:
```cpp
  void *p =mrb_data_check_get_ptr(mrb, self, data_type<T>::value());
  T *s = reinterpret_cast<T*>(p);
```

Great. Now, we need to write a function to make the call.
That needs to expand our tuple outwards once more, so we can use the index_sequence_for trick again:

```cpp
Ret re = make_call(s, func, t, std::index_sequence_for<Args...>{});
```

And the source of `make_call`:

```cpp
template<class Tuple, std::size_t... indexes>
static Ret make_call(T *self, funcType f, Tuple &t, std::index_sequence<indexes...>) {
    return (self->*f)(std::get<indexes>(t)...);
}
```

Great. Now, we already have a `to_value` function defined earlier, so we can just use that to make an `mrb_value` from our return value:

```cpp
  return to_value(mrb, re);
```

Now, let's write a function to actually bind the methods into mruby.
We need an `mrb_state` for that, as well as a name to get the class under.

```cpp
tatic void bind(mrb_state *mrb, std::string name) {
    mrb_func_t f = &method;
    mrb_define_method(mrb,
                      getClass(mrb), name.c_str(), f, sizeof...(Args));
}
```

Great! We'll define the `getClass` function in just a moment.

# Finishing Up

Okay, let's go back to the top-level `translator` template.
MRuby requires you to define classes for your objects, and to give those classes a name.
The `mrb_data_type*` we defined for our sharable classes already defines a name, so we can just use that:

```cpp
static void makeClass(mrb_state *mrb) {
mrb_define_class(mrb, data_type<T>::value()->struct_name, mrb->object_class);
}
```

This is also a good time to write the `getClass` function from earlier:

```cpp
static struct RClass* getClass(mrb_state *mrb) {
    return mrb_class_get(mrb, data_type<T>::value()->struct_name);
}
```

Awesome. Now, we can modify the code we used to bind methods a bit to create a constructor binder:

```cpp

template<typename ...Args>
struct constructor {
    static void bind(mrb_state *mrb) {
        mrb_func_t  f = &val;
        // Allows us to do {CLASSNAME}.new to construct a new object
        mrb_define_class_method(mrb,
                                getClass(mrb), "new", f, MRB_ARGS_REQ(sizeof...(Args)));
    }
    
private:
    static mrb_value val(mrb_state *mrb, mrb_value self) {
        std::string format = param_format_string<Args...>::value;
        std::tuple<conversion_helper<Args>...> t;
        translator<T>::fill_tuple(format, mrb, t, std::index_sequence_for<Args...>{});
        translator<T>::fill_mrb_values(mrb, t, std::index_sequence_for<Args...>{});
        T* constructed = make_call(t, std::index_sequence_for<Args...>{});
        return mrb_obj_value(Data_Wrap_Struct(mrb, getClass(mrb), data_type<T>::value(), (void *) constructed));
    }
    
    template<class Tuple, std::size_t... indexes>
    static T* make_call(Tuple &t, std::index_sequence<indexes...>) {
        return new T(std::get<indexes>(t)...);
    }
};

```

Great!
We also define a `const_binder` under `method`, to handle methods marked `const`.
This is pretty much copy-and-paste in the actual source, so I won't do that here.

Now, let's look at a quick usage example:

# Usage

Let's bind our vector class into mruby.
First, we add the mrb_data_type to it:

```cpp
class Vector {
public:
    const static struct mrb_data_type mrb_type;
};
```

Great!
Now, we can write a binder function.
This is just a normal function with binds our class into some instance of mruby.

```cpp

void Vector::bindMRB(mrb_state *mrb) {
        using namespace NM;
        using t = mrb::translator<Vector>;
        t::makeClass(mrb);
        t::constructor<double, double>::bind(mrb);
        using doubleRet = t::method<double>;
        doubleRet::const_binder<&Vector::getX>::bind(mrb, "x");
        doubleRet::const_binder<&Vector::getY>::bind(mrb, "x");
        using setters = t::method<double, double>;
        setters::binder<&Vector::setX>::bind(mrb, "x=");
        setters::binder<&Vector::setY>::bind(mrb, "y=");
        using doubleVec = t::method<double, const Vector&>;
        doubleVec::const_binder<&Vector::absoluteDistance>::bind(mrb, "absolute_distance");
        doubleVec::const_binder<&Vector::dotProduct>::bind(mrb, "dot");
    }

```

Not the least complicated thing ever, but certainly not the most as well.
Now that this is done, we can take it for a spin in MRuby:

```cpp
        
    mrb_state *mrb = mrb_open();
    NM::Vector::bindMRB(mrb);
    mrb_value v = mrb_load_string(mrb, "a = Vector.new(0,0) \n" \
                    "b = Vector.new(10, 11) \n" \
                    "puts a.x \n" \
                    "puts b.x \n" \
                    "puts \"Absolute distance: #{a.absolute_distance(b)}\" \n ");
```

We get the output:

```
0
11
Absolute distance: 14.866068747319
```

Which is exactly what we wanted!

<div class="column-caption">
  <div class="row-images">
    <img src="/assets/chickmike.gif" />
    <img src="/assets/chickjay.gif" />
  </div>
  <p>Delicious</p>
</div>

# Final Thoughts

This was, by far, the most complicated thing I have ever done with C++ and template metaprogramming.
It was certainly fun, but it also felt sort of gross in some areas.
I don't quite know how to fix it, but the `std::index_sequence` hack felt extremely unnatural, and I wish that I could have made what it was doing more clear.

Even so, I did have fun with this.
It was nice writing something that wasn't web development for once, even if it was kind of nasty.
I'm also very satisfied with the finished product—it's not as clean as it probably could be, but I think it works quite well.
Hopefully, I can use it to provide a clean scripting interface to this toy engine.
Who knows, maybe some day I'll actually use the engine in a project.
I have a couple of ideas, but, right now, ImageHex has to come first.
I've already spent almost a week on this little detour.

The code is available on [Github](https://github.com/AnthonySuper/Experimental-2D-Engine), if you want to check it out.
The Actual code for the mrb wrapper is contained in [`mrb_wrapper.h`](https://github.com/AnthonySuper/Experimental-2D-Engine/blob/master/include/mrb_wrapper.hpp).
Feel free to use this in your own project.
I think Ruby is a really great language, and I'd love to see it get wider use for scripting.

Next time, we will most likely be discussing live coding, as part of a project I'm working on. Stay tuned.
