---
title: "Writing about Haskell is Hard"
layout: post
categories: ["thoughts", "haskell", "languages"]
---

If your first thought upon clicking on a blog post entitled "Writing about Haskell is Hard" was "I bet this guy was writing a very different sort of post, got frustrated, and went back to the drawing board," congradulations, you're right!
Because when I sat down after work and decided to do some blogging about programming, I originally wanted to write an introduction to my new JSON library, [`jordan`](https://github.com/anthonysuper/jordan).
Jordan has a few features that I haven't seen in other JSON parsers:

- Jordan directly generates *wire-format parsers* for your custom types.
  That is, if you have a data type like:

  ```haskell
  data Person 
    = Person 
    { name :: String
    , age :: Int 
    }
  ```

  And you're trying to parse this in the obvious way:

  ```json 
  {
    "name": "Bob Smith",
    "age": 55,
    "profession": "writer"
  }
  ```

  Jordan will *not* construct any sort of `Map<String, JSONValue>` in the middle.
  It also *will immediately discard the "profession" key*.
  With a bit of refactoring (which I plan to do soon), it won't even ever *store a string for "writer" in memory*.
  Jordan will instead generate an actual UTF-8 Parser that directly converts from your type to JSON.
- Jordan directly writes *wire-format JSON* without any intermediate types, either.
  You can even write the JSON *right to a file handle*, which potentially saves on memory consumption in a serious way.
  Haskell's default JSON library, [`aeson`](https://hackage.haskell.org/package/aeson), also supports this (and supports it in a way that's marginally faster than Jordan without compiler flags),
  but it's not *required* for all types, just an option you can (and should) make use of
- Jordan can *generate documentation* for your JSON types, *using the same definitions as your parsers and serializers*.
  That is, if you write some way to parse or serialize JSON, you can generate OpenAPI types *automatically* with no intermediate step.
- Jordan parsers and serializers are in an *abstract, user-extendable format*.
  So, if you have some crazy wire protocol for sending JSON, like `BSON` or whatever, you can probably write a Jordan "interpreter" that
  will *directly serialize to that*.

These features are all, in my opinion, very cool.
They're not only efficient, but they solve the "Documentation about JSON format and actual JSON format are out of sync" problem, which is the bane of my freaking existence on many web-dev projects.
I wanted to write a blog post explaining how Jordan works, and how Haskell helped me to write it.

My first post was a disaster that I discarded.
Here's a second attempt.

<!-- more -->

## A feeble attempt at sketching the basics

Let me try to give a really simplified explanation of how Jordan works.
This is not going to be anywhere near as complicated as my original blog post.
Instead, I am going to focus on *what I wanted*, and how Haskell helped me get there&mdash;without specifying *exactly* how, for reasons we'll get to later.

### Rank-N Types: Sorta like Interfaces, but Backwards

In order to make Jordan work, I want to keep the idea of parsing and serializing *abstract*.
More specifically, I want a "JSON Serializer" or a "JSON Parser" to be encoded as a series of instructions on *how* you should parse or serialize JSON.
I then want to be able to plug in different strategies for interpreting those instructions at runtime, in a way that's performant.

The reason for this is pretty simple: if I can represent everything as instructions, I can use these instructions to compile into different formats.
So, if you tell me:

> To parse a `Person`, you need to parse an object, where the key `"name"` is a string and `"age"` is an int

I can construct:

- An actual *parser* that directly parses that JSON.
  Thanks to Haskell's laziness, I can even generate a parser that works on *any permutation order of keys*, which we'll get to later
- Some *documentation* that knows what keys are in the JSON and what types they have

In order to construct these things, I need to make sure:

- JSON parsing is kept *entirely abstract*, IE, you can't specifically say "I'll use a wire-format parser here"
- Those abstract instructions can be *converted to anything I want at any time*.
  That is, I should be able to use the same instructions to generate the documentation *and* generate the real parser.

To do this, I use something called a Rank-N type.
To really oversimplify, this is kind of like an interface "in reverse."
If I have some TypeScript definitions, like this:

