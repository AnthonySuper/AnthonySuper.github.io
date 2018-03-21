---
title: "Templates, Index Sequence, and Optimization"
layout: post
categories: ["programming", "dungeon landlord", "c++"]
---

Recently, I've been working on a 2D game.
Full-time, in fact: I recently graduated early, and I figured I might as well take a year and a half to work on this project before getting a "real" job.
I initially started creating a game in Unity, however, I quickly realized that I didn't actually like the engine.
I actually *disliked* it fairly heavily, and it was hurting my productivity.
So, naturally, my next thought was to code the game from scratch.


The natural choice for this was C++.
I [messed around with making a 2D engine before](https://anthony.noided.media/blog/programming/c++/ruby/2016/05/12/mruby-cpp-and-template-magic.html) and enjoyed it, even if I didn't actually get very far.
I took a bit of a different approach this time, intentionally trying to make a *game* instead of an *engine*.
However, that doesn't mean that I don't occasionally encounter engine-dev-related problems.
One interesting recent one: optimizing a component of my ECS system.

<!--more-->

# ECS

An *Entity Component System* is a style of designing a program comprised of three parts: Entities, Components, Systems.
[Wikipedia has a good article describing them](https://en.wikipedia.org/wiki/Entity%E2%80%93component%E2%80%93system), but I'll summarize here.

*Components* are pieces of data with a specific purpose.
In my engine, there's a component type for a "Position", which describes where something is.
There's another for an "Image."
There's yet another for a "PhysicsBody."
These components aren't coupled&mdash;they're totally independent of each other.

*Entities* tie components together, in the sense that they allow a given "thing" to have components of multiple types.
That's really all they do: an Entity has multiple components, but no logic of its own.
In my engine's case, the Entity isn't actually storing anything but information about what components it has!
It's essentially just an identifier&mdash;the components are stored separately.

*Systems* are the interesting bit.
Systems inspect the entities and do something to them based on their components.
A good example is the `ImageDraw` system.
It finds all Entities with an `Image` component and a `Position` component, and  uses the information in each to draw a scene.
Simple!

So, in our engine's case, we have Systems that process at a fixed interval: once per frame.
This allows us to have an easily-extensible game loop.
If I want to add more logic, I throw on a couple of systems, and occasionally a few new type of components.

This, however, presented an interesting optimization problem.
The way I implemented an ECS was via the use of type erasure: I have one base class for each component, which looks like this:

```cpp
struct ComponentBase {
    /**
     * Make this virutal 
     */
    virtual ~ComponentBase() = default;
    /**
     * Return a unique identifier for this type of component
     */
    size_t getId() const = default;
};
```

There's also "ComponentSystems," which is my confusingly-named term for a "Component Storage System."
Simplifying its interface a bit, we have:

```cpp
class ComponentSystem {
public:
    virtual ~ComponentSystem() = default;
    virtual addComponent(Entity& ent, ComponentBase& cmp) = 0;
    virtual ComponentBase* tryGet(Entity& ent) = 0;
    virutal size_t containedComponentId() const = 0;
};
```

This is all fairly self-explanatory.
You pass it a reference to a `ComponentBase`, which it then `static_cast`s to the actual type of component contained.
You can query for a `ComponentBase*`, which you then cast back to the actual component type.

However, all these casts are fairly... not amazing, you know?
It'd be better if we could abstract them all away, so each system doesn't have to screw around with them.

Well, we do.
The `World` class, which contains and manages every `Entity`, `ComponentSystem`, and `System`, has a few convenience methods to make using this a lot easier.
For example, there's a method:

```cpp
template<typename T,
         typename = std::enable_if_t<std::is_base_of_v<ComponentBase, T>>>
bool World::addComponent(Entity& ent, T& comp);
```

This will make sure there's a proper `ComponentSystem` to store this `Component`, and add the `Component` to the entity using it.
Simple!

Now, what about querying for which components `Entity`s have?
We want that to be easy to use, too, so we have a method that looks like this:

```cpp
 template <typename... Ts, typename Func>
    void World::eachEntity(Func callback)
```

This may be a bit confusing at first, but it's actually pretty easy to use.
An example will be helpful here:

```cpp
void ImageDraw::process(World& w, float deltaTime) {
    auto cb = [&](Entity& ent, Image& img, Position& pos) {
        drawImage(img.get_ptr(), pos.x, pos.y);
    };
    w.eachEntity<Image&, Position&>(cb);
}
```

Fairly simple!
You tell it the components you want to use, and it automatically gives you *every entity* with those components, as well as the *components themselves*.
The lambda-based interface is very clean and easy to use, and encourages the user to keep their logic as constrained as possible.
You *can* have the behavior of a single entity depend on multiple entities, and it's not *that* hard, but it's much easier to just do something simple per-entity.


# Problems

The initial implementation of this function looked something like this:

```cpp
 template <typename... Ts, typename Func>
    void World::eachEntity(Func callback) {
        for(int i = 1; i < entities.size(); ++i) {
            Entity& ent = entities[i];
            if(ent && ent.hasComponents<Ts...>()) {
                callback(ent, getComponent<Ts>(ent)...);
            }
        }
    }
```

The `typename.... Ts` is called a *parameter pack*.
It accepts an arbitrary number of types, and essentially puts them in a list.
In the statement `callback(ent, getComponent<Ts>(ent)...)`, we tell our compiler to *expand* the parameter pack into the list of parameters with the `...` operator.
So, if we call `eachEntity<Image&, Position&>`, it will expand that statement into `callback(ent, getCompoent<Image&>(ent), getComponent<Position&>(ent))`.
That's exactly what we want.

However, this was actually a bit of a performance problem.
The issue was in the `getComponent<T>` function.
You see, this function needs to:

1. Determine the proper `ComponentSystem` for `T`.
2. Get that `ComponentSystem`
3. Call its `tryGet` method with the right entity.
4. Cast to `T`
5. Return the result.

This isn't *too* much work, but it's steps 1 and 2 that killed us.
The engine stores each `ComponentSystem*` in an `std::vector`.
Each `ComponentSystem` then stores all its components in another vector.
So, every time, we are hitting at least two different places in memory, and possibly more!
I didn't think this would be a problem, but benchmarking with the excellent [Callgrind](http://valgrind.org/docs/manual/cl-manual.html) tool showed that the engine was spending quite a bit of time in just fetching `ComponentSystem*`s out of the vector.

# Optimization Ideas?

I quickly saw a potential optimization opportunity:
We *always* get the same `ComponetSystem*`s for each entity on every call to `eachEntity`.
If we call `w.eachEntity<Image&, Position&>` we get the `ImageComponentSystem` and `PositionComponentSystem` every time!
There's no reason to do that.
We should get them all *once*, before the `for` loop.

It's also important to note that we use them in the *same order*.
Going back to the previous example, we call `tryGet` on `ImageComponentSystem` first, then on `PositionComponentSystem`.
This seems like an ideal place to use an array!
So, let's do so:

```cpp
template <typename... Ts, typename Func>
    void World::eachEntity(Func callback) {
        
        std::array<ComponentSystem*, sizeof...(Ts)> comps{
            getComponentSystem<Ts>()...
        };
        // other code...
    }

```

We now have an array of `ComponentSystem*` filled with the proper values.
The parameter pack expansion works here once again.
Using our previous example, for the call to `eachEntity<Image&, Position&>`, this will expand to:

```cpp
    std::array<ComponetSystem*, 2> comps{
        getComponentSystem<Image&>(), getComponentSystem<Position&>()
    };
```

Now, however, we have a problem.
The `getComponent<T>` function also did *conversion* for us.
If we're going to be using this new `comps` array, we need something else to do the conversion!
Well, thankfully there's an easy way to do this.
Let's define a dead-simple helper struct, that only does conversion:

```cpp
template<typename T>
struct ConvertHelper {
    constexpr inline T operator()(ComponentBase* ptr) const {
        using refless = std::remove_reference_t<T>;
        if(ptr == nullptr)
            throw std::invalid_argument("Not allowed");
        return *(static_cast<refless*>(ptr));
    }
};
```
This is pretty easy: it has one method, which converts a `ComponentBase*` to the correct `T`.
Now, it may seem like we want an *array* of these values.
However, we actually can't do that!
Each `ConvertHelper` has a unique type, and `std::array` can only store one type.
Thankfully, there's another way to get a sequence of different types: use a `tuple`.

A tuple is an ordered list of values, each of which may have a different type.
In our case, we want a list of different `ConvertHelper<T>`s.
To use our canonical example, for `eachEntity<Image&, Position&>`, we want an `std::tuple<ConvertHelper<Image&>, ConvertHelper<Position&>>`.
We can define a function that returns that rather easily:

```cpp
template <typename... Ts>
inline constexpr auto getConverters() {
    return std::make_tuple(ConvertHelper<Ts>{}...);
}
```

Awesome.
This is easy to use:

```cpp
template <typename... Ts, typename Func>
void World::eachEntity(Func callback) {

    std::array<ComponentSystem*, sizeof...(Ts)> comps{
        getComponentSystem<Ts>()...
    };
    auto converts = getConverters<Ts...>();
    // rest goes here
}


```
So, now we have an array of `ComponentSystem*`, and a tuple that converts them to the right type.
The only question now: how do we use them?

# `index_sequence` and static, compile-time iteration.

We can't actually use a `for` loop to iterate over our `ComponentSystem` array *or* our `tuple`.
Why?
Because we want to pass the result as arguments, and it's not actually possible to do something like:

```cpp
callback(ent, for(int i = 0; i < sizeof...(Ts); ++i) { getArgument<i>() });
```

That's not a valid place for the loop!
No, we need to somehow use a *parameter pack expansion* to pass our desired values as arguments.
It's fairly easy to see that the *best* way to do this is to get a pack of *indexes*.
We want to do something like this:

```cpp

// std::get<i> returns the ith item of a tuple:
callback(ent,
        (std::get<Indexes>(converts)(comps[Indexes]->tryGet(ent)))...);
```

What is `Indexes`?
Well, it should be an in-order list of the indexes we need into the `converts` tuple and the `comps` array&mdash;or, essentially, `{0, 1, 2, ..., sizeof...(Ts)}`.

Using our initial, two-argument example, it should look something like this:

```cpp
callback(ent, 
         std::get<0>(converts)(comps[0]->tryGet(ent)), 
         std::get<1>(converts)(comps[1]->tryGet(ent)));
```

C++ provides a mechanism for doing this, funnily enough!
It's called an [index sequence](http://en.cppreference.com/w/cpp/utility/integer_sequence).
The way you use it, however, is a bit bizzare.

Let's look at the code first, then go over it:

```cpp
template <typename... Converts,
          typename CB,
          typename Idx = std::make_index_sequence<sizeof...(Converts)>>
inline void invokeConverters(CB cb,
                             Entity& ent,
                             std::tuple<Converts...>& converts,
                             std::array<ComponentSystem*, sizeof...(Converts)>& systems) {
    invokeConvertersImpl(cb, ent, converts, systems, Idx{});
}

template <typename... Converts, typename CB, size_t... Idxs>
inline void invokeConvertersImpl(CB func,
                                 Entity& ent,
                                 std::tuple<...Converts>& converts,
                                 std::array<ComponentSystem*, sizeof...(Converts)>& sra,
                                 std::index_sequence<Idxs...>) {
    func(ent, (std::get<Idxs>(converts)(sra[Idxs]->tryGet(ent)))...);
}
```

Not examply nice, huh?
Well, let's go over it to see how it works.

First off, we have the `invokeConverters` function.
It takes 4 arguments:

1. A callback to call, `func`. This is the `callback` parameter from earlier.
2. An `Entity&`.
3. The `tuple` of `ConvertHelper<T>` structs
4. The `std::array` of `ComponentSystem*`.

Now, the question is: what the heck is that last template parameter?
```cpp
typename Idx = std::make_index_sequence<sizeof...(Converts)>
```

This is where things get a bit tricky.
See, it's an alias for the *index sequence* of size `sizeof...(Converts)`.
Using our previous example with two arguments, it is `std::index_sequence<0, 1>`.
This is actually the heart of the trick.

See, we call `invokeConvertersImpl(cb, ent, converts, systems, Idx{})`.
This is equivalent to calling `invokeConvertersImpl(cb, ent, converts, std::index_sequence<0, 1>{})`.

Now look at the template arguments for `invokeConvertsImpl`.

```cpp

template<typename... Converts, typename CB, size_t... Idxs>
```

Notice how we have a parameter pack of `size_t`.
And where do we use it?
in the last argument of `std::index_sequence<Idxs...>`.

In C++, the compiler can *infer* the template arguments of a function based on the arguments to that function.
If you have something like:
```cpp
template<typename T>
T add(T a, T b) { return a + b; }
```
And call it like `add(10.0, 10.0)`, the compiler knows to call `add<double>(10.0, 10.0)`.
Well, we call `invokeConvertersImpl` with the *last argument* as `std::index_sequence<0, 1>{}`.
The compiler sees that the signature of `invokeConvertersImpl` has the last argument of `std::index_sequence<Idxs...>`.
So, it can assume `Idxs = {0, 1}`.
This *gives us the parameter pack of indexes we wanted*.
We can then expand this parameter pack to get the proper arguments, just as we desired!

This template argument inference "trick" is very useful, but it doesn't make for very clean or readable code.
In fact, I'd argue that this code is... kind of gross.
However, right now, this is the best (and only) way to properly iterate over elements of a tuple and/or array at compile time, to the best of my knowledge.
Hopefully a future language version will add more readable facilities for doing this that do not rely on gross tricks.
Until then, this gets the job done.

Our final code looks like this:

```cpp
template <typename... Ts, typename Func>
void World::eachEntity(Func callback) {

    std::array<ComponentSystem*, sizeof...(Ts)> comps{
        getComponentSystem<Ts>()...
    };
    auto converts = getConverters<Ts...>();
    for(int i = 0; i < entities.size(); ++i) {
        auto& ent = entities[i];
        if(ent && ent.hasComponents<Ts...>) {
            invokeConverters(callback, ent, converts, comps);
        }
    }
}
```

Using our cannonical example again, this eventually becomes:

```cpp
template <typename Func>
void World::eachEntity<Image&, Position&>(Func callback) {
    std::array<ComponentSystem*, 2> comps{
        getComponentSystem<Image&>(), getComponentSystem<Position&>()
    };
    auto converts = std::make_tuple(ConvertHelper<Image&>{}, 
                                    ConvertHelper<Position&>{});
    for(int i = 0; i < entities.size(); ++i) {
        auto& ent = entities[i];
        if(ent && ent.hasComponents<Ts...>) {                 
            invokeConverters(callback, ent,
                             std::get<0>(converts)(comps[0]->tryGet(ent)),
                             std::get<1>(converts)(comps[1]->tryGet(ent)));
        }
    }
}
```
# Coda

This optimization allowed my engine to go from about ~93 FPS to around ~143 FPS in debug mode, and from around ~800FPS to ~1100FPS in release mode.
I was very impressed with this speedup.
However, I sort of neglected to realize that I was testing with approximately two orders of magnitude more entities than are ever likely to be rendered in my specific game.
This was a fun optimization, but my time might have been better spent doing other things.

I don't neccisarily see that as an awful thing, however.
I'm trying to make a game, but I'm also trying to learn C++ to the fullest.
This certainly taught me a lot about parameter packs, and how to think about optimizations like this.
Who knows?
Maybe one day I'll make a game that *is* very performance-intensive, and be able to put these tricks to use.

Assuming I can get something this ugly past code review, at least.

