---
title: "Error Messages in Haskell, and how to Improve them"
layout: post
categories: ["haskell", "programming"]
---

I've been writing more and more Haskell lately, as part of a side project involving GraphQL.
As part of working with the language, I've had to work with its compile errors.
The Haskell compiler gives you errors that are extremely informative&mdash;if you know the language.
If you *don't* know the language very well, the compiler errors can occasionally be opaque and unhelpful.

I've very much enjoyed using Haskell, and I figure the best way for me to give back to the community is to make this situation a little better.
In order to do this, we're going to take a fun dive into Haskell errors, why they're confusing, and how they might be improved.

This is very much *not* a literate Haskell file, because none of the snippets within will actually compile!
You can discuss this post [here](https://gitlab.haskell.org/ghc/ghc/issues/18100).

<!--more-->

<style>
.red { color: red; }
.green { color: green; }
.blue { color: blue; }
.purple { color: purple; }
</style>

## Common, Basic Errors
Let's first look at errors that your everyday Haskell user will see all the time.

### Missing Constraints

Let's say I'm trying to give `(+)` an alias, and I forget the constraint.

```haskell
foo :: a -> a -> a
foo a b = a + b 
```

This generates the following error message:

```
Main.hs:3:11: error:
    • No instance for (Num a) arising from a use of ‘+’
      Possible fix:
        add (Num a) to the context of
          the type signature for:
            foo :: forall a. a -> a -> a
    • In the expression: a + b
      In an equation for ‘foo’: foo a b = a + b
  |
3 | foo a b = a + b 
  |           ^^^^^
```

On a pure technical level, this is correct.
The usage of `(+)`, as a function with type signature `(Num a) => a -> a -> a`, causes a constraint to *arise* in the program.
However, the word *arise* is a little confusing here.
I've personally seen my friends think this has something to do with "raising" in the sense of exceptions in a Ruby program.
One simple language change already improves clarity:


```

Main.hs:3:11: error:
    • No instance for (Num a) reqiured by a use of ‘+’
      Possible fix:
        add (Num a) to the context of
          the type signature for:
            foo :: forall a. a -> a -> a
    • In the expression: a + b
      In an equation for ‘foo’: foo a b = a + b
  |
3 | foo a b = a + b 
  |           ^^^^^
```

What's actually going on is more explicit in this case.
We used a function `(+)`.
In order to do this, we *must* have an instance of `Num` for its operands: that is, we are *required* to have such an instance!

On a deeper level, however, there's a more problematic portion of this: the phrasing "No instance for" isn't entirely clear to newcomers.
It's definitely good enough, and it does convey the information that it needs to, but it requires you to think a little before you realize what's going on.
Furthermore, the language of the possible fix is not as helpful as it could be.
If the compiler knows I should add it to the context, why can't it do that for me?
Furthermore, where the hell did that `forall` come from?
As an experienced Haskell dev, I know that all type variables in signatures have an implicit `forall`, but as a newcomer this is confusing.

So, what would a nicer error message look like?
I prefer something like this:

<pre>
<code>
Main.hs:3:11: error:
    • An instance 'Num a' is required by the use of '+', but no instance was found.
      '(+)' has type '(Num a) =&gt; a -&gt; a -&gt; a', but its operands were not required to have the '(Num a)' constraint.
      Possible fix:
        add <span class="red">(Num a)</span> to the constraints of
          the type signature for foo:
            <span class="red">foo :: a -> a -> a</span>
            <span class="green">foo :: <b>(Num a)</b> => a -> a -> a</span>
    • In the expression: a + b
      In an equation for ‘foo’: foo a b = a + b
  |
3 | foo a b = a + b 
  |           ^^^^^
</code>
</pre>

This new message has several advantages:

1. It tells you the type signature for `Num`, making where the constraints came from more obvious
2. It doesn't add the `forall a.` to the type signature for `foo`, making it closer to what you wrote originally
3. It displays the corrected code, instead of merely telling you how to correct it
4. It uses the word "required", which is more intuitive than "arising".

It also, unfortunately, has some downsides:

1. It is more verbose
2. It is probably a lot harder to implement into the compiler 
3. It might display too much information.

### Ambiguous Type Variables 

Let's say I'm a new user and I just learned that you can use `mempty` to write the empty string.
I want to be clever, so I decide I'm going to write a program that prints nothing and exits, using hte cool new Haskell features I learned:

```haskell


main = print mempty

````

I get this error:

```

Main.hs:3:8: error:
    • Ambiguous type variable ‘a0’ arising from a use of ‘print’
      prevents the constraint ‘(Show a0)’ from being solved.
      Probable fix: use a type annotation to specify what ‘a0’ should be.
      These potential instances exist:
        instance Show Ordering -- Defined in ‘GHC.Show’
        instance Show Integer -- Defined in ‘GHC.Show’
        instance Show a => Show (Maybe a) -- Defined in ‘GHC.Show’
        ...plus 22 others
        ...plus 12 instances involving out-of-scope types
        (use -fprint-potential-instances to see them all)
    • In the expression: print mempty
      In an equation for ‘main’: main = print mempty
  |
3 | main = print mempty
  |        ^^^^^^^^^^^^

Main.hs:3:14: error:
    • Ambiguous type variable ‘a0’ arising from a use of ‘mempty’
      prevents the constraint ‘(Monoid a0)’ from being solved.
      Probable fix: use a type annotation to specify what ‘a0’ should be.
      These potential instances exist:
        instance Monoid a => Monoid (IO a) -- Defined in ‘GHC.Base’
        instance Monoid Ordering -- Defined in ‘GHC.Base’
        instance Semigroup a => Monoid (Maybe a) -- Defined in ‘GHC.Base’
        ...plus 7 others
        (use -fprint-potential-instances to see them all)
    • In the first argument of ‘print’, namely ‘mempty’
      In the expression: print mempty
      In an equation for ‘main’: main = print mempty
  |
3 | main = print mempty
  |              ^^^^^^
```

This error is going to confuse the hell out of me, for a few reasons:

1. Where the hell did that 'a0' come from? I didn't write that!
2. Where did these type variables come from? What's the signatures of the functions involved?
3. Why is it suggesting that I give these things all these types?
   I don't understand why this is happening!
4. It says I should add an explicit type signature, but when I write (`mempty :: (Semigroup a) => Monoid (Maybe a)`) like it suggested, it still breaks!

For a start, I think something like this might work:
<pre>
<code>
Main.hs:3:14: error:
    • Ambiguous type variable: I can't tell what type 'mempty' should have.
      'mempty' has type '(<span class="blue">Monoid</span> <span class="purple">a</span>) => a', but
      I cannot tell which instance of <span class="blue">Monoid</span> to use for <span class="purple">a</span>
      Probable fix: use a type annotation to specify what ‘a’ should be.
      These potential instances exist:
        instance Monoid a => Monoid (IO a) -- Defined in ‘GHC.Base’
        instance Monoid Ordering -- Defined in ‘GHC.Base’
        instance Semigroup a => Monoid (Maybe a) -- Defined in ‘GHC.Base’
        ...plus 7 others
        (use -fprint-potential-instances to see them all)
      You can write the following to make life work:
    • In the first argument of ‘print’, namely ‘mempty’
      In the expression: print mempty
      In an equation for ‘main’: main = print mempty
  |
3 | main = print mempty
  |              ^^^^^^
</code>
</pre>

This, unfortunately, doesn't address all the problems.
Fixing #4, in particular, seems really hard.
In this specific case, I would *love* for it to display a list of suggestions like this:

<pre>
<code>
  (mempty :: Ordering)
  (mempty :: Sum Int)
  (mempty :: Product Int)
  (mempty :: [Char])
  (mempty :: [Int])
</code>
</pre>

But the list of potential displays for this gets *quite* long, as we can display `[a]` for all types `a` in scope.
This makes "display a list of specific potentials" pretty much useless, as we often run into situations where the potential space of *concrete* types with the instance is gigantic.
So, I have absolutely no freaking clue how to solve this particular issue.

In this specific case, however, we have a slightly bigger problem: we're displaying two errors as the result of a single root issue.
We don't know what instance of `Show` to use, because we don't know what instance of `Monoid` to use.
I'm pretty sure that this would be an absolute, utter nightmare to implement in the compiler, but it would be awesome if we could get an error message like this:

<pre>
<code>
Main.hs:4:14: error:
    • Ambiguous type variable: I can't tell what type 'mempty' should have.
      'mempty' has type '(<span class="blue">Monoid</span> <span class="purple">a</span>) => a', but
      I cannot tell which instance of <span class="blue">Monoid</span> to use for <span class="purple">a</span>
      These potential instances exist:
        instance Monoid a => Monoid (IO a) -- Defined in ‘GHC.Base’
        instance Monoid Ordering -- Defined in ‘GHC.Base’
        instance Semigroup a => Monoid (Maybe a) -- Defined in ‘GHC.Base’
        ...plus 7 others
        (use -fprint-potential-instances to see them all)
    • In the first argument of ‘print’, namely ‘mempty’
      In the expression: print mempty
      In an equation for ‘main’: main = print mempty
  |
4 | main = print mempty
  |              ^^^^^^
Main.hs:4:8: error:
    • Ambiguous type variable: I can't tell what type 'print' should have.
      'print' has type '(<span class="blue">Show</span> <span class="purple">a</span>) => a -> IO ()', but
      I cannot tell which instance of <span class="blue">Show</span> to use for <span class="purple">a</span>.
      This is because the first argument of 'print', namely 'mempty', has an ambiguous type: '(Monoid a) => a'.
      If you tell me what type 'mempty' has with a type annotation, I can figure out what type to use for 'print'.
  |
4 | main = print mempty
  |        ^^^^^^^^^^^^
</code>
</pre>

### Infinite Types

Let's say I'm a beginner.
I've learned about the `(.)` operator, and I've also done a little bit of explicit recursion list processing.
I realize that, with `(.)`, I can write a cool function with this type: `[a -> a] -> (a -> a)`.
So, I try to do this:

```haskell
foo :: [a -> a] -> (a -> a)
foo [] = id
foo (x:xs) = x (foo xs)
```

As you can see, I totally forgot to use a `(.)` in this definition.
This causes a big problem:

```

Main.hs:3:17: error:
    • Occurs check: cannot construct the infinite type: a ~ a -> a
    • In the first argument of ‘x’, namely ‘(foo xs)’
      In the expression: x (foo xs)
      In an equation for ‘foo’: foo (x : xs) = x (foo xs)
    • Relevant bindings include
        xs :: [a -> a] (bound at Main.hs:3:8)
        x :: a -> a (bound at Main.hs:3:6)
        foo :: [a -> a] -> a -> a (bound at Main.hs:2:1)
  |
3 | foo (x:xs) = x (foo xs)
  |                 ^^^^^^
```

As a new user, I have a few questions:

1. "Occurs check?"
    What the heck does that mean?
    Is my code causing a check to occur, or is this some kind of check of occurence?
    What does this mean?
    <strike>To be honest, I am still a little fuzzy on this, without even being in a newbie mindset.</strike>
2. What the hell is the infinite type?
3. What the hell is that tilde?

This is one scenario where being more verbose gains us quite a bit.

<pre>
<code>

Main.hs:3:17: error:
    • While typechecking the expression 'x (foo xs)', I found that
      the expansion of this type is infinitely large.
      I know:
          x :: a -> a
          (foo xs) :: a -> a
      If 'x (foo xs)' were to typecheck, then the type 'a' must be equivalent to 'a -> a'.
      These types can then be substituted forever:
        a = a -> a
        a = (a -> a) -> (a -> a)
        a = ((a -> a) -> (a -> a)) -> ((a -> a) -> (a -> a))
      and so on.
      This is disallowed in Haskell
    • In the first argument of ‘x’, namely ‘(foo xs)’
      In the expression: x (foo xs)
      In an equation for ‘foo’: foo (x : xs) = x (foo xs)
    • Relevant bindings include
        xs :: [a -> a] (bound at Main.hs:3:8)
        x :: a -> a (bound at Main.hs:3:6)
        foo :: [a -> a] -> a -> a (bound at Main.hs:2:1)
  |
3 | foo (x:xs) = x (foo xs)
  |                 ^^^^^^
</code>
</pre>

This is perhaps a little too verbose of an explanation.
The iterated expansion of the types is not necessarily info I want to see every time I get this error.

<pre>
<code>

Main.hs:3:17: error:
    • While typechecking the expression 'x (foo xs)', I found that
      the expansion of this type is infinitely large.
      I know:
          x :: a -> a
          (foo xs) :: a -> a
      If 'x (foo xs)' were to typecheck, then the type 'a' must be equivalent to 'a -> a'.
      This causes infinite recursion in types, which is disallowed in Haskell.
    • In the first argument of ‘x’, namely ‘(foo xs)’
      In the expression: x (foo xs)
      In an equation for ‘foo’: foo (x : xs) = x (foo xs)
    • Relevant bindings include
        xs :: [a -> a] (bound at Main.hs:3:8)
        x :: a -> a (bound at Main.hs:3:6)
        foo :: [a -> a] -> a -> a (bound at Main.hs:2:1)
  |
3 | foo (x:xs) = x (foo xs)
  |                 ^^^^^^
</code>
</pre>

This is still pretty verbose, but not *nearly* as much, while still providing great information for new users.

## More Advanced Errors

Haskell's confusing errors don't stop once you've been using the language for a while, because as you use Haskell more, you start using more and more advanced features.
These advanced features come with more complicated error messages, which come with more confusion.
Let's look at some now:

### Forgetting an argument in MTL-Style Program

Let's say that, as an intermediate Haskeller, I'm messing around with MTL-style code for the first time.
I decide I want to write a very basic function, but I mess up the type signature:

```haskell
{-# LANGUAGE FlexibleContexts #-}
import Control.Monad.State.Class

swapOut :: MonadState Int m => Int -> Int -> m Int
swapOut a = do
  before <- get
  modify (+ a)
  return before
```

As you can see, I have an extra argument I didn't write down in the signature.
Unfortunately, this means that I get the following error.

```

Main.hs:6:13: error:
    • Could not deduce (MonadState (m Int) ((->) Int))
        arising from a use of ‘get’
      from the context: MonadState Int m
        bound by the type signature for:
                   swapOut :: forall (m :: * -> *).
                              MonadState Int m =>
                              Int -> Int -> m Int
        at Main.hs:4:1-50
    • In a stmt of a 'do' block: before <- get
      In the expression:
        do before <- get
           modify (+ a)
           return before
      In an equation for ‘swapOut’:
          swapOut a
            = do before <- get
                 modify (+ a)
                 return before
  |
6 |   before <- get
  |             ^^^

Main.hs:7:3: error:
    • Could not deduce (MonadState Int ((->) Int))
        arising from a use of ‘modify’
      from the context: MonadState Int m
        bound by the type signature for:
                   swapOut :: forall (m :: * -> *).
                              MonadState Int m =>
                              Int -> Int -> m Int
        at Main.hs:4:1-50
    • In a stmt of a 'do' block: modify (+ a)
      In the expression:
        do before <- get
           modify (+ a)
           return before
      In an equation for ‘swapOut’:
          swapOut a
            = do before <- get
                 modify (+ a)
                 return before
  |
7 |   modify (+ a)
  |   ^^^^^^^^^^^^

```

This, of course, happens because `(->) a` is a Monad.
I actually *very much like* the existence of said Monad, perhaps controversially.
It makes writing some code, especially code that converts between two similar types (an internal representation and the public type of a webserver, for example) very easy.
However, it makes error messages caused by forgetting an argument very annoying.
My proposed fix is simple: just bite the bullet and special-case it.

<pre>
<code>
Main.hs:7:3: error:
    • Could not deduce (MonadState Int ((->) Int))
        arising from a use of ‘modify’
      Hint: Did you forget an argument in the definition of 'swapOut'?
      Adding one fixes the issue:
        <span class="red">swapOut a = do</span>
        <span class="green">swapOut a _ = do</span>
      from the context: MonadState Int m
        bound by the type signature for:
                   swapOut :: forall (m :: * -> *).
                              MonadState Int m =>
                              Int -> Int -> m Int
        at Main.hs:4:1-50
    • In a stmt of a 'do' block: modify (+ a)
      In the expression:
        do before <- get
           modify (+ a)
           return before
      In an equation for ‘swapOut’:
          swapOut a
            = do before <- get
                 modify (+ a)
                 return before
  |
7 |   modify (+ a)
  |   ^^^^^^^^^^^^
</code>
</pre>

In general, of course, we'd like to avoid special-casing types in our compiler for maintainability reasons, but this one problem is ubiquitous enough that I think it's worth the extra expense.

### Skolem type variables

As somebody getting into advanced Haskell, let's see I just learned about `ST`.
I think that "totally safe mutability in a pure context" sounds badass (because it is), so I try to make a very, very basic example with it to get my feet wet.

```haskell
import Control.Monad.ST
import Data.STRef

testSt = runST $ do
  myStr <- newSTRef "Foo"
  myStr' <- readSTRef myStr
  pure myStr
```

As you can see, I screwed up and forgot a `'` at the end of `myStr`.
When I run this, I thus get the following error:

```
Main.hs:7:3: error:
    • Couldn't match type ‘a’ with ‘STRef s [Char]’
        because type variable ‘s’ would escape its scope
      This (rigid, skolem) type variable is bound by
        a type expected by the context:
          forall s. ST s a
        at Main.hs:(4,18)-(7,12)
      Expected type: ST s a
        Actual type: ST s (STRef s [Char])
    • In a stmt of a 'do' block: pure myStr
      In the second argument of ‘($)’, namely
        ‘do myStr <- newSTRef "Foo"
            myStr' <- readSTRef myStr
            pure myStr’
      In the expression:
        runST
          $ do myStr <- newSTRef "Foo"
               myStr' <- readSTRef myStr
               pure myStr
    • Relevant bindings include
        myStr :: STRef s [Char] (bound at Main.hs:5:3)
        testSt :: a (bound at Main.hs:4:1)
  |
7 |   pure myStr
  |   ^^^^^^^^^^
```

As a new user, these questions flow through my mind:

1. What the absolute hell is a `(rigid, skolem)` type variable?
   When I Google it, I get a wikipedia page for something called "Skolem Normal Form", which has the following blurb underneath it:
  
   <blockquote>In mathematical logic, a formula of first-order logic is in Skolem normal form if it is in prenex normal form with only universal first-order quantifiers.</blockquote>

   Seeing this quote, I become frozen with terror, and maybe reconsider if I should just write my project in Javascript
2. How can a variable escape its scope?
   This isn't C++, I thought I could return Haskell variable without weird segfaults?
3. Wait, it's a *type* variable.
   Those are scoped? What the hell is going on?

Trying to make a new-people-friendly error message for this particular error is actually *really* hard.
So hard, in fact, that I am not even going to provide a suggested fix for this.

The scoping-type-variable trick is awesome in ST, but it's great in other contexts as well.
The database library [Beam](https://tathougies.github.io/beam/) uses it to ensure that subquery contexts cannot escape their scope, for example, which makes writing correct SQL queries much easier.
Unfortunately, it also makes the error messages just as bad as error messages with incorrect usages of `ST`.
Thus, I do hope somebody can come up with a different error message, to make things easier to use.

