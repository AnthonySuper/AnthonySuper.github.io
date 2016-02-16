---
title: "Matrixes and C++"
layout: post
categories: ["math", "programming", "c++"]
---


This semester, I enrolled in a linear algebra class in college.
I was having some trouble learning it, so I figured I might as well expand my knowledge by writing a program.
I picked C++ to be the language for this, mostly for speed, but partially because I haven't written C++ in a while and wanted to try my hand.
Of course, my version isn't going to be nearly as fast as the hyper-optimized libraries the pros write, but that's fine.
This is just a learning project, after all.

<!-- more -->


# Starting Off

First off, a little definition of a matrix. 
A matrix is basically just a 2-dimensional array of values.
This is simplifying a bit, of course, but that's essentially my understanding of it.


```
    |1 2 3|
A = |4 5 6|
    |7 8 9|
```

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

Since we're using RAII, we'll declare this one array as a `std::unique_ptr<double[]>`.
This means that our compiler will automatically free it when our matrix is deleted, using `delete[]`. 

Our code is now:

```cpp
namespace NM {
    class Matrix;

    class Matrix {
    public:

        Matrix(int rows, int columns);
        const int rows;
        const int columns;
        std::unique_ptr<double[]> data;
    };


    Matrix::Matrix(int rows, int columns) : rows(rows), columns(columns),
    data{new double[rows * columns]}
    {
        
    }
}
```

So, let's quickly add some methods to get and set the elements of a matrix. 
We want matricies to be mostly immutable, so let's make the setElement method protected.
Let's also define these inline for speed.

```cpp
    inline double getElement(int row, int column){
                return data[row * rows + column];
            }

 protected:
        inline void setElement(int row, int columns, double value){
            data[row * rows + columns] = value;
        }
```

## A better constructor

Currently, we have no way to construct a matrix with specific values.
In fact, the only matrix you can construct is the zero matrix, which is kind of useless.
We want to give the user some way to construct a matrix with arbitrary values, without letting them mutate the actual matrix contents.

`std::initializer_list<T>` provides such a way. 
Essentially, this lets your constructor take a list of elements of type T, enclosed in brackets.
This list can be a list itself.
So, for a matrix, we want to take a list of lists of doubles: 

```cpp
std::initializer_list<std::initializer_list<double>>
```

Now, we do have one issue. 
The inner lists all need to be the same length for our matrix to be properly constructed. 
Lists such as `{ {1, 2}, {1}}` are not valid.
We can't check this at compile-time, as far as I can tell, so we'll just throw an `std::length_error` if we encounter that case.
Not sure if that's the strictly correct exception to throw, but it works for now.

```cpp

    Matrix::Matrix(std::initializer_list<std::initializer_list<double>> list) :
    Matrix::Matrix((int) list.size(), list.size() ? (int) list.begin()->size() : 0 )
    {
        int r_count = 0;
        for(auto elem: list){
            auto c_count = 0;
            for(auto e: elem){
                setElement(r_count, c_count, e);
                c_count++;
                if(c_count > columns){
                    throw std::length_error("Invalid initializer list (column too long)");
                }
            }
            if(c_count + 1 < columns){
                throw std::length_error("Invalid initializer list (column too short)");
            }
            r_count++;
        }
    }

```

## A cast for printing


Let's also add a cast to std::string, so we can print our matrices.

```cpp
// We defined this as an explicit operator in our header file, so
// our Matrix will not be cast to std::string when we don't want 
// it to be
Matrix::operator std::string(){
        std::stringstream s;
        for(int i = 0; i < rows; i++){
            for(int k = 0; k < columns; k++){
                s << getElement(i, k) << '\t';
            }
            s << std::endl;
        }
        return s.str();
    }
```

# Math!

Now, let's define some mathematical operators.
Adding two matrices together is as simple as adding their components:

``` 
| 1 1 1 |   | 1 1 1 |   | 2 2 2 |
| 1 1 1 | + | 1 1 1 | = | 2 2 2 |
| 1 1 1 |   | 1 1 1 |   | 2 2 2 |
```

