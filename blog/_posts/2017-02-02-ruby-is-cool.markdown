---
title: "Some thoughts on Ruby"
layout: post
categories: ["thoughts", "programming", "writing"]
---

I'm a well-known Ruby fanboy among my circle of friends.
Even people who aren't into programming will occasionally make a comment about it, which I think is an indication that I talk about how great the language is too often.

In truth, it's not surprising that people might know this about me.
I really, really like Ruby.
I don't think it's perfect for all tasks---hell, I think it's downright *terrible* in some contexts---but I do think it is a fantastic language, and it's probably my favorite to write.
This blog post is going to serve as a bit of a high-level introduction to Ruby as a language, as well as a justification for my fanboy-ism.

<!--more-->

## Dynamically-typed for a reason

Ruby is a dynamically-typed language.
This means that you lose any semblance of type safety---if you have a method that expects a string, but you pass it a number, you're going to get an exception at runtime.
This is a huge penalty in terms of ease-of-use in the long-run, and, in many languages, you don't really get anything in return except the fact that you don't have to type typenames everywhere.
With modern type systems that can infer almost everything, even this benefit is basically non-existent, making dynamic typing a *negative quality* for many languages.

In Ruby, however, dynamic typing is merely a *tradeoff* for metaprogramming capability.
Ruby uses metaprogramming in a huge number of contexts, and the result is greatly increased expressiveness.
Let's think, for example, of the `OpenStruct` class.
This class basically lets one access a hash with `foo.bar` syntax instead of `foo[:bar]` syntax, which is useful in a variety of contexts.

How can we define such a class?
Simple:

```ruby
class OpenStruct
  def initialize(hash)
    @hash = hash
  end
  
  def method_missing(meth, *args)
    return super unless args.empty?
    @hash[meth]
  end
end
```

What if we want to be able to set properties, as well?

```ruby
class OpenStruct
  def initialize(hash)
    @hash = hash
  end

  def method_missing(meth, *args)
    if meth.to_s[-1] == "="
      return super unless args.length == 1
      @hash[meth.to_s[0..-2].to_sym] = args.first
    else
      return super unless args.empty?
      @hash[meth]
    end
  end
end
```

This is *easy* to do in Ruby, but quite difficult in other languages.

Some refer to metaprogramming with the term "magic".
I would contend that metaprogramming is only magic if you don't understand what's going on.
I would further argue that most commonly-used metaprogramming in Ruby is fairly easy to understand.

Take, for example, ActiveRecord.
It's an ORM which automatically constructs objects from database tables.
So, if you have a file which says:

```ruby
class User < ActiveRecord::Base
end
```

And a table with columns `name, id, last_login`, you can already do:

```ruby
user = User.find(10) # user with id 10
puts user.name # => Value in name column
puts user.last_login # => Value in last_login column
user.update(last_login: DateTime.now) # => Automatically updates table
```

This can seem a big magical on the surface, but it's actually quite easy to understand.
What's happening, conceptually, is pretty simple:

1. On startup, ActiveRecord obtains the schema from the database
2. It maps tables to classes with a simple scheme ("users" => "User", "blog_posts" => "BlogPost")
3. For each table, it:
    1. Takes each column and defines a method to access it, using the `define_method` method.
    2. Takes each column and defines a method to set it, using the same method

This isn't really magic, it's just an algorithm for handling tables.
The fact that the algorithm is adding and removing methods doesn't really matter--it's still something hta'ts relatively easy to follow.
Of course, ActiveRecord also gives you other nice goodies, like type coerceon.
It also gives some not-so-nice goodies, like the `surpress` method, but I guess we can all just blame DHH for that kind of stuff.


## Blocks!

Ruby also scores major points for how its blocks work.
In Ruby, you can send a block of code along to a method pretty easily:

```ruby
foo.bar do |x| # x is an argument to this block
  puts x
end
```
This construct seems to be simple, but it's actually quite powerful.