```typescript
interface Animal {
  speak(): string;
  eat(): string;
}

class Cat implements Animal {
  speak() { return "meow"; }
  eat() { return "*munches mice*";}
}

class Bird implements Animal {
  speak() { return "chirp"; }
  eat() { return "*munches fruit*"; }
}

function doThingsWithAnimal(animal: Animal) {
  // Pay attention to this functio
}
```

Inside the *body* of the function `doThingsWithAnimal`, the interface restricts *what I can do*.
That is, the only things I can call on `animal` are `speak()` and `eat()`.
The actual argument type is abstract, and I *cannot* make it concrete.

In Haskell, I can write a type like this: 

```haskell
doThingsWithAnimal :: (forall a. (Animal a) => a) -> String
```

What this says is that my argument can be *converted to any animal I want*.
That is, I can say:

```haskell
doThingsWithAnimal (Cat cat) = undefined -- put in something you can only do with cats
```

This is not a type-cast.
I am not doing the following typescript:

```typescript
function doThingsWithAnimal(animal: Animal): string {
  if(animal instanceof Cat) {
    // use a cat
  }
}
```

Instead, because I know that the argument to my function has an *abstract type* representing *any animal*, I can convert it to any animal I want.
I can even do this conversion multiple times:

```haskell
doThingsWithAnimal a = "The cat says '" <> speak cat <> "' the bird says '" <> speak bird <> "'"
  where
    cat :: Cat
    cat = a
    bird :: Bird
    bird = a
```

That's why it says `forall.`
It's not an argument that can work with *any* animal&mdash;it's an argument that can be converted to *all possible animals*.
This isn't limited to just animals that it knows about, either.
If I define new animals, a value with type `forall a. (Animal a) => a` can be converted to them to.
It can even do that conversion if I don't export that type, and keep it private in a module.
It's not lying: it is convertible to *all* animals, forever and always, amen.

This is the key trick that makes Jordan work.
The way you parse an object key in Jordan is:

```haskell
parseFieldWith
    ::  T.Text
    -- ^ Label of the field.
    -- Will be parsed into escaped text, if need be.
    -> (forall valueParser. JSONParser valueParser => valueParser a)
    -- ^ How to parse the field.
    -- Note the forall in this type signature: you cannot have this be specific to
    -- any particular implementation of parsing, to keep the parsing of a JSON abstract.
    -> f a
```

That is, it works with *anything that can act as a JSON parser*.
So, when we generate documentation, we can convert this argument to a concrete type of a *documentation generator for the field*.
When we make an actual parser, we can convert this argument to a concrete type of a *parser for a field*.

But there's another key to the trick: as part of the "interface" (actually a Typeclass, but we'll get to that later) for `JSONParser`, we have:

```haskell
parseObject
    :: T.Text
    -- ^ A label for the object.
    -- This label should, as much as possible, be "globally unique" in some way.
    -- This will enable better generation of documentation.
    -> (forall objectParser. JSONObjectParser objectParser => objectParser a)
    -- ^ Instructions on how to parse the object.
    -- Note that the actual implementation is kept abstract: you can only use methods found in JSONObjectParser, or
    -- combinators of those methods.
    -- This ensures that we can generate the proper parser in all cases.
    -> f a
```

So, the fields of objects can *also be objects*, and those objects must also be defined in an *abstract way that we can convert to anything*.
From here, I can basically implement all my interfaces with a type that does actual parsing, and a type that does documentation generation.
The type that does parsing will *convert the second argument to a real parser* for `parseObject`, and *convert the second argument into a real parser* for `parseFieldWith`.
The type that does documentation generation will *convert the second argument to a documentation generator* for `parseObject`, and *convert the second argument into a documentation generator* for `parseFieldWith`.

We use a similar scheme for serializers.

### `Applicative`: Effects, but Limited

One of the other things that Haskell has is the `Applicative` typeclass.
`Applicative` is interesting, because it's incredibly useful, but also esoteric enough that Haskell added *monads first*, despite Applicatives being a sort of "more basic" thing than monads.
Explaining how it works is difficult, but I am going to try my best.

