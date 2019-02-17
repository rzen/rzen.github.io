---
title: Arrow function expressions
layout: post
date: 2018-09-12
tags: nuggets javascript
---

From documentation on mozilla's fabulous [web docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions):

> An arrow function expression is a syntactically compact alternative to a regular [function expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/function), although without its own bindings to the `this`, `arguments`, `super`, or `new.target` keywords. **Arrow function expressions are ill suited as methods, and they cannot be used as constructors.**

Here are a couple of examples to illustrate these caveats:

```js
o1 = { f: function () { console.log(this) } }
o1.f()  // {f: f}

o2 = { f: _ => { console.log(this) } }
o2.f()  // window
```

`o1.f` binds to the object that contains it, that is, `o1`, and as such `console.log(this)` outputs a reference to it.

`o2.f` on the other hand makes no such binding, which means `this` ends up pointing to the global context which if run from a browser, is the `window` object.

### Lexical scoping

Javascript is an interpreter. That said, before it interprets a program it compiles it. JS is a two-pass compiler.

The first pass reads declarations.

The second pass generates code.

One side effect of this process is known as "hoisting":

```js
a = 1;
var a;
```

Compiles and works exactly the same as:

```js
var a;
a = 1;
```

That is `var` declaration behaves as if it was "hoisted" to the top of the lexical block. This is known as "lexical scoping".

Beware of

```js
f();  // Uncaught TypeError: f is not a function
var f = function () {
	console.log('oops!');
}
```

The reason for the exception is, the code above is interpreted as follows:

```js
var f;
f();
f = function () {
	console.log('oops!');
}
```

Which means `f` is declared (thanks to hoisting) ahead of `f()` call but before function is assigned to it.

### Closures

A function that has all its variables defined inside is called a closed function. On the other hand, a function thaht has some of its variabled defined outside is open:

```js
function closed (a,b) {
	return a+b;
}

var c = 1;
function open (d) {
	return c+d;
}

console.log(closed(1,2)); // 3
console.log(open(1));     // 2
c = 3;
console.log(open(1));     // 4
```

The `open()` function "closed over" lexical environment, in this case variable `c` and function `closed()`. 

When a funtion is declared within lexical scope of a variable, it will retain access to the variable even when used outside of the lexical scope of its own declaration.

For example:

```js
let CounterFactory = function () {
	var counter = 0;
	return function () {
		return ++counter;
	}
}

let c1 = CounterFactory();
let c2 = CounterFactory();

console.log(c1());  // 1
console.log(c1());  // 2

console.log(c2());  // 1
console.log(c2());  // 2
console.log(c2());  // 3
```



This is whats known as "closure." The function "closes over" its lexical scope.

### Dynamic scope

Dynamic scope is exclusively concerned about the value of 'this' inside a function.

```js
function add () {
	return this.a + this.b;
}

let ab1 = {
	a: 1,
	b: 2
}

let ab2 = {
	a: 3,
	b: 4
}

console.log(add.call(ab1));   // 3

let add_ab1 = add.bind(ab1);  // f.bind() creates a new function
console.log(add_ab1());       // 3

let add_ab2 = add.bind(ab2);
console.log(add_ab2());       // 7
```

Much handier in object methohds:

```js
function Point (x,y) {
	this.x = x;
	this.y = y;
}

Point.prototype.moveTo = function (toX,toY) {
	this.x = toX;
	this.y = toY;
}

let p = new Point(1,2);
p.moveTo(3,4);
```