---
title: "Dice, Runtimes, Probability, and Complex Analysis"
layout: post
categories: ["math", "programming", "ruby"]
---

Over the last few years, I've become progressively more interested in tabletop games.
As a result, I've been playing more of them&mdash;and thus rolling more dice.
Now, as with any game of chance, occasionally luck isn't in my favor and and I'll consistently do much lower damage than I feel like I should.
When you do 5 damage on an attack that averages 16, it feels pretty awful.
I, however, wanted to know more.
I wanted to know exaclty *how* unlucky I was getting.
Being a programmer, my solution, naturally, was to write some code to do so.

<!--more-->

Now, figuring out how unlucky it is to roll a `1` on a six-sided die (a d6) is pretty easy: you have a $$ \frac{1}{6} $$ chance of getting any possibility, `1` is a possibility, so you have a 1/6th chance of getting it.
Where it becomes more fun is when you start adding dice.
The spell [Fireball](https://roll20.net/compendium/dnd5e/Fireball#content), for example, does `8d6` damage, which means you roll 8 6-sided die and add them up.
Doing the math for this is a bit more involved.
I thought it might be best to write fully generic code to do so.


## Adding distributions
A throw of a dice follows what's called a *probability distribution*.
Essentially, there's a number of outcomes, each with a given chance of happening.
If we want to add two dice together, we can really think of this as adding two distributions.
So, let's say we have those distributions, $$ d_1 $$ and $$ d_2 $$.
What's the chance of getting a given number?
Well, the formula looks something like this:

$$
\text{New Chance}(x) = \sum_{i = 0_{}}^{x} d_1(i) \times d_2(x - i)
$$

Essentially, the chance of getting an output $$ x $$ is the sum of the chances of the ways to make $$ x $$.
So, how many ways can we roll a 3 on 2d2?
Well, we can either roll a 1 and then a two, or a two and then a one.
So our total probability is the chance to roll a one and then a two, plus the chance to roll a two and then a one.
Conveniently, the probability "Roll X and then roll Y" is easily expressed as the *product* of rolling X and Y individually, as they're independent events!
For the case of 2d4, we basically have:

$$
\begin{aligned}
  d'(2) &= d_1(1) \times d_2(1) &= 0.25\\
  d'(3) &= d_1(1) \times d_2(2) + d_1(2) \times d_2(1) = 0.25 + 0.25 &= 0.5\\
  d'(4) &= d_1(2) \times d_2(2) &= 0.25\\
\end{aligned}
$$

That's really simple.
Adding two distributions together in this way is known as a `convolution`.
Now, let's say I have a distribution class which has a member variable `@map`, which is a hash of $$ \text{outcome} \rightarrow \text{probability} $$.
Let's also say I have `.min` and `.max` methods that return the minimum possible value and the maximum possible value, respectively.
The naive way to implement this is something pretty simple:

```
  def add(other_dist)
    overall_min = min + other_dist.min
    overall_max = max + other_dist.max
    results = overall_min.upto(overall_max).map do |x|
      # in this map we return a tuple of [value, chance]
      [x, 0.upto(x).map do |i|
        @map[i] * other_dist.map[x - i]
      end.inject(:+)] # Sum the array
    end
    # the Hash#[] method turns our tuples into key-value pairs
    return Distribution.new(Hash[results])
```

All seemed well.
If I want to do `4d4`, I can just do `d4 + d4 + d4 + d4`.
It seemed to work well.
Then, one day, I decided to try to find the distribution of `36d6`, which took a surprisingly large amount of time on my machine.
`100d10` was even more hopeless&mdash;I got impatient before it finished.
What the hell was going on?


## A Critial Failure

Well, after struggling to optimize the above code, I was getting nowhere.
So I decided that I should probably start trying to think about the big-O complexity of the actual algorithm.
I started off by analyzing a single, specific case `4d10 = d10 + d10 + d10 + d10`.
Adding two dice together is pretty easy to analyze: it has two nested for loops, so it's somewhere in the realm of $$ \mathcal{O}(d_1d_2) $$, where $ d $ is my dice size.
The first addition, `d10 + d10`, does 100 units of work, and then returns a distribution of size `19`.
So, the next addition, `2d10 + d10`, does 190 units of work, as it loops through each result in the `2d10` distribution for each result in the `d10` distribution.
The resulting distribution has size 28.
The final addition, `3d10 + d10`, does 280 units of work, and results in a distribution of size 37.
It's clear the size of the resulting distribution goes up by `9` each time, and we do $$ 10 \times d_{i - 1_{}} $$ units of work, if $$ d_{x_{}} $$ is the size of the distribution obtained on iteration $$ x $$.

So, what's our total running time?
Well, in this case, it's `100 + 190 + 280`.
Considering the generic case, where we have $$ n $$ dice of size $$ d $$, our running time is something like this:

$$
\sum_{k = 1_{}}^{n - 1} d * (d + (d - 1) * (k - 1))
$$

Plugging this into Wolfram alpha (because I'm awful at summation analysis) nets us a formula that is $$ \mathcal{O}(d^2n^2) $$.
For something like 100d10, that's pretty expensive!


## Attempting to Divide and Conquer 

Let's try something a bit better.
Let's attempt a *divide and conquer* solution.
This basically means "let's try splitting it into smaller sub-problems to hopefully gain a speedup."
It's pretty easy to see that `100d10` is equal to `50d10 + 50d10`.
So we can safely divide a given problem into sub-problems.

To analyze divide and conquer solutions we use a recurrence.
In this case, I think we have:

$$
T(n, d) = \begin{cases}
  T(\frac{n}{2}, d) + \left(d + (d - 1) \times (\frac{n}{2} - 1)\right)^2 & \text{if } n > 1\\
  d & \text{otherwise}
\end{cases}
$$

Wolfram alpha doesn't like this as much, but if we substitute $$ d = 10 $$, it will tell us:

$$
T(n) = \frac{10}{3}(10n^2 - 7)
$$

So that's $$ \mathcal{O}(n^2d^2) $$.
Theoretically, this shouldn't net us anything at all, but I decided to try and implement it anyway:

```ruby
def add_divide(n, d)
   return distribution_single(d) if n == 1
   smaller = n/2.0
   return add_divide(smaller.floor, d).add(smaller.ceil, d)
end
```

Pretty simple, even if it shouldn't be faster.
Just for kicks, I decided to try both, and plot them on a graph:

<img src="/blog/assets/dice_benchmark.svg" alt="Dice benchmark graph" class="big-image">

Wait, what?
To me, it looks like our divide-and-conquer. 
Let's try out just the divide-and-conquer solution to some very large combination of n and d to see if this pattern continues:

<img src="/blog/assets/dice_benchmark_alt.svg" tlt="Dice Benchmark Alternative Graph" class="big-image">

That's *much* better!
It turns out that the constant factor in the naive case really makes a difference with small inputs.

Still, in a way, that's actually *much worse*.
Sure, I don't look like an idiot for getting the wrong recurrence, but now I'm still stuck with $$ \mathcal{O}(n^2d^2) $$, which isn't what I want at all.
If only there was a faster way...

## Some hope?

I let this sit for quite a while, completely unsure of what to do.
I suspected there was some faster way, but I couldn't figure out what it could be!
Googling wasn't much help (most people were interested in doing real statistical work with complicated distributions, not adding dice), and for the life of me I couldn't figure out how to make it faster.


The answer actually came to me when we were going over a seemingly unrelated topic in a class I'm taking: fast algorithms to multiply polynomials.
A polynomial is something like $$ f(x) = 1 + 2x + 10x^2 $$.
You probably remember them from high school algebra.
Multiplying them together, as it turns out, is a pretty interesting problem.
Let's try to multiply two simple polynomials, $$ 1 + x $$ and $$ 3 + 2x $$.
We write this as $$ (1 + x)(3 + 2x) = 1 \times 3 + 1 \times 2x + x \times 3 + x \times 2x = 3 + 5x + 2x^2 $$.
Essentially, we multiply each term in one polynomial by every term in the other, then group them back together.

Let's re-write those polynomials as $$ \langle 1, 1 \rangle $$ and $$ \langle 3, 2 \rangle $$.
Since we know that the exponent on $$ x $$ keeps increasing, we can do this transformation without losing any information---all we really care about is the things that multiply x, or the *coefficients*.
In this way, we can write polynomials as coefficients of vectors quite easily.

Now, how do we multiply two polynomials together?
Let's think of it in terms of the *coefficients* once again.
To get coefficient with $$ i $$ in the output vector, we do this calculation:

$$
(f \times g)_i = \sum_{k = 0_{}}^{i} f_{k} \times g_{i - k}
$$

Now, to get all coefficients, we perform this calculation for every coefficient in the output vector.
You might, at this point, notice something: this is suspiciously similar to our formula to add probability distributions from earlier:

$$
\text{New Chance}(x) = \sum_{i = 0_{}}^{x} d_1(i) \times d_2(x - i)
$$

Even better, multiplying polynomials is called *convolving* them, just like adding distributions!
After thinking about it for a while, it turns out that these two operations are *exactly* the same.
All we have to do is to consider probability distributions as "polynomials" where the chance is the coefficient and the resulting value is the exponent on $$ x $$.
If we do this, we can easily turn a probability addition into a polynomial multiplication!

Of course, that doesn't help us much, because the polynomial multiplication formula I gave is also $$ O(n^2) $$, so it doesn't make things faster.
As it turns out, however, it doesn't have to be that slow.
We can use something called the **Fast Fourier Transform** to multiply polynomials in $$ \mathcal{O}(n\log(n)) $$ time, which is substantially faster.

The way the FFT works is fairly tricky, so I'll just summarize instead of going into detail.
It turns out that if you have enough *solutions* to a polynomial&mdash;that is, an $$ x $$ value and the corresponding $$ f(x) $$&mdash;you can actually get the polynomial back.
It also turns out that multiplying two polynomials in *solution* form is only $$ \mathcal{O}(n) $$ instead of $$ n^2 $$.
All you have to do is multiply the solutions by each other point-wise.
Normally, unfortunately, this is no help, because going from coefficient form to solution form takes $$ \mathcal{O}(n^2) $$ time.
However, we can cheat.
By smartly picking the right input $$ x $$ values, we can go from coefficient form to solution form in $$ \mathcal{O}(n \log n) $$ time.
The way we do this is to exploit properties of special numbers called the "complex roots of unity."
Of course, as the name implies, these are *complex* numbers, not real ones, but it turns out that doing polynomials with complex numbers is a completely valid operation (you can do polynomials with a lot of surprising things, actually, but that's a blog post for another day).

Getting back from solution form to coefficient form is also normally expensive, but due to some more complex number hackery, it turns out that you can do the FFT again after making a slight modification to the coefficients to get right back to where you started from.
So, overall, the total is now $$ \mathcal{O}(n\log n) $$ time to multiply two polynomials.
Since we can get from a probability distribution to a polynomial in $$ \mathcal{O}(n) $$ time, we can now add probability distributions very quickly!

What's even better about this is that we're adding a probability distribution *to itself*.
The way you add distributions together in the solution domain is to point-wise multiply them.
Repeated multiplication is an operation in mathematics: it's just exponentiation.
So, if I want to compute 100d4, I can transform it into solution form using the FFT, then *take the 100th power* of each term!
For the sake of brevity, we'll consider exponentiation to be $$ \mathcal{O}(\log n) $$ (which can be achieved by repeated squaring, which I am near-certain Ruby does).
We now just need to consider how many terms are in our polynomial.
Well, in order to go from the solution domain to the coefficient domain, we need as many solutions as the largest exponent of $ x $.
That will be, in this case, $ n * d $.
So we now have three steps.

1.  Go from the coefficient domain to the solution domain using the FFT in $$ \mathcal{O}(nd \log(nd)) $$ time.
2. Pointwise-exponentiate in $$ \mathcal{O}(nd \log n) $$ time.
3. Go back to the coefficient domain in $$ \mathcal{O}(nd \log(nd)) $$ time.

Our overall time is now just $$ \mathcal{O}(nd \log(nd)) $$ time!

### Implementation

First off, let's create a new class called `Coefficient`.
This class will hold distributions in their coefficient form.
Here's the full class, with comments:

```ruby
    class Coefficient
      ##
      # @param map a hash of result => chance
      # @param min the minimum value in the map (to save on calculation time)
      # @param max the maximum value in the map (also to save on calculation time)
      def initialize(map, min = nil, max = nil)
        # We want to properly find the max and min values
        # This is because out-of-range values after adding will be a bit "weird"
        # in the sense that they'll be *extremely close* to zero but not quite.
        # So we can use this information to later make them actually zero.
        @min = min || map.keys.min
        @max = max || map.keys.max
        # Round array up to nearest power of two
        # This is required for a proper FFT, typically.
        length = nearest_two_power(@max)
        # Actually convert to coefficient form
        @coeffs = 0.upto(length).map{|x| map[x] || 0.0}
      end

      # Let others read our attributes
      attr_reader :min, :max, :coeffs

      def add(other)
        # We add zero coefficients so the FFT can find more solutions.
        # Since the output polynomial is larger than the input 
        # polynomial (since it has more terms),
        # We need to padd this now.
        # Get the size to pad to here: 
        new_size = nearest_two_power(coeffs.size + other.coeffs.size)
        # Now pad our coefficients
        arr = extend_array(new_size)
        # And padd theirs
        oarr = other.extend_array(new_size)
        # Do the FFT
        fft = fft_recurse(arr)
        # And again
        offt = fft_recurse(oarr)
        # Pointwise-multiply
        mult = fft.zip(offt).map{|(a, b)| a * b}
        # Inverse FFT returns complex numbers again.
        # However, we only care about real probability,
        # so we just throw away the complex component.
        # Simple!
        res = inverse_fft(mult).map!(&:real)
        # now, just return a distribution:
        hsh = Hash[(min + other.min).upto(max + other.max).map do |x|
          [x, res[x]]
        end]
        Distribution.new(hsh)
      end

      # As it turns out, if we want to add something to itself a 
      # certain number of times, we can do that even more quickly!
      def exp(pow)
        # We need enough solutions to fit the result of the power
        # Since our possible values will go up to @max * pow,
        # we go up to that, plus some overhead to handle pow=1 edge
        # cases
        new_size = nearest_two_power(@max * (pow + 1))
        new_min = min*pow
        new_max = max*pow
        arr = extend_array(new_size)
        fft = fft_recurse(arr)
        # Literally just exponentiate! 
        fft.map!{|x| x**pow}
        # Conver back as before
        res = inverse_fft(fft).map!(&:real)
        hsh = Hash[new_min.upto(new_max).map do |x|
          [x, res[x]]
        end]
        Distribution.new(hsh)
      end

      # Padd the array to a given size by adding 0 coefficients
      def extend_array(size)
        return @coeffs + Array.new(size - @coeffs.size, 0.0)
      end

      private

      # FFT works best on powers of two.
      # In fact, ours only works on powers of two.
      # So we find the nearest power of two fairly often
      def nearest_two_power(num)
        return 1 if num == 0
        exp = Math.log(num, 2).ceil
        if exp == 0
          1
        else
          2**exp
        end
      end

      # The actual FFT. Borrowed from Rosetta Code.
      def fft_recurse(vec)
        # Base case: the FFT of a coefficient vector of size one is just the vector
        return vec if vec.size <= 1
        # The FFT works by splitting the coefficient vectors into odd and even indexes
        # We do that here
        evens_odds = vec.partition.with_index{|_,i| i.even?}
        # Now we smartly perform the FFT on both sides
        evens, odds = evens_odds.map{|even_odd| fft_recurse(even_odd)*2}
        # And zip them together while applying the solution
        evens.zip(odds).map.with_index do |(even, odd),i|
          even + odd * Math::E ** Complex(0, -2 * Math::PI * i / vec.size)
        end
      end

      # Due to more math trickery, we actually just another FFT
      # In order to invert the FFT
      def inverse_fft(vec)
        # The conjugate of a complex number works like this:
        #   a + bi => b + ai
        # This is the modification we perform to invert
        # the FFT
        nv = vec.map(&:conjugate)
        # Do the actual FFT
        applied = fft_recurse(nv)
        # Now we re-conjugate
        # The inverse FFT actually multiplies each coefficient by the number
        # of coefficients, so we divide that out here to be accurate.
        applied.map!(&:conjugate)
          .map!{|x| x / applied.size}
      end
    end
```

Modifying our `Distribution` class to make use of this is fairly trivial, so I've omitted it for the sake of brevity.
Modifying our `MultiNode` class (which rolls $$ n $$ dice of size $$ d $$) to do the same was equally so.

Now, all we have to do is benchmark.
Let's see how it runs, shall we?

<img src="/blog/assets/fft_dr.svg" title="Dice Benchmark FFT Graph" class="big-image">


The weird stepping-stone nature of the graph is because the simple implementation of the FFT we use only works on powers of two.
There's other versions of it that can work more smoothly, but implementing them can wait for another day.

Now, this graph already looks pretty good.
Let's compare it to other other versions:

<img src="/blog/assets/fft_compare.svg" title="Dice Benchmark FFT Comparison" class="big-image">

And, to get a closer look, just with the divide-and-conquer version:

<img src="/blog/assets/fft_divide_compare.svg" title="Dice Benchmark FFT Comparison" class="big-image">

That's a substantial improvement!

## Wrapup

Algorithmic analysis is important.
Now, this isn't exactly radical new insight, but I do think it's something we all need to keep in mind.
My first thought when I noticed how long it took to do statistics on `100d10` was to blame myself for making careless mistakes in my implementation.
As it turns out, however, even hand-optimized assembly written by Carmack himself would *never* have got my code to run fast enough.
It was my algorithm that was wrong, not my implementation.

When writing code, it's important to not optimize prematurely.
However, I do think that it's important to at least *think* about the time your code will take to run.
You don't need to resort to weird memoization or object-pooling madness immediately, but if you're writing an algorithm with a running time of  $$ \mathcal{O}(n^2) $$ when a $$ \mathcal{O}(n \log n) $$ exists, you (and your users) are going to pay the price.

This experiment was also interesting because it brought a practical, real-world application to something I learned in class.
I didn't think I'd ever have a need to multiply polynomials&mdash;and in one sense I'm right, because I didn't *want* to multiply polynomials.
I wanted to add dice together to see just how bad my rolls are when I casted *Fireball*.
The fact that those two things are the same was pretty interesting to me.

If you're interested in checking out this code (which can actually multiply and subtract dice as well as adding them), check out [FifthedSim](https://github.com/AnthonySuper/FifthedSim), which I'm still developing when I have the time.
If you can find a way to make dice multiplication (or anything else) faster I'd love to hear it!