This is pretty easy to implement in the code. 
We just go through every element of one matrix, add every element of the other, and store it in a new matrix.
This operation only makes sense if the matrices are the same size, so let's define an exception to throw if they aren't:

```cpp
class BadAddition : std::runtime_error {
        public:
            explicit BadAddition(const std::string &msg) : std::runtime_error(msg)
            {}
};
```

Now we just implement the algorithm:

```cpp
    Matrix Matrix::operator+(Matrix &o){
        if(rows != o.rows || columns != o.columns){
            throw BadAddition("Rows or columns were not equal");
        }
        NM::Matrix m(rows, columns);
        for(int i = 0; i < rows; i++){
            for(int k = 0; k < rows; k++){
                m.setElement(i, k, getElement(i, k) + o.getElement(i, k));
            }
        }
        return m;
    }
```

Multiplying a matrix by another matrix is a bit trickier. 
First off, ` a * b ` is only a valid operation if `a.rows == b.columns`.
Let's quickly define an exception to throw if this is not the case:

```cpp
    class BadMultiplication : std::runtime_error {
        public:
            explicit BadMultiplication(const std::string& msg) : std::runtime_error(msg)
            {}
         };
```

Okay, now for the algorithm. 

We define the multiplication of matrices `A`, an `n x m` matrix, and `B`, a `m x p` matrix, to be a matrix of dimensions `n x p`.
To find the entry at `i, j`, we multiply across row `i` of `A` down column `j` of `B` and sum the results.
A concrete example will probably help here.

Say we have:

```
    | 1 2 3 |      | 1 2 |
A = | 1 2 3 |, B = | 1 2 |
    | 2 2 3 |      | 1 2 |
```


Now, let's find the element at (1, 1) of `AB`. To do this, we go across row 1 of `A`, multiply each element by its corresponding element down column 1 of `B`, and take the sum. In this case:

```
AB(1, 1) = A(1,1) * B(1, 1) + A(1, 2) * B(2, 1) + A(1, 3)  + B(3, 1)
```

Substituting variables, we have:

```
AB(1, 1) = 1 * 1 + 2 * 1 + 3 * 1
```

Which is

```
AB(1, 1) = 6
```