## As closures
Blocks can be used as vanilla closures, enabling the use of  higher-order functions.
The [`Enumerable` API](http://ruby-doc.org/core-2.4.0/Enumerable.html), for example, uses closures to perform a variety of transformsations:

```
# obtain an array of the odd numbers / 2, from 1 to 100
(1..100).to_a.keep_if{|x| x % 2 == 1}.map(&:to_f).map{|x| x / 2.0}
```

These transformations are slightly more composable than list comprehensions, because you can also hold blocks in variables, and convert objects to blocks.
I used this on a recent project, [FifthedSim](https://github.com/AnthonySuper/fifthedSim).
One of the classes in FifthedSim is `Distribution`, which is essentially a probabilty distribution.
It maps an input number to a probability.
`Distribution` can be turned into a `proc` object, a type of block in Ruby.

This allowed me to implement the `percent_lower` method, which gives the probability of a number being lower than a given value, as follows:

```ruby
  def precent_lower
    @min.upto(num -1).map(&self).inject(:+)
  end
```

## For DSLs
Blocks have another awesome property, though.
With the special method `instance_eval`, they can be used to implement DSLs.

`intsance_eval` takes a proc, and executes it *inside* the instance of a given class.
This is best demonstrated with an example:

```ruby
class Foo
  def initialize(&block)
    instance_eval(&block)
  end

  attr_accessor :bar, :baz, :hack, :fraud
end

f = Foo.new do
  self.bar = 10
  self.baz = 10
  self.hack = "Mike"
  self.fraud = "Jay"
end

puts f.inspect
```

Simply put, instance_eval changes the definition of "self".
This allows for the creation of expressive DSLs, such as RSpec, an example of which you can find [here](https://github.com/AnthonySuper/FifthedSim/blob/master/spec/distribution_spec.rb).
It almost reads like English.
Just as cool is Sequel, which let you query tables like this:

```ruby
items.where{price * 2 < 50}.sql
#=> "SELECT * FROM items WHERE ((price * 2) < 50)
```

`instance_eval` has friends, like `class_eval`, which executes in the context of a class.
This allows us to do things like:

```ruby
Person = Struct.new(:name, :job, :age)
  def is_fraud?
    job == "fraud"
  end
end
```

## To define methods
As it turns out, you can also use a block of code to define a method.
Let's say you wanted to implement a class which represented a roll of the dice.
You may wish to know whether the value was above average, below average, or exactly averge.
You could define three methods, but that's a lot of boilerplate.
Let's use metaprogramming instead:

```ruby
class DiceExpression
  {"" => :==, "above_" => :>, "below_" => :<}.each do |k, v|
    self.send(:define_method, "#{k}average") do
      value.send(v, selfaverage)
    end
  end
end
```

We create three blocks here, each of which is used to define a method.
Nowe we can use:

```ruby
roll.below_average? # => false
roll.average? # => true
roll.above_average? # => false
```

Easy!

# Package Management
Ruby's package management system is called rubygems.
It's incredibly easy to use, both as a gem publisher or user, and indexes thousands of useful gems.

For an individual application, you can manage dependencies with Bundler.
Bundler smartly resolves dependencies to avoid ridiculously deep trees, and keeps your gem versions in check in a smart way.
The DSL to use bundler is also nice and easy to use.
There's a reason that other package managers, like Cargo, based their layout on Bundler---it's simply awesome.

# Happiness
Ruby is a language designed to maximize programmer happiness.
For this reason, it has a lot of really nice, small features.

### Method Naming
For example, `?` is a valid character to end a method name.
This allows us to write code that reads nicely:

```ruby
array.empty?
string.blank?
```


### No Parenthesis
Ruby also doesn't necessitate the `()` on methods in most contexts, which also helps with readability:

```ruby
if hash.has_key? :job
  hash[:job]
else
  raise ArgumentError, "has no job!"
end
```

### Expressions everywhere
Most things are expressions in ruby.
Thus, we can do this:

```ruby
job = if name == "mike"
        :hack
      elsif name == "jay"
        :fraud
      else
        nil
      end
```

Hell, even defining a class is an expression, so this is totally valid:

```ruby
class Foo
  puts def bar
    "bar"
  end # => prints ':bar'
end
```

### End-of-line Conditionals

Ruby also allows end-of-line conditionals, which allow yet more expressiveness:

```ruby
raise ArgumentError, "Not a number" unless arg.is_a? Fixnum
```

### Perl-ish String Processing
Ruby has some great String Processing.

Regexes are a built-in type in Ruby, and they use an engine similar to that of Perl.
Thus, they're technically not regular expressions, as they allow lookahead and lookbehind.
They also allow stuff like this:

```ruby
"I am 10, 13, or maybe 14".gsub(/\d+/){|m| m.to_i + 1}
# => "I am 11, 14, or maybe 15"
```

Strings also come with `ljust` and `rjust` built-in&mdash;no need to import a left-pad module.

Ruby handles string encodings in a sensible manner.
This was added in version 1.9, and, strangely, people actually upgraded, unlike certain other languages.