Often times in programming we want to work with values that have some sort of "context" surrounding them.
This complication might be that the values are "actually maybe not there" (IE, they could be `null`).
It could be that the values are "actually a list of values".
It could be that the values are "values, but I need to call my database to get them."
Whatever the case, we can say that these values are "wrapped in some context."
All of these are examples:

```haskell
intThatMayBeNotThere :: Maybe Int
intThatIsActuallyAListOfInts :: [Int]
intThatRequiresMeToCallTheDatabse :: IO Int
```

The problem now becomes "what if I want to add two values-with-context together?"
IE, if I have:

```haskell
maybeLhs :: Maybe Int
maybeRhs :: Maybe Int
```

How do I apply `+` to them?

Well, in Haskell, you can use *Applicative* to do this.
`Applicative` is a type class, and it describes *how to work with a context*.
Importantly, it's a class for the *context bit*.
You define it on `Maybe` itself, not `Maybe Int`, or `[]` itself, not `[Int]`.
If you can define it for `Maybe`, it will work with `Maybe Int`, and `Maybe String`, and `Maybe MyPerson`&mdash;whatever type you want to stick in the `Maybe`, you can use the methods of `Applicative` with it.
So, if I want my "type that adds context" to be `Applicative`, I need to define two things:

- A way to take a "normal" value, and put it "in context."
  That is, if I am given:

  ```haskell
  foo :: Int
  foo = 10
  ```

  You have to tell me how to make:

  ```haskell
  fooInMaybeContext :: Maybe Int
  ```

  This function is called `pure`. 
  It has this type:

  ```haskell
  pure :: a -> f a
  ```

  That is, I should be able to take *any* type, and wrap it up in whatever context I'm defining.
- A way to take a function in this context, and a value in this context, and apply it.
  The type signature might help the understanding here:

  ```haskell
  (<*>) :: f (argument -> result) -> f argument -> f result
  ```

  If we plug in a particular complication, like `Maybe`, we get:

  ```haskell
  (<*>) :: Maybe (argument -> result) -> Maybe argument -> Maybe result
  ```

  This basically lets us lift *calling a function* into our context.
  Importantly, though, the function is in context two.
  Since all Haskell functions are curried, IE, these are equivalent:

  ```haskell
  makePerson :: Name -> Age -> SSN -> Person
  makePerson' :: Name -> (Age -> (SSN -> Person))
  ```

  You can actually apply as many functions as you want:

  ```haskell
  maybePerson :: Maybe Person
  maybePerson = pure makePerson <*> maybeName <*> maybeAge <*> maybeSsn

  -- | Sometimes writing out the types can help:
  maybePerson' :: Maybe Person
  maybePerson =
    (((((((pure makePerson :: Maybe (Name -> Age -> SSN -> Person)) 
        <*> maybeName) :: Maybe (Age -> SSN -> Person))
        <*> maybeAge) :: Maybe (SSN -> Person))
        <*> maybeSsn) :: Maybe Person)
  -- You can see that each instance of <*> "applies one argument"
  ```

  Note, however, that I can't chose to "take some effects" and "ignore some others."
  Since all I have is function application, I can't sneak an `if` statement in there or something

These two concepts&mdash;put anything inside a context, and apply functions within a context&mdash;are a key part of Jordan.
The way it works is similar to the trick I pulled with `forall`: I promise you a JSON Object parser will be in some context, and that this context will be an `Applicative`, but I do not say *which*.
You, you're basically forced to write something like this:

```haskell
parsePersonObject :: (JSONObjectParser objectParser) => objectParser Person
parsePersonObject 
  = pure makePerson 
  <*> parseFieldWith "name" parseString 
  <*> parseFieldWith "age" parseInt
  <*> parseFieldWith "ssn" parseString
```

Now, if I want to make an *actual parser*, all I need to do is make sure it works with `Applicative`, and this definition will work.
If I want to make a *documentation generator*, too, I just need to make it an `Applicative`.
In fact, the documentation generator *never actually calls `makePerson`*!
It basically does this

