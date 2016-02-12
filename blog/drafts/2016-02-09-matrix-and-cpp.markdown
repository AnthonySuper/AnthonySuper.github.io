---
title: "Matrixes and C++"
layout: post
categories: ["math", "programming", "c++"]
---


This semester, I enrolled in a linear algebra class in college.
I was having some trouble learning it, so I figured I might as well expand my knowledge by writing a program.
I picked C++ to be the language for this.
Of course, my version isn't going to be nearly as fast as the hyper-optimized libraries the pros write, but that's fine.
This is just a learning project, after all.

<!-- more -->

First off, a little definition of a matrix. 
A matrix is basically just a 2-dimensional array of values.
This is simplifying a bit, of course, but that's essentially my understanding of it.

<pre>
    |1 2 3|
A = |4 5 6|
    |7 8 9|
</pre>

You can then find elements of this array based on their row and column location.

This gives us our basic building blocks.
We have a number of rows, a number of columns, and some memory to store our elements in.
The naive way to do this is to create a 2D array, something like this:

```cpp
double data[][] = new double[rows];
for(int i = 0; i < rows; i++){
  data[i] = new double[columns];
}
```

This, however, introduces a pretty big memory fragmentation problem.
We're going to be iterating over every element of this data pretty often, so this solution is pretty horrible.
Instead, we'll allocate one contagious block of memory.
We'll also make the decision that you can't resize matrices once created–they have a constant size.

Our code is now:

```cpp
namespace NM{
  class Matrix{

  };
}
```