We can use a [handy online calculator](http://matrix.reshish.com/multCalculation.php) to check out work.
When we do, we see that we are correct.

So, how do we convert this to code?
Well, first off, we need to make sure that matrix `A` has as many rows as `B` has columns. 
If not, we throw the `BadMultiplicationError` we defined earlier.
Next, we create a new Matrix, of size `A.rows x B.columns`.
We then iterate through each element in our product.
For each element, find the sum of the elements down the row of `A` and the column of `B`, then store it in the element.
Our overall code looks like this:

```cpp
    Matrix Matrix::operator*(NM::Matrix &other){
        if(columns != other.rows){
            throw BadMultiplication("Rows is not equal to columns");
        }
        Matrix m(rows, other.columns);
        for(int i = 0; i < m.rows; i++){
            for(int j = 0; j < m.columns; j++){
                double sum = 0;
                for(int k = 0; k < other.rows; k++){
                    sum += getElement(i, k)  * other.getElement(k, j);
                }
                m.setElement(i, j, sum);
            }
        }
        return m;
    }
```

Interestingly enough, this is trivial to do in parallel.
We could simply do each summation on a different thread and join them all at the end.
This is true of addition as well, or, indeed, any element-wise operation on a matrix.
From my understanding, you can use GPUs to do just that, allowing you to perform operations on very large matrices extremely quickly.

# More Constructors

Let's take a step back from math and think about our interface for a bit.
Currently, there's no way to copy matrices around, as it lacks a copy constructor.
We could do this the simple way, by going through each element of our matrix and copying it over, but we don't need to do that—we can simply copy the memory with one call to `memcpy`.
So, our copy constructor is:

```cpp
Matrix::Matrix(const Matrix &other) : Matrix(other.rows, other.columns){
        memcpy((void*)data.get(), (void*)other.data.get(), rows * columns * sizeof(double));
    }
```

We can also define a *move constructor* fairly easily.
Since we defined our array as a `unique_ptr`, we can simply move its value to our new matrix, assuming we know that our old matrix will immediately fall out of scope.

```cpp
Matrix::Matrix(Matrix&& other) :
    rows(other.rows), columns(other.columns), data(std::move(other.data))
    {
        
    }
```

# Equality Comparisons

It's also useful to compare two matrices to see if they are equal.
To do that, we first check if they are the same size.
If they aren't, we know they can't be equal.
From there, we just need to compare their components to make sure they are equal.
This is pretty easy to implement:

```cpp
    bool Matrix::operator==(Matrix &o){
        if(rows != o.rows || columns != o.columns){
            return false;
        }
        for(int i = 0; i < rows; ++i){
            for(int k = 0; k < columns; ++k){
                if(getElement(i, k) != o.getElement(i,k)){
                    return false;
                }
            }
        }
        return true;
    }
```

We can then define the `!=` operator by negating the results of the first:

```cpp
    bool Matrix::operator!=(Matrix &m){
        return ! (*(this) == m);
    }
```

# Determinants

Square matrices (matrices which have an equal number of rows and columns) have a special quality called the `determinant`. 
This value can tell you a lot of things, including if your matrix is invertible—a term which we will discuss later.

The determinant of a `2 x 2` matrix is easy to find.
It is simply `(1, 1) * (2, 2) - (1, 2) * (2, 1)`.
You can use this definition to find the determinant of any square matrix.
Let's see an example:

```
     | a b c |          | e f |          | d f |          | d e |
det (| d e f |) = a det(|     |) - b det(|     |) + c det(|     |)
     | g h i |          | h i |          | g i |          | g h |
```

Essentially, take each element in a row. Multiply it times the determinant of the matrix you get when you remove that element's row and column from the matrix. Sum those values, multiplying every other value by `-1`.

## Time Problems
This sounds extremely simple to implement.
After all, it's just recursion, right?
Well, yes, but it has a big problem.
See, let's take a matrix that's `n x n`.
To find the determinant, you must first find n determinants of `(n - 1) x (n - 1)` matrices.
To find those determinants, you must find (n - 1) determinants of `(n - 2) x (n - 2)` matrices.

Suddenly, we have a big problem. 
To find the determinant of an `n x n` matrix, we must do `(n) * (n - 1) * (n - 2) * ... 1` operations, which is `n!` operations.
As anybody interested in computer science knows, algorithms with factorial time complexity are terrifying.
Computers are very fast, but even if each operation only takes us a nanosecond, it would take us over  491,857,242 years to find the determinant of a `25 x 25` matrix.
For a `30 x 30` matrix, it would take us roughly 8,411,113,013,698,631 years, which is most likely significantly longer than the Universe will exist.

## A timely solution

Thankfully, there is another way. 
Square matrices can be written as a product of two matrices.
One of those matrices has all zeros above the diagonal (with values in the lower half), and the other has all zeros below the diagonal (with values in the upper half).
These two types of matrices are called a *Lower Triangular Matrix* and an *Upper Triangular Matrix*, respectively.
Converting a square matrix into these two forms is known as taking the *LU Decomposition* of the matrix.

Now, determinants are distributive.
That is, `det(AB)` is equal to `det(A)det(B)`.
Thus, if we take the `LU` decomposition of A, we have `det(A) = det(LU) = det(L)det(U)`.

Usefully, upper and lower triangular matrices have a special property relating to determinants: their determinate is the product of their values in the diagonal. That is:

```
    | a 0 0 |
det(| n b 0 |) = a * b * c
    | q z c |

    | a n z |
det(| 0 b q |) = a * b * c
    | 0 0 c |
```

This is true regardless of what the other values are, or how large the matrix is.
Thus, if we have the LU decomposition of A, we can find the determinant of the matrix easily.

Finding the LU decomposition of a matrix is, according to wikipedia, an `O(n^3)` operation.
While not ideal, this is much faster than `O(n!)` factorial.
Both the `25 x 25` and `30 x 30` element examples I mentioned previously will take less than a second as opposed to thousands of years.

## LU decomposing

First off, you can only perform an LU decomposition on a square matrix.
So, let's define an exception to throw if you try to perform a decomposition on a non-square matrix:

```cpp
class NonSquareMatrix : std::runtime_error {
        public:
            explicit NonSquareMatrix() :
            std::runtime_error("Matrix is not square")
            {}
        };
```

Let's also define a helper function to determine if our matrix is square:

```cpp
    bool Matrix::isSquare(){
        return rows == columns;
    }
```

Now, our algorithm for finding the LU decomposition was quite tricky.
It took me a bit of time to turn what I could do on a paper into a general procedure.
After some thinking (and, of course, testing) I came up with a solution.

Explaining how this works would require a bit more than just a primer on linear algebra, and this is primarily a programming blog, so we won't get into that now.


```cpp
    void Matrix::performDecomp(){
        if(! isSquare()){
            throw NonSquareMatrix();
        }
        if(decomp_l && decomp_u){
            return;
        }
        // We went back and declared these as member variables, 
        // as you'll see in the full code
        // This did require us to modify our copy and move constructor,
        // as you will also see in the full version of this project
        decomp_l = std::make_unique<Matrix>(rows, columns);
        decomp_u = std::make_unique<Matrix>(*this);
        for(int r = 0; r < rows; r++){
            double init = decomp_u->getElement(r, r);
            for(int ru = r + 1; ru < rows; ru++){
                double head = decomp_u->getElement(ru, r);
                double mult = (head / init);
                decomp_l->setElement(ru, r, mult);
                for(int c = r; c < columns; c++){
                    double val = (-mult) * decomp_u->getElement(r, c);
                    val += decomp_u->getElement(ru, c);
                    decomp_u->setElement(ru, c, val);
                }
                decomp_u->setElement(ru, r, 0);
            }
         
        }
    }
```

## Determinants Part II

Now that we have the decomposition, finding the determinant is easy. 
We know that `L` has ones on the diagonal, so it doesn't effect the value of the matrix.
So, just multiply up along the diagonal of U, and we're set for any matrix bigger than two.
For matrices of size 2, we can use the formula we discussed earlier.

```cpp
    double Matrix::determinant() {
        if(! isSquare()){
            throw NonSquareMatrix();
        }
        if(rows == 2){
            return (data[0] * data[3]) - (data[2] * data[1]);
        }
        performDecomp();
        double mult = decomp_u->getElement(0, 0);
        for(int i = 1; i < columns; i++){
            mult *= decomp_u->getElement(i, i);
        }
        return mult;
    }
```


# Scalar Multiples

There's one operation we haven't implemented yet: scalar multiplication.
You can multiply a matrix by any scalar value, simply by multiplying each element by that value:

```
    | a b c |   | 2a 2b 2c |
2 * | d e f | = | 2d 2e 2f |
    | g h i |   | 2g 2h 2i |
```

Now, we want to define this for all scalar values—that is, all numbers.
A template is a good choice here, so we don't have to duplicate code all over the place.
Of course, we don't want to enable values of arbitrary type to be multiplied with matrices—we just want to enable numbers. 
Helpfully, C++'s standard library has a type trait, [std::is_arithmetic](http://en.cppreference.com/w/cpp/types/is_arithmetic), which describes exactly that.

I initially wanted to use `std::enable_if` to constrain the template argument using std::enable_if, but I couldn't figure out how to do it.
When I read a little further into it, I realized it was probably the wrong tool for the job.
Instead, I decided to use `static_assert`.

I also made this templated operator a friend of `NM::Matrix`, which made the implementation easier. 

The final result was this:

```cpp
template<typename T>
    Matrix operator*(T o, Matrix m){
        static_assert(std::is_arithmetic<T>::value,
                      "Can only multiply matricies by scalars or other matricies");
        Matrix r(m.rows, m.columns);
        for(int i = 0; i < m.rows; i++){
            for(int k = 0; k < m.columns; k++){
                r.setElement(i, k, o * m.getElement(i, k));
            }
        }
        return r;
    }

```

# Conclusion

Well, that was a fun little exercise.
I suppose we'll see if it actually helped me learn linear algebra after I take my first mid-term.

You can view the full source [on github](https://github.com/AnthonySuper/Matrix-Test).
