---
layout: post
title: Currying
date: 2014-11-07
---

> In mathematics and computer science, currying is the technique of translating the evaluation of a function that takes multiple arguments (or a tuple of arguments) into evaluating a sequence of functions, each with a single argument (partial application).

In plain english, currying it turning a function that does this:

```js
function add(a,b,c) {
	return a+b+c;
}

console.log(add(1,2,3));  // 6
```

Into a sequence of functions that do this:

```js
function curriedAdd(a) {
	return function (b) {
		return function (c) {
			return a+b+c;
		}
	}
}

console.log(curriedAdd(1)(2)(3));  // 6
```

This example is simplistic but accurate. 

The thing to realize here is, a call to `curriedAdd()` returns a function, not a value:

```js
let add1 = curriedAdd(1);  // add1 is a funcion!

console.log(add1(2)(3));   // 6
```

<aside>Named after <a href="https://en.wikipedia.org/wiki/Haskell_Curry">Haskell Curry</a>.</aside>

## Why?

Primary use case is to create pre-configured functions that can be called from methods like `.map()` or `.filter()`:

```js
function showMessage (m) {
	console.log(m)
}

let a = [1,2,3,4,5,6];

a.map(function (a) {
	return a+2;
});                    // [3,4,5,6,7,8]
```

Curryed alternative:

```js
let curry = (fn, ...args) =>
	(fn.length <= args.length) ?
		fn(...args) :
		(...more) => curry(fn, ...args, ...more);

let a = [1,2,3,4,5,6];

function add (a,b) {
	return a+b;
}

let add2 = curry(add, 2);

a.map(add2);   // [3,4,5,6,7,8]
```

Makes for a much less clustter at the point of use.

Another example:

```js
let curry = (fn, ...args) =>
	(fn.length <= args.length) ?
		fn(...args) :
		(...more) => curry(fn, ...args, ...more);

let a = [1,2,3,4,5,6];

function compare (a,b) {
	return b>a;
}

let lessThan3 = curry(compare, 3);

a.filter(lessThan3);   // [4,5,6]
```

## How?

Any function can be curryied in javascript. Lets review curry() we've used above:

```js
let curry = (fn, ...args) =>

	// did curry get enough arguments for the function
	// to compute result?
	(fn.length <= args.length) ?

		// yes -- call target function
		fn(...args) :

		// no -- call return a function that
		// expects more arguments to call curry()
		// for further processing
		(...more) => curry(fn, ...args, ...more);

let add = (a,b) => a+b;
add(1,2);  // 3
let add1 = curry(add,1);
add1(2);   // 3
```

Noteworthy a traditionally functional notation of curry process. The following denotes a function that takes in a tuple of `(a,b,c)` and returns the sum of `a+b+c`.

```js
let add = (a,b,c) => a+b+c;
add(1,2,3);  // 6
```

A curried version of such function, also in arrow notation:

```js
let add = a => b => c => a+b+c;
add(1)(2)(3);  // 6
```

## Uncurry

For completeness sake lets mention uncurry. Which is the reverse of curry. This implementation is borrowed from [Currying and Uncurrying in JavaScript and Flow](https://medium.com/@JosephJnk/currying-and-uncurrying-in-javascript-and-flow-98877c8274ff).

```js
let curry = (fn, ...args) =>
	(fn.length <= args.length) ?
		fn(...args) :
		(...more) => curry(fn, ...args, ...more);

let uncurry = fn =>
	(...args) => args.reduce((fn, arg) => fn(arg), fn);

let add = (a,b,c) => a+b+c;
add(1,2,3);  // 6

let curriedAdd = curry(add);
curriedAdd(1)(2)(3);  // 6

let uncurriedCurriedAdd = uncurry(curriedAdd);
uncurriedCurriedAdd(1,2,3);  // 6
```

Lets review `uncurry()`:

```js
// fn is a curryed function
let uncurry = curryedFn =>

	// uncurry returns a new function
	// that takes ...args
	(...args) => 

	             // reduce() takes two args,
	             // the reducer function and an initial
	             // value (see "initial value" below)
				 args.reduce(

				 	         // this is first arg
				 	         // to reduce()

				 	         // the reducer function
				 	         // (here) gets two args

				 	         // fn is the initial value
				 	         // passed into reduce() call
				 	         // (see below) 
				             (fn,

				 	              // and the value of current arg
				 	              // of ...args
				                  arg)

				                       // call curryed functions
				                       // one at a time, return
				                       // next curry function
				                       // or final result
				                       => fn(arg),

				                                  // this is second
				                                  // arg to reduce()

				                                  // initial value
				                                  // is the target
				                                  // curryedFn
				                                  curryedFn);
```

Keep in mind, `Array.prototype.reduce(reducerFn)` will call `reducerFn(accumulator, currentValue, currentIndex, sourceArray)` `args.length-1` times. It will do so because it considers the first element of the array an initial value. E.g.:

```js
[1,2,3,4].reduce((...args) => {
	console.log(args);
});
```

<aside class="alert">Mindbender alert!</aside>

When initial value is provided `.reduce(fn, initValue)` reducer is called `args.length` times, for each member of the `...args` array. In this implementation of `uncurry()` we make use of this quirk. As an initial value we pass in `curryedFn` which gets passed to reducer as the first argument. Second argument to the reducer is the current value of `...args` array which for the very first call is `args[0]`. Reducer calls `curryedFn(args[0])` and returns the result of this call back to `.resuce()` to be used as the first argument to the next call of reducer. Subsequent calls to the curried function will return functions that handle incoming uncurryed arguments one per call, ultimately last call would return a value which gets returned out of uncurry function. A bit of a mind bender, indeed.

Please keep in mind, implementations of curry and uncurry in this piece have been optimize for clarity, not performance. For practical use one would be best advised to make use of implementations provided by established libraries such as [npm curry](https://www.npmjs.com/package/curry) or [lodash](https://lodash.com/docs/4.17.11#curry).


Resources
---

- [Currying in JavaScript - A technique using partial evaluation](https://medium.com/@kbrainwave/currying-in-javascript-ce6da2d324fe)
- [npm - curry](https://www.npmjs.org/package/curry)
- [Currying - Wikipedia.org](http://en.wikipedia.org/wiki/Currying)
- [Haskell Curry](http://en.wikipedia.org/wiki/Haskell_Curry)
- [Lambda Calculus](http://en.wikipedia.org/wiki/Lambda_calculus)
- [Haskell Brooks Curry](http://www-groups.dcs.st-and.ac.uk/~history/Biographies/Curry.html)
- [Currying in JavaScript](https://medium.com/@kbrainwave/currying-in-javascript-ce6da2d324fe)
- [JavaScript ES6 curry functions with practical examples](https://medium.com/front-end-weekly/javascript-es6-curry-functions-with-practical-examples-6ba2ced003b1)
- [Currying is not idiomatic in JavaScript](http://2ality.com/2017/11/currying-in-js.html)