```haskell
  pure _ignored = Documentation (emptyDocumentation)
  (Documentation docsA) <*> (Documentation docsB) = Documentation (mergeFields docsA docsB)
```

Interesting, this is also something you basically cannot do in a language like typescript.
You can't really specify an interface for a generic type, IE, this doesn't work:

```typescript
interface Applicative<T> {
  pure<I>(arg: I): T<I>;
  apply<Arg, Result>(f: T<(a: Arg) => Result>, a: T<Arg>): T<Result>;
}
```

You can sort of fake it, like `fp-ts` does, but it's ugly.
Real ugly.
Meanwhile, in Haskell, specifying a type class for a "generic" (technically the proper term is higher-order) type is easy.
I mean, hell, here's one that might occasionally be useful:

```haskell
class ConstructEmpty container where
  emptyContainer :: container a
  -- Construct a container with nothing in it. 
```

## The Problem: All this Stuff is Useful, but Weird

So.
What's the core issue I encountered when trying to write my first blog post?

Well, I tried to actually explain what's going on.
I went into detail about how typeclasses work, what a higher-kinded types is, and what a Rank-N Type is.
Because, frankly, some of the explanations I gave in this blog post are misleading at best.
You wouldn't ever actually write `pure makePerson`, for example, because you'd want to use `<$>` instead, which is a method of `Functor`, which "sits above" `Applicative` in a "typeclass hierarchy."
But, if I wanted to explain *that*, I'd have to explain what `Functor` is, and what a typeclass hierarchy is, and all sorts of horrible shit like that.

As it stands, I am not sure if this blog post even makes sense to a non-haskeller.
I am going to send it to some friends to see if they get it.

The issue is that none of these things are "too complicated" or "pointlesly mathy."
The features I described&mdash;Rank-N types and `Applicative`&mdash;are both *essential* to how Jordan works.
Even Haskell's lazy evaluation, considered by some to be a misfeature, is the only reason why Jordan can parse an object with keys in *any order* without resulting in weird hacks (it lazily evaluates every possible permutation of parsers).

You could of course think of an alternate way to get the same results.
Maybe you have some type, `JSONParserBuilder`, which lets you parse fields and values, and combine them together.
You could have an interface that's sort of like this, I guess:

```typescript
const PersonParser = JSONParserBuilder.object(
  [
    JSONParserBuilder.objectKey('name', JSONParserBuilder.string()),
    JSONParserBuilder.objectKey('age', JSONParserBuilder.number()),
    JSONParserBuilder.objectKey('ssn', JSONParserBuilder.string())
  },
  ([name, age, ssn]) => new Person(name, age, ssn)
);
```

But this parser, unfortunately, will be a little janky.
If you want to do any sort of recursion, you'll get stuck, for example:

```typescript
interface Person {
  name: string;
  age: number;
  ssn: string;
  children: [Person]
};

const PersonParser = undefined; // How do I use `PersonParser` while I'm writing `PersonParser`?
```

Once you're using Haskell, all of this is quite natural&mdash;`Applicative` is an extremely common class to work with, so writing object parsers comes naturally.
The Rank-N type trick that it uses is almost entirely transparent: as long as you only use methods of `JSONParser`, it will *just work*.
And, even more interestingly, Haskell has powerful generic functions.
So most of the time, *you don't even have to use the library yourself*.
You can just write the following:

```haskell
data Person 
  = Person 
  { name :: String
  , age :: Int
  , ssn :: String
  , children: [Person]
  } deriving (Generic)

instance ToJSON Person
instance FromJSON Person
```

Those two `instance` lines of code get you:

- Automatic, well-optimized parsing of JSON objects
- Automatic, direct-as-possible serializing of JSON objects
- Automatic OpenAPI Documentation for your types

