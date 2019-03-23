JavaScript
===

<!-- TOC -->

- [变量类型](#变量类型)
    - [数据类型转换 == 和 ===](#数据类型转换--和-)
    - [null 和 undefined的区别](#null-和-undefined的区别)
    - [新增数据类型Symbol](#新增数据类型symbol)
    - [函数参数传递](#函数参数传递)
- [作用域](#作用域)
    - [变量声明提升](#变量声明提升)
    - [为什么使用var可以重复声明](#为什么使用var可以重复声明)
    - [let和const](#let和const)
- [闭包](#闭包)
- [this](#this)
    - [箭头函数](#箭头函数)
- [原型与原型链](#原型与原型链)
    - [原型](#原型)
    - [ES6中的class](#es6中的class)
- [ES6](#es6)
    - [解构赋值](#解构赋值)
    - [Set 和 Map 数据结构](#set-和-map-数据结构)

<!-- /TOC -->


## 变量类型
变量类型包括
* 六种原始类型，包括Boolean、String、Number、Null、Undefined、Symbol
* 引用类型，Object对象

类型判断用到哪些方法
* typeof，可以得到undefined boolean number string object function、symbol等类型结果
* instanceof，用于实例和构造函数的对应

### 数据类型转换 == 和 ===
主要需要注意的是 == 操作符的比较规则，当两个数据的类型不一致时会发生类型转换，且可能同时发生类型转换，对应规则如下图所示
![](https://ws3.sinaimg.cn/large/006tNc79gy1fqaabatp6kj310i0aqgn8.jpg)

### null 和 undefined的区别
* null 表示一个对象是“没有值”的值，也就是值为“空”；
* undefined 表示一个变量声明了没有初始化(赋值)；

### 新增数据类型Symbol
[Symbol](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol) 是ES6新增的一种基础数据类型，代表的是 唯一且不与其他任何类型相同的值。

```js
// 创建一个唯一的symbol
var sy1 = Symbol("foo") 
var sy2 = Symbol("foo")
console.log(sy1 === sy2) // false

// 创建一个可复用的symbol，其原理为：从全局symbol注册表中查找对应的symbol，如果没有则新建并返回；如果有则直接返回
var gSy =  Symbol.for("foo") 
var gSy2 =  Symbol.for("foo")

console.log(sy1 == gSy) // false
console.log(gSy2 == gSy) // true

console.log(Symbol.keyFor(gSy)) // foo
```

Symbol的一个作用是当做对象的属性名。凡是属性名属于 Symbol 类型，就都是独一无二的，可以保证不会与其他属性名产生冲突。

但是需要注意的是：Symbol 作为属性名，该属性不会出现在for...in、for...of循环中，也不会被Object.keys()、Object.getOwnPropertyNames()、JSON.stringify()返回，通过`Object.getOwnPropertySymbols`方法可以获取指定对应的所有Symbol属性名

Symbol的另外一个作用是：可以创建唯一的枚举值，如redux中的actionType等。

### 函数参数传递
JS中的变量类型可以分为基础类型和引用类型，需要注意的是：**JS中的函数参数传递，都是按值进行的**
* 原始类型的处理方式是，将参数的值完全复制一份，按值传递，
    * 对于传递过来的变量进行修改，不会影响到原变量。
* 引用类型的处理方式是，将参数的地址复制一份，按值传递地址(更准确的说是引用复制传递)
    * 对于变量的成员进行修改时，会直接影响原变量；
    * 而如果对传递过来的变量进行重新赋值，则不会影响原变量，并且此后再修改变量的成员，也不会影响原变量。
    
```js
var obj = {
    x: 1
}
function foo(o){
    o.x = 100
}
function foo2(o) {
    o = 100
}

console.log(obj) // {x:1}
foo(obj)
console.log(obj) // {x:100}
foo2(obj)
console.log(obj) // // {x:100}
```

这种设计的意义在于：
* 按值传递的类型，复制一份存入栈内存，这类类型一般不占用太多内存，而且按值传递保证了其访问速度。
* 按共享传递的类型，是复制其引用，而不是整个复制其值（C 语言中的指针），保证过大的对象等不会因为不停复制内容而造成内存的浪费。

## 作用域
JavaScript采用的作用域规则是**词法作用域**。词法作用域就是定义在词法阶段的作用域。换句话说，词法作用域是由你在写 代码时将变量和块作用域写在哪里来决定的，因此当词法分析器处理代码时会保持作用域不变（大部分情况下是这样的）。

无论函数在哪里被调用，也无论它何时被调用，它的词法作用域都只由函数被声明时所处的位置决定。这对于理解闭包有很大的帮助。

在JavaScript中可以通过with和eval等方式欺骗词法，但是由于JavaScript引擎会在编译阶段对作用域查找进行性能优化，如果使用上述手段欺骗作用域，则可能导致程序运行效率的下降，因此不建议使用。

### 变量声明提升
在编译阶段，函数声明和变量声明都会提升到当前作用域的开头。每个作用域都会进行提升操作
* 函数声明会提升，但函数表达式不会
* 函数声明提升优先级大于变量声明提升，即函数声明提升会覆盖同名的变量声明提

下面是变量声明相关的示例
```js
console.log(a); // function
a(); // 10
var a=3;
function a(){
    console.log(10)
}   
console.log(a); // 3
a=6;
a(); // error
```
```js
var a = 100;
var fn = () => {
    console.log(a);
    var a = 200;
    console.log(a);
}
fn(); // undefined, 200
console.log(a); // 100
var a;
console.log(a); // 100
var a = 300;
console.log(a); // 300
```

### 为什么使用var可以重复声明
在代码运行过程中，首先是编译器对代码进行拆解分析，如果从左至右遇见var a，
* 则编译器会询问作用域是否已经存在叫a的变量了，
* 如果不存在，则在作用域声明一个新的变量a，若已经存在，则忽略var 继续向下编译

由于编译器会**忽略**通过var重复声明的变量，因此使用var可以重复声明变量。

### let和const
`let`和`const`会声明的变量具有块级作用域，他们不会进行声明提升。

## 闭包
JS里面的作用域是**词法作用域**，因此无论函数在哪里被调用，也无论它何时被调用，它的词法作用域都只由函数被声明时所处的位置决定。
对于不在函数内部声明却在函数内部使用的**自由变量**，同样遵循词法作用域的限制。当函数在其声明的词法作用域之外执行，仍旧可以访问函数声明时的词法作用域，此时就产生了闭包。

换句话说，函数**在定义的时候**（而不是调用的时候），就已经确定了函数体内部自由变量的作用域，闭包使得函数可以继续访问定义时的词法作用域。

闭包是在某个作用域内定义的函数，它可以访问这个作用域内的所有变量。闭包作用域链通常包括三个部分：
* 函数本身作用域。
* 闭包定义时的作用域。
* 全局作用域。

下面是关于闭包的一个常见问题：循环中的闭包
```js
for(var i = 0; i < 3; ++i){
    setTimeout(() => {
        // 由于此处访问到的是外面作用域的i
        console.log(i) // 3,3,3
    }, i*10);
}

for (var i = 0; i < 3; ++i) {
    ((i)=>{
        // 通过IIFE实现了一个内部作用域，访问到的是循环内部作用域的i
        setTimeout(() => {
            console.log(i) // 0,1,2
        }, i * 10)
    })(i)
}

for(let i = 0; i < 3; ++i){
    // let 定义的变量在循环内部作用域
    setTimeout(() => {
        console.log(i) // 0,1,2
    }, i*10);
}
```
再来看一个闭包的问题
```js
function fun(n, o) {
    console.log(o);
    return {
        fun: function(m) {
            return fun(m, n);
        }
    };
}
var a = fun(0); // undefined
a.fun(1); // 0
a.fun(2); // 0
a.fun(3); // 0

var b = fun(0) // undefined
    .fun(1) // 0
    .fun(2) // 1
    .fun(3); // 2

var c = fun(0).fun(1);// undefined, //0
c.fun(2); // 1
c.fun(3); // 1
```

闭包常见用途：
* 创建特权方法用于访问控制，比如封装模块
* 事件处理程序及回调

## this
虽然JS采用的是词法作用域，但this并不是在编写时绑定的，而是是在函数运行时自动绑定到函数作用域的，它的上下文取决于函数调用时的各种条件。
* 函数是否在 new 中调用？如果是的话 this 绑定的是新创建的对象。 
* 函数是否通过 call、apply（显式绑定）或者 bind 硬绑定调用？如果是的话，this 绑定的是 指定的对象。
* 函数是否在某个上下文对象中调用（隐式绑定）？如果是的话，this 绑定的是那个上下文对象。
* 如果都不是的话，使用默认绑定。如果在严格模式下，就绑定到 undefined，否则绑定到 全局对象。


来看看下面这个例子
```js
var obj1 = {
  	name: "obj1",
  	fn(){
      	console.log(this.name);
  	}
};
var obj2 = { name: "obj2" };
var obj3 = { name: "obj3" };
obj1.fn(); // obj1
var newFn = obj1.fn;
newFn(); // "" 注意这里不是undefined，window包含默认的name属性
newFn.call(obj2); // obj2
obj3.fn = newFn;
obj3.fn(); // obj3

var newFn = obj1.fn.bind(obj1);
newFn(); // obj1
newFn.call(obj2); // obj1，注意这个地方是强绑定，所以一直为obj1
obj3.fn = newFn;
obj3.fn(); // obj1 ，同上
```

### 箭头函数
ES6新增了箭头函数的语法糖
```js
let add = (a, b)=>{
    return a + b
}
```
其好处包括
* 写起来更加简洁
* 可以将函数的this绑定到当前作用域，避免`var self = this`的情形

需要注意的是箭头箭头函数可能会影响某些框架中对于配置项函数的this绑定，如Vue中的生命周期函数、methods方法等，其内部实现会把这些函数的this绑定到vm实例上，因此在这些场景下不能使用箭头函数。

## 原型与原型链

### 原型
所有的对象都是由其构造函数创建，基础对象最基本的构造函数是Obecjt()。
* 每个对象都有一个" proto "的属性，指向该对象构造函数的原型，该属性也被称为隐式原型。
* 每个函数都有一个"prototype"的属性，表示这个构造函数的原型，函数的原型实际上是一个对象，并且该对象有一个construct的属性，指向构造函数本身。

当试图得到一个对象的某个属性时，如果这个对象本身没有这个属性，那么会**委托**它的__proto__（即它的构造函数的prototype）中寻找，如果一直找到最上层都没有找到，那么就宣告失败，返回undefined。最上层是 `Object.prototype.__proto__ === null`

```js
function A() {}
function B(a) {
    this.a = a;
}
function C(a) {
    if (a) {
        this.a = a;
    }
}

A.prototype.a = 1;
B.prototype.a = 1;
C.prototype.a = 1;

console.log(new A().a); // 1
console.log(new B().a); // undefined 只有当对象没有从它自己身上找到对应的属性才会委托原型查找
console.log(new C(2).a); // 2
```
```js
var F = function () {}
Object.prototype.a = function () {}
Function.prototype.b = function () {}

var f = new F()
console.log(f.a) // function f的构造函数是F，其原型链只有有Object.prototype，没有Function.prototype
console.log(f.b) // undefined

console.log(F.a) // function, F的构造函数是Function，其原型链上有Function.prototype和Object.prototype
console.log(F.b) // function
```

### ES6中的class
ES6中新增了`class`关键字，用于取代之前构造函数初始化对象的形式，从语法上更加符合面向对象的写法。需要注意的是
* 使用extends即可实现继承，更加符合经典面向对象语言的写法，如 Java
* 子类的constructor一定要执行super()，以调用父类的constructor

```js
class A {
    say(){
        console.log("foo");
    }
}
let a = new A();
A.prototype = {
    say(){
        console.log("bar");
    }
}

// ES6中的class是语法糖，构造函数class的prototype是无法修改其他指向的。
a.say(); // "foo"
let b = new A();
b.say(); // "foo"
```

## ES6
ES6新增了一些常用的新特性
* let、const代替var，使用块级作用域
* 模板字符串，不需要手动去拼接字符串了
* 箭头函数，简化代码，自动绑定外部函数this
* 函数的默认参数，声明和展开剩余参数
* 解构赋值
* 对象字面量方法简写，动态属性名
* class关键字，创建类的语法糖

### 解构赋值
* 数组：按顺序赋值
* 对象：按属性名赋值

### Set 和 Map 数据结构
* ES6 提供了新的数据结构 Set 它类似于数组，但是成员的值都是唯一的，没有重复的值。
* ES6 提供了 Map 数据结构。它类似于对象，也是键值对的集合，但是“键”的范围不限于字符串，各种类型的值（包括对象）都可以当作键。也就是说，Object 结构提供了“字符串—值”的对应，Map 结构提供了“值—值”的对应，是一种更完善的 Hash 结构实现。
