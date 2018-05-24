---
title: "Monads. But Backwards"
layout: post
categories: [programming, haskell, theory]
---

It's basically impossible to write anything that tries to introduce people to monads.
It's a rather [famous curse](https://byorgey.wordpress.com/2009/01/12/abstraction-intuition-and-the-monad-tutorial-fallacy/).
Heck, the Haskell wiki specifically says that ["Monads are not a good choice as a topic for your first Haskell blog entry"](https://wiki.haskell.org/What_a_Monad_is_not).

This is my first Haskell blog entry.
It's going to be about Monads.

I do have something slightly novel to bring to the able, though: I'm going to do it backwards.
Let's begin.

<!--more-->

## At a high level: Crap we don't want to deal with

Let's say I'm a programmer, and there's some crap I have to deal with.
This describes quite a lot of programming, actually.
Maybe I have a problem where some values might be missing.
Maybe there's possibly errors that I'll eventually need to check.
Maybe I'm working in a purely functional language and I want to do things that touch the icky, gross, non-mathematically-pure real world.

But I'm a programmer.
I don't want to have to care about those things.
I want them all to go away.
I'll have to deal with that crap later but for now I want to just pretend that all that context doesn't exist.

Let's do a motivating example: I'm writing a bit of software in Java related to image processing. 
I want to:

1. Take an image
2. Find the creator of that image
3. Process the image to said creator's specifications
4. Send the image to the creator's destination
5. Send the creator a notification to their notification email
6. Return the processed image

There's only one problem: *any* of those values might be null.
Any of them.
And if any one is null I should just bail out, because it's pointless to do the calculations.
So, let's see how this might look:

```java
class ImageProcessor {
    public static ProcessedImage process(Image image) {
        if(image == null) return null;
        User user = UserFinder.userFor(image);
        if(user == null) return null;
        ProcessSpec spec = user.processSpec;
        if(spec == null) return null;
        ProcessedImage processed = ProcessorRobot.processImage(image, spec);
        if(processed == null) return null;
        ImageDestination dest = user.imageDestination;
        if(dest == null) return null;
        DestinationSender.send(processed, dest);
        Email email = user.notificationEmail;
        if(email == null) return null;
        NotificationSender.send(new ImageProcessedNotification(processed, dest), email);
        return null;
    }
}
```

*Yikes*.
Obviously this code isn't perfect, but it's a good example of some crap I don't want to deal with.
Really, if you think about it, everything here is one *specific kind* of crap I don't want to deal with: the possible non-existance of some values.
And I always do the same thing, too: I just bail.

This seems like something that can be abstracted away rather nicely, doesn't it?
I think so!
Let's say that we have a "magical" (it's not magic at all but we're working backwards so suspend disbelief for a bit) context that gets rid of this crap.
We no longer need to care that these values are Maybe nonexistent.

Let's see what that might look like, shall we?

```haskell
-- In Haskell, in order to say a value "might not exist", we say that it's "Maybe" something.
-- So, this function "Maybe an Image, maybe nothing" and returns "Maybe a ProcessedImage, maybe nothing."
-- The important thing is that we *don't have to care*
processImage :: Maybe Image -> Maybe ProcessedImage
processImage image = do -- And here we get into the magic context!
    img <- image
    user <- userFor img
    spec <- specFor user -- Haskell doesn't need parens, like ruby!
    processed <- innerProcess image spec -- It also doesn't need commas, wow
    destination <- destinationFor user
    sendImage process destination
    email <- emailFor user
    sendNotification (processNotification processed dest) email
    return processed
```

Here's how this works:
When I say `img <- image`, I say "Just give me the real value, please, I don't want to deal with the fact that it might not exist."
The same thing happens with `user <- userFor image`.
I know the user might not exist, and I *don't want to deal with that right now*.
I'm going to work with this user if it exists.
Otherwise, just make the result of this entire *block* `null` (or, in Haskell's case, `Nothing`).
Get it away from me, I don't care.

(Yes, I know that this isn't actually totally-valid Haskell, but this is to illustrate a point).

## Other Kinds of Contexts: A List

There's other cases where we work in contexts in programming.
A good example: working with lists.
Let's say that I have a big list of parties.
Each list has a big list of guests.
Each guest has a big list of allergies.
I'm doing catering for all of these people and I want to know what foods to avoid.
So I want to transform all these lists into one: a list of all the allergies of all the guests in all the parties.
Let's see how that would look in Java:

```java
class AllergyGetter {
    public static ArrayList<Allergy> getAllergies(ArrayList<Party> parties) {
        ArrayList<Allergy> allergies = new ArrayList<>();
        for(Party party : parties) {
            for(Guest guest : party.getGuests()) {
                for(Allergy allergy : guest.getAllergies()) {
                    allergies.add(allergy);
                }
            }
        }
    }
}
```

*Yikes*.
That's a lot of indentation.
But let's *really* think about this for a while.
The fact that all those values are lists?
That's really just noise.
That's just a *context*.
That's just *crap I want to ignore*.
What I really care about is all the values in those lists.
Wouldn't it be nice if I could just work with them directly?

```haskell
-- Take a list of parties, return a list of allergies
getAllergies :: [Party] -> [Allergy]
getAllergies parties = do
    party <- parties
    guest <- guestsFor party
    allergy <- allergiesFor guest
    return allergy
``` 

This particular example is a bit tricky.
It *looks* like I'm just taking one party from the party list, one guest from the guest list, and one allergy from the allergy list.
But what I'm actually doing is *taking things out of the list context*.
I want to consider each item individually, and I do that!
But, behind the scenes, dark magic (again, not actually magical, suspend disbelief) happens to properly take care of the context for me.
So when I say `party <- parties`, it really means "Let me consider just one party for a bit, please. You can take care of running this on the entire list for me."
The same thing happens with I say `guest <- guestsFor party`.
"Let me just work with 'one' guest, then you can really make it the entire list of guests later."
All of that list crap?
We don't want to deal with it! 
Let's just show you how to get an individual allergy, and we'll be right there.

There's actually a way to modify this code to make it a bit simpler:

```haskell
    allergy <- allergiesFor guest
    return allergy
```

In Haskell, the `return` doesn't mean "return from the function."
It means "return to the *context*."
Or, in this case, go from "Considering a single thing" to "Work with a list of things".
Actually, for lists, return has the simplest definition you could think of:

```haskell
    -- Return takes something of any type and returns a list of things of that type
    return :: a -> [a]
    return a = [a]
```

So, really, getting each allergy is pretty redundant.
`allergiesFor` is a list already.
So we can simplify to:

```haskell
-- Take a list of parties, return a list of allergies
getAllergies :: [Party] -> [Allergy]
getAllergies parties = do
    party <- parties
    guest <- guestsFor party
    allergiesFor guest
```

Bam, back in the list context.

## A bit spookier: Contexts we can't see and IO

Let's talk about IO.
IO stands for "input/output."
If you're moving signals to a computer monitor, downloading bytes from the network, reading input from a keyboard&mdash;congrats, you're doing IO.

In most languages we can do IO anywhere we like.
But let's really think about that for a few seconds.
If we wanted a really safe language&mdash;a language where you can tell if `launchBombs` performs a simulation and returns a list of targets or actually starts a nuclear war, for example&mdash;then IO suddenly becomes crap we need to deal with.
In a multithreaded program, for example, we don't want to write to the same file in two threads!

But IO goes a bit beyond that.
Really, if you think about it, touching any kind of global state is *kind of* IO.
You're *inputing* values when you read a global variable, and you're *outputting* values when you write to one!
Heck, any kind of variable modification sort of works like this.
When you have multiple threads things can be a big chore.

In some languages, IO is *explicitly* crap you have to deal with.
Haskell, famously, is one of them.
If you want to read a character from the keyboard, you don't have a function like `getChar :: Char`.
No, you have `getChar :: IO Char`.
You can't just `putStrLn :: String -> ()` (where `()` is the Haskell equivalent of `void`), you have to `putStrLn :: String -> IO ()`.
The fact that you're doing input/output is *some crap you have to deal with.*

But it's also crap in a *context*.
That context is, for lack of a better term, the "real world."
The `getChar` function has to deal with the *context* that somebody is going to be mashing a button on a keyboard somewhere and the OS is going to tell us about that.
Writing to a network has to deal with the *context* that it's actually sending some electricity through a bunch of wires.
From a logical perspective, this makes a lot of sense.
Those functions aren't really *functions* in the same way that `+` or `-` or `factorial` are.
They do or wait for something in the *context of reality*.

You can probably see where this is going by now:

```haskell
main :: IO ()
main = do
    input <- getLine
    putStrLn input
    putStrLn (toUpper input)
    return ()
```

Think about this for just a moment.
When I run `input <- getLine`, what I'm really saying is "I know that this function actually touches the real world, and that is *crap I don't want to deal with*. Please just give me the line of text so I can mess with it like it's just nice, safe, theoretical text and not some scary real-world thing somebody created by mashing on a keyboard."
This is fairly intuitive.
Where things get special, though, is when we consider these two lines:

```haskell
    putStrLn input
    putStrLn (toUpper input)
```

This seems boring at first, but it's actually doing something rather special: it's *running the functions in a sequence*.
Now, in most languages that's a given, but why should it be?
Time is only something that exists in the real world!
In math, (4 + 4 = 8) and (2 + 2 = 4), and it doesn't matter what order I write those expressions in.
They're just true.
They were even true before I wrote them down.
The fact that you read them at some specific time doesn't really matter at all from a mathematical perspective.
You're not *currently* reading them, but it's still a correct statement.
The fact that we need to "print something, *and afterwards* print something else" is only an artifact of the scary real world.

A lot of the time we don't want to deal with this fact.
We just want to print something, and then another thing.
The fact that math doesn't work like that is *just some crap we don't want to deal with*.

Monads are a way for us to do things in a *context*.
They're a way for us to ignore the *crap we don't want to deal with*.
As you can tell from the last few sections, this is surprisingly powerful.

## Concrete, or "The part where we start explaining how monads actually work"

Let's stop the fancy `do` notation things and get down to the hard part: how the hell monads work.
As it turns out, you can make a Monad using a very simple set of operations.
Lists are monads.
`Maybe` is a monad.
Doing `IO` is a monad.
And all of them only have a few things defined.
Unfortunately, the first thing all monads must have defined is a `Functor`.
So, we need to take a small detour to talk about those.
Thankfully, they fit well with the theme of "Let me ignore crap and deal with it later," so hopefully this won't be too jarring.

A functor is a Haskell `class`.
`class`es in Haskell aren't like OO classes.
If anything they're closer to an interface.
They describe *what* functionality needs to be there, and somebody else actually implements that functionality for their own types later.
So, what are the requirements for a `Functor`?

```haskell
class  Functor f  where
    fmap        :: (a -> b) -> f a -> f b

    (<$)        :: a -> f b -> f a
    (<$)        =  fmap . const
```

So functors have two operations, `fmap` and `<$`.
Conveniently, however, `<$` is defined for all functors already using `fmap`.
So if we can figure out how `fmap` works, we can make a functor.

`fmap` has this signature:

```haskell
fmap :: (a -> b) -> f a -> f b
```

Well, first off, let's consider those `f`s.
They're the context.
The crap we don't want to have to deal with.
So, we have some function which takes a value of type `a` and turns it into a value of type `b`.
These don't necessarily have to be different, of course, but they're allowed to be.
We also have a value of type `f a`, or "An `a` wrapped up in some crap I don't want to deal with".
`fmap` lets us "mush" those two things together: it takes care of the crap we don't want to deal with, applies our function, and re-wraps it nicely in crap we don't want to deal with so we can deal with it later.

An example is probably helpful here:

```haskell
addTwo :: Int -> Int
addTwo x = x + 2

fmap addTwo [1, 2, 3, 4]
-- = [3, 4, 5, 6]
```

Think about it for a minute.
`addTwo` is a nice function that takes a single integer and adds two to it.
`[1, 2, 3, 4]` is a gross, nasty list of integers.
The list part is the crap we don't want to have to deal with.
We already know how to add two to a given integer, so can we just do that?
`fmap` makes it possible!
It takes integers out of the list context, applies our nice function to them, and puts them back into the list context.
Easy.

So, what about that `<$`?
Well, it has a signature of `a -> f b -> f a`.
You can think of this as *replacement*.
We have an `a`, we have a `b` in some kind of context, and we really want an `a` in that same context.
A good example:

```haskell
1 <$ ["Foo", "Bar"]
-- = [1, 1]
```

We have an integer and String(s) in the `[]` context, and we want to put the integer into the `[]` context instead.
So, replace all the strings with our integer, and that works out nicely.

A slightly more interesting functor is the `Maybe` functor.
Consider a function like this:

```haskell
addTwoM :: Maybe Int -> Maybe Int
addTwoM val = fmap addTwo val
```

What if we pass it `Nothing`, the Haskell equivalent to null?
We can't really extract an integer from the "Maybe" context because there's nothing to extract!
Remember, though, that the fact that a `Maybe a` might not exist is *crap we don't want to deal with*.
That's just some context for the actual work we're trying to get done.
Remember as well that `fmap` puts things *back* in the context.
So, essentially, `addTwoM` says "We want to add two to a value, and we don't actually want to deal with the fact that value might not exist. That's somebody else's job later on."
Since it's *not our job* to deal with missing values, we can just leave it missing.

What about `fmap` for IO?
Well, we have some function, and some value in the scary real-world context.
Unfortunately, the real world is infective.
If we have a string that really comes from some girl typing on a keyboard somewhere, and a function that does things to strings, we can't just apply them together to get a normal string.
The original string still came from a gross real-world keyboard, and that means that if we apply a function to it, we've only really transformed a gross real-world value.
It's not a pure function anymore&mdash;in order to get the real-world string somebody had to type it, and in order to transform that string, that typing needs to happen *first.*
There's no such thing as *first* in a mathematical context!
Thankfully, again, this is crap we *don't have to deal with*.
We provide a way to transform strings, and let `fmap` handle actually doing the stuff to wait for the keyboard:

```haskell
getLineUpper :: IO String
getLineUpper = fmap toUpper getLine
```

Pretty easy, though!

## Getting Slightly Weirder with Applicative

Okay, so we have `Functor` down.
Now, the next thing a Monad needs is an instance of `Applicative`.
Every `Applicative` is a `Functor`, sort of like a subclass.
An Applicative must have the following things on top:

```haskell
class Functor f => Applicative f where
    {-# MINIMAL pure, ((<*>) | liftA2) #-}
    -- | Lift a value.
    pure :: a -> f a

    -- | Sequential application.
    (<*>) :: f (a -> b) -> f a -> f b
    (<*>) = liftA2 id

    -- | Lift a binary function to actions.
    liftA2 :: (a -> b -> c) -> f a -> f b -> f c
    liftA2 f x = (<*>) (fmap f x)

    -- | Sequence actions, discarding the value of the first argument.
    (*>) :: f a -> f b -> f b
    a1 *> a2 = (id <$ a1) <*> a2

    -- | Sequence actions, discarding the value of the second argument.
    (<*) :: f a -> f b -> f a
    (<*) = liftA2 const
```

This is... quite a bit grosser than `fmap`.
It still keeps the theme of some `context`, though: some *crap we don't want to deal with*.
Let's break it down.

### Pure puts things in context

`pure` is rather simple: it takes something and puts it in a context.
So, if we're in the `List` context, `pure a = [a]`.
If we're in the maybe context, `pure a = Just a` (just the value, no shenanigans---the Haskell equivalent of non-null).
These both make sense.
They take a *pure* value&mdash;a beautiful, clean, wonderful value with none of that crap we don't want to deal with&mdash;and shove it inside the context.
They add the crap we don't want to deal with.
This might seem pretty useless at first, but there's cases where it's quite nice.
If you have a function that takes a `Maybe Int`, and in this case you just have an `Int`, you can use `pure` to make things work.
You're still forcing yourself to deal with the possible non-existence of that value, of course, but if the rest of your program is set up to deal with that, it's a lot easier than re-writing everything for just using an `Int`.
There's plenty of other cases where this works out as well.

### Pick your poison: `liftA2` or `<*>`.

Now, you may have noticed something a bit odd: both `liftA2` and `<*>` have definitions, *in terms of each other*.
So `<*>` is, by default, `liftA2 id`.
Meanwhile, `liftA2 f x` is defined as `(<*>) (fmap f x)`!
They're mutually recursive.

This doesn't mean that using either puts you in an infinite loop.
It instead means that you must *define one or the other*.
You can also define both if that makes sense for what you're doing: maybe it'll be more clear when you read the code, or a lot faster at runtime.

Let's look at each individually:

#### `<*>` evaluates things in a context
The `<*>` operator has a signature of `f (a -> b) -> f a -> f b`.
So, it takes a function in a context.
That function takes an `a` and returns a `b`.
Then it takes an `a` in a context.
It returns a `b` in a context.

This is probably best demonstrated with an example: our friendly `List`:

```haskell
addTwo :: Integer -> Integer
addTwo x = x + 2
addFour :: Integer -> Integer
addFour x = x + 4

[addTwo, addFour] <*> [1, 0]
-- = [3,2,5,4]
```

So, in this case, we have function(s) in a context we don't want to have to deal with.
We also have integer(s) in a context we don't want to have to deal with.
`<*>` takes care of all the context for us.
It's quite hard to see why you might use this in the monads we've looked at so far.
After all, when are you going to put a function in a context?

Well, we could come up with a contrived example where there's some dictionary of validation functions and we want to look up a function in the dictionary and run it against some input, where either the input or the function may not exist, but it's quite hard to see where that would be useful in practice.
So, for now, we'll just leave this as "something which is kind of nice to have."

### `liftA2` evaluates contextual things smartly

Okay, so what is the signature of `liftA2`?

```haskell
liftA2 :: (a -> b -> c) -> f a -> f b -> f c
```

Hm. So, we have a binary function, a value in context, another value in context, and an output value in context.
That sounds a lot like `fmap` but for functions with two arguments.
This is a bit easier to see a use for:

```haskell
-- | A function which adds two integers, assuming those integers exist
maybeAdd :: Maybe Int -> Maybe Int -> Maybe Int
maybeAdd x y = (liftA2 (+)) x y
```

So, why not just use two fmaps?
Well, in some monads, this can be a *lot* more efficient, because `fmap` is really expensive.
Those we'll leave to a different blog post.

### The Already Defined: Sequencing Operations

Now, the last two members are a lot easier:

```haskell
-- | Sequence actions, discarding the value of the first argument.
    (*>) :: f a -> f b -> f b
    a1 *> a2 = (id <$ a1) <*> a2

    -- | Sequence actions, discarding the value of the second argument.
    (<*) :: f a -> f b -> f a
    (<*) = liftA2 const
```

These work similarly to `<$`, in that they're also for *replacing* contexts.
It should be noted that these *sequence* actions before discarding the argument.
Let's look at the `Maybe` monad, for example:

```haskell
(Just 10) <* Nothing
-- = Nothing
Nothing *> (Just 10)
-- = Nothing
(Just 10) *> (Just 12)
-- = 12
(Just 10) <* (Just 12)
-- = 10
```

You can think of these as useful for establishing a dependency.
If I write `(a *> b)` in the `Maybe` monad, for example, it's saying "Use b, but only if a exists."
Similarly, `(getLine <* getLine)` says "Go get two lines from the big scary real world, and then discard the first and return the second, but make sure you actually get both."
If we use `*>` instead, it says "Go get two lines from the real world, and then discard the second and return the first, but make sure you actually get both."

The way this works in the `List` monad is slightly bizarre:

```haskell
[1, 2] *> ["Hack", "Fraud"]
-- = ["Hack","Fraud","Hack","Fraud"]
[1, 2] <* ["Hack", "Fraud"]
-- = [1,1,2,2]
```

However, this is basically how `<$` worked.
We take each value in our list context, and replace it with the values in the other context.
That's fairly simple.

That wraps up Applicative. We're finally at the main event!

## Monads: Or, "How has this blog post been so long without even mentioning the `>>=` operator"

Now, we're finally at monads.
Let's think for a bit here about what we have already.

- `fmap` lets us take apply a function to a value that's wrapped up in some crap we don't want to deal with.
- `<$` lets us replace a value that's wrapped up in some crap we don't want to deal with.
- `<*>` gives us the power to take a function that's wrapped up in some crap we don't want to deal with, and apply it to an argument that's also wrapped up in some crap we don't want to deal with.
- `lift2A` lets us take a binary function and apply it to two values that are wrapped up in some crap we don't want to deal with.
- `*>` lets us take two things wrapped up in some crap we don't want to deal with and establish that they are dependent, discarding the first thing
- `<*` lets us take two things wrapped up in some crap we don't want to deal with and establish that they are dependent, discarding the second thing

So, now we're finally able to arrive at the mighty, mighty `Monad`
Let's look at what this is:

```haskell
class  Monad m  where

    (>>=)       :: m a -> (a -> m b) -> m b
    
    (>>)        :: m a -> m b -> m b
     m >> k      = m >>= \_ -> k

    return      :: a -> m a

    fail        :: String -> m a
    fail s      = error s
```

We've done it.
We've typed `>>=`.
Hopefully, with the motivation first, then building up, I can explain what it does in a way that makes sense.

### `>>=` combines two separate sources of crap you don't wanna deal with

Okay, let's say I have a problem.
I've got two functions:

```haskell
findMagicValue :: Int -> Maybe Int

convertToMagicString :: Int -> Maybe String
```

One, `findMagicValues`, takes an `Int` and returns a `Maybe Int`
The other, `convertToMagicString`, takes an `Int` and returns a `Maybe String`.
I wanna compose them together: Take an `Int`, get the magical translation of that `Int`, and then get the magic `String`. 
But, as is becoming common, the fact that these values might not exist is crap that I don't want to deal with.

Your first thought might be to do something like this:

```haskell
doFull :: Int -> Maybe String
doFull x = fmap convertToMagicString (findMagicValue x)
```

But there's a problem.
There's a rather big problem, actually.
The problem is that `fmap` puts the result *back* in the context that you're trying to ignore.
So, when `convertToMagicString` returns a `Maybe String`, `fmap` will gladly put it back into the original `Maybe` context, netting you a `Maybe (Maybe String)`.
That is definitely *not* what you wanted!
`Maybe (Maybe x)` *never* makes sense.
Something is either there or it's not.
It can't be there on one level and then not there on another!

Thankfully, we have `>>=` to the rescue.
When you have two sources of crap that you don't want to deal with, `>>=` rather smartly combines them together.
So, when we write:

```haskell
doFull x = findMagicValue x >>= convertToMagicString
```

It works like this:

1. First, it evaluates `findMagicValue x`, netting you a `Maybe Int`
2. `>>=` takes the `Int` out of the crap you don't care about (the fact that it might not exist)
3. `>>=` runs the `convertToMagicString` function, which returns a string wrapped in *the same* crap you don't care about (since it also might not exist), and returns that value!

You can use `>>=` when you have *two* sources of *the same* context.
Let's think about lists for a moment.
How about we go back to a familiar function:

```haskell
getGuests :: Party -> [Guest]
```

We used this way up when we were still doing `do` notation: it takes a party, and gets a list of guests at that party.
Let's say we have a list of parties, and want a big list of all the guests.
Well, we have some parties in a context (a list), and a function that takes a party with no context and returns guests in *the same* context (a list).
We have two sources of the same context, so it's time for `>>=`:

```haskell
getAllGuests :: [Party] -> [Guest]
getAllGuests parties = parties >>= getGuests
```

Wow!

Now, what about `IO`?
Well, let's think about this for a minute.
What if we want to get a string from the user and print it?
Well, `getLine` gets us an `IO String`, or a string wrapped up in the context of the scary real world.
`putStrLn` takes a `String`, and returns an `IO ()`, which is nothing, but wrapped up in the context of this horrific time-sensitive nightmare we call reality.
Both functions add a source of the real world&mdash;both functions add *some crap we don't care about*.
This makes writing a function that echoes a line *trivial*.
Behold:

```haskell
echoLine :: IO ()
echoLine = getLine >>= putStrLn
```

### `return` is literally just `pure`
`return` takes a beautiful, pure value, and wraps it up in some context.
AKA literally just `pure`.
In fact, a well-form monad is *required* to define it so it does exactly the same as `pure`.

But wait, you say, why the hell does this even exist when I have `pure` already?
Well, that has a bit of history to it!
`Monad`s, for quite a while, weren't required to also be `Applicative`s.
However, eventually the guys who write the Haskell compiler realized that essentially *every single monad was an applicative*, so they just made it a requirement.
The `pure`/`return` thing is the outcome of when they were separate, and it's too late to change now.
Sorry.

### `>>` is literally just `*>`.

Yeah. 
Same reason as above.

### `fail` was probably a mistake

`fail` is a way for your monad to break.
It exists purely because of `do` notation, which we'll get to later.
A lot of the time calling `fail` will crash your program.
Sometimes, however, there's a sensible failure state.
`fail` in the Maybe monad returns `Nothing`, for example.
`fail` in the `List` monad returns `[]`.
But, generally, it's not a good idea to ever use fail.
So just... don't.

## Back to the Beginning: Or, all that `do` stuff was really just a bunch of `>>=` and such

And now we come full circle.
We're back to `do` notation, what we used earlier.
As it turns out, `do` is just a sneaky way to use `>>=` and `>>` that looks a bit nicer.
Let's take one of our examples and de-sugar it to the proper format:

```haskell
-- Take a list of parties, return a list of allergies
getAllergies :: [Party] -> [Allergy]
getAllergies parties = do
    party <- parties
    guest <- guestsFor party
    allergiesFor guest
```

This becomes:

```haskell
-- Take a list of parties, return a list of allergies
getAllergies :: [Party] -> [Allergy]
getAllergies parties = parties >>= \party -> 
        guestsFor party >>= \guest -> 
            allergiesFor guest
```

That `\party ->` notation is a lambda, in case you haven't seen those in Haskell.
Here's the rough equivalent of this in a language you *might* know, Ruby.
We'll use `.bind` as an equivalent for `>>=`

```ruby
def get_allergies parties
    parties.bind do |party|
        party.guests.bind do |guest|
            guest.allergies
        end
    end
end
```

Right now you may be thinking "Hey, wait a minute... Ruby has something that looks like that!"

```ruby
def get_allergies party
    parties.flat_map do |party|
        party.guests.flat_map do |guest|
            guest.allergies
        end
    end
end
```

Yep. Ruby's got monads. Kinda.

Let's look at a different example, this time in `IO`:

```haskell
main = do
    input <- getLine
    putStrLn input
    putStrLn (toUpper input)
    return ()
```

This desugars to:

```haskell
main = do
    getLine >>= \input -> 
        putStrLn input >> \_ ->
            putStrLn (toUpper input) >> \_ ->
                return ()
```

Essentially, if you don't use `<-` to bind the return value to a name, it uses the `>>` instead.
Remember, `>>` is `*>`, and `*>` establishes a dependency and ignores the first value.
So, if we write:

```haskell
main = do
    putStrLn "Wow"
    getLine
```

We're saying "We need to run `putStrLn "Wow"` first, then run `getLine`, but we only really care about the return value of the second thing."

`do` notation is especially interesting because it gets rid of *all* the crap we didn't want to care about.
Sure, `fmap` and `>>=` help us quite a bit, but we still need to care about writing all those symbols.
With `do` notation that's abstracted away.
We can completely remove all the crap we don't care about.
All the context melts away, and we can actually write the stuff we give a crap about.

## Surprisingly Powerful
It turns out that this idea of "let's ignore the context we don't care about" applies in a lot of places.
We went over a few at the start of this blog post, but there's nearly infinitely more.
If you're writing a parser, for example, you can wrap everything in a `Monad` where that context is *parsing*.
So if you want to parse math, you can do something like:

```haskell
-- given these
parseOperator :: Parser Operator
parseNumber :: Parser Integer

parseEquation :: Parser (Integer, Operator, Integer)
parseEquation = do
    lhs <- parseNumber
    op <- parseOperator
    rhs <- parseNumber
    return (lhs, op, rhs)
```

You know what an equation looks like, so why the hell should you care about the fact that you're really parsing something?
There's no reason to handle where you are in a string or anything like that.
It's all *crap you do not care about*.

Or maybe you're in a banking system, and you want to do certain transactions.
If somebody transfers money, for example, you want to *make sure* that the money leaves their account, then goes into the other account, with no chance of failure in-between.
In a multithreaded environment ensuring that could be hard.
You could easily hit a deadlock if you just lock every account in a transaction every time you update anything.

But, wait a minute.
The fact that we need to do everything at once?
That really sounds like *crap we don't care about*.
So how about we write a nice monad for it:

```haskell
-- Given these:
-- Take money away from an account
subtractBalance :: AccountId -> Integer -> Transactional ()
-- Add money to an account
addBalance :: AccountId -> Integer -> Transactional ()
-- Actually affect the "real world", performing the entire transaction, or none of it
runTransaction :: Transactional a -> IO a

-- We can write:
performTransfer :: AccountId -> AccountId -> Integer -> IO ()
-- the $ is a syntax thing that lets us pass a do block as an argument to a function
performTransfer from to amount = runTransaction $ do
    subtractBalance from amount
    addBalance from amount
```

It may be a bit tricky to properly write a `Transactional` monad that works as advertised (the real hard part is `runTransaction`) but assuming it does, actually using it is trivial.
How exactly transactions are accomplished doesn't matter.
Thankfully, by the way, somebody else has [written a transactional library for us](https://hackage.haskell.org/package/stm) that works properly.

## Finale

So, this has (likely) been a nice extended demonstration of Crockford's law and my own ineptitude at actually understanding monads.
Assuming this post was in any way effective, however, I do hope that it's made them seem a bit less scary, but also a bit less... for lack of a better term, *meme-ey*.
"It's just a monoid in the category of endofunctors" is a great joke, but Monads are actually really cool, because they let you be lazy.
Not as in lazy evaluation&mdash;as in "wearing the same shirt four times in a row to avoid doing laundry."
When you're trying to get work done, being able to *ignore crap you don't care about* is insanely valuable.
Used properly, monads allow one to be very productive, while maintaining a very high level of safety!