I think that's pretty cool.
Other languages might be able to get you something similar&mdash;Rust lets you [derive your own traits](https://doc.rust-lang.org/book/ch19-06-macros.html#how-to-write-a-custom-derive-macro), so that might be able to help you a bit.
I'm sure you can do something like this in Lisp.
Hell, I even wrote a library in Ruby that gets you [documentation for JSON types](https://github.com/SonderMindOrg/sober_swag) for work.

But I haven't seen a library that gets you *everything* Jordan does, while still using *common languages idioms*.
Because of the way Haskell code tends to work, everything in Jordan comes together extremely nicely.
The level of abstraction it works with is common in the language.
The compiler helps you out all over the place, inferring types instead of making you write them explicitly, and providing reasonably good error messages.
Once you understand the *concepts*, the actual *use* is simple.

And that's sort of the problem.
Let's say I wanted to introduce Jordan at work, as part of a drive for a Haskell web service.
I'd have to explain to everybody what the hell Rank-N types are&mdash;and that would take time.
They'd have to learn the tooling&mdash;and that would also take time.
Time that I think is ultimately *worth it*, but time nonetheless.

Many people have critiqued Haskell on this exact thing&mdash;"Yes, it's cool, but it's hard to use! It has weird stuff in it!"
I honestly have to agree with them here, but the problem is that I don't see any way out.
In order to write something like `jordan`, or one of the many other Haskell libraries that can do cool stuff (I generate parsers with [`attoparsec`](https://hackage.haskell.org/package/attoparsec), which uses some "weird Haskell features" to make their parsers speedy and easy to write), you *need* the weird stuff.
The weird stuff is what *enables* the cool stuff.

There's a group of Haskellers who advocate for "boring Haskell," which basically means "Haskell, but keep it as simple as possible."
I sympathize with their intentions, but I don't think the execution is correct.
"Boring Haskell" is a good language, but it's nowhere *near* as good of a language as "weird Haskell."
The juice is worth the squeeze here: you can do *extremely* cool things with the more advanced Haskell features, things that other languages really struggle with achieving. 
These things are actually worth it: the weirdness in Jordan is what enables all of its practical benefits.

So, if getting rid of or ignoring the hard stuff is a mistake, the most important thing we can do is *lower the price elsewhere*.
Haskell's tooling is already *much* better since I've started using the language thanks to the [haskell-language-server](https://github.com/haskell/haskell-language-server) project.
There's work being done on improving compiler error messages.
Recent extensions, like `-XRecordDotSyntax`, have made things even better.
I think it's worth it to go further: take the parts of the language that sort of suck, like the Records system in general, and make better versions.
Ideally make a good version, sure, but people have been talking about how badly Haskell needs extensive records for *ages* and it's still not been done yet.
The more warts we can sand off, the less "weird core" will still exist, and the lower the "price of Haskell" will be.

Besides general life improvements, we can help to reduce the "cost" of having to learn the weird stuff.
For that, we need to provide *education*.
We need to provide some sort of material&mdash;an online course, a book, whatever&mdash;that takes you through all of this stuff, *conceptually*, but in a way that isn't horribly boring.
I don't consider this blog post to be a part of that&mdash;it's a good introduction, hopefully, but it's too oversimplified.
In-depth tutorials that help people learn the more esoteric parts of the language, and when they can be useful, can also help to lower the price of entry.
The more practical blog posts, like [this one](https://blog.ocharles.org.uk/guest-posts/2014-12-18-rank-n-types.html) on Rank-N Types, the better.
I'm not suggesting this is easy.
This blog post is about why it's *hard* for a reason.
I just think the difficulty is *worth it*.

The other end of the spectrum is increasing the expected value.
The more "killer apps" Haskell has, the more somebody can justify reading a book or watching a lot of youtube videos.
I think some recent libraries, like [IHP](https://ihp.digitallyinduced.com/), are going to help us along the way.
I, of course, think that Jordan is also a pretty cool thing to have.

None of the above is really new information, of course.
I think "make your language easier to use and more useful so more people use it" is as basic as it gets.
Still, I think it's helpful to keep in mind that we can make Haskell better *without* removing or discouraging the use of the stuff that makes it special.
