JavaScript
===

## 数据类型
参考：[数据类型](./数据类型.md)

## 运算符
参考：[运算符](./运算符.md)

## 作用域和闭包
参考：[JavaScript中的变量作用域](https://www.shymean.com/article/JavaScript%E4%B8%AD%E7%9A%84%E5%8F%98%E9%87%8F%E4%BD%9C%E7%94%A8%E5%9F%9F)

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

### 闭包
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

### this
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

### bind方法
参考：[Function.prototype.bind](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)

在不考虑返回的函数作为构造函数调用的情况下可以使用下面的代码
```js
Function.prototype.customBind = function (obj, ...args) {
    var self = this
    return function (...arg2) {
        return self.call(obj, ...args, ...arg2)
    }
}
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

参考
* [普通函数与箭头函数的区别与注意事项](https://mp.weixin.qq.com/s/N0ahVkwVhDpnzGdZyC8jQg)

箭头函数没有prototype(原型)，所以箭头函数本身没有this

箭头函数的this在定义的时候继承自外层第一个普通函数的this。

如果箭头函数外层没有普通函数，严格模式和非严格模式下它的this都会指向window(全局对象)

箭头函数本身的this指向不能改变，但可以修改它要继承的对象的this。

箭头函数的this指向全局，使用arguments会报未声明的错误。

箭头函数的this指向普通函数时,它的argumens继承于该普通函数

使用new调用箭头函数会报错，因为箭头函数没有constructor

箭头函数不支持new.target

箭头函数不支持重命名函数参数,普通函数的函数参数支持重命名

箭头函数相对于普通函数语法更简洁优雅



### 内存

**变量在内存中的存储形式**

参考：
* [JavaScript中的变量在内存中的具体存储形式](https://www.jianshu.com/p/80bb5a01857a)
* [JS对象数据结构底层实现原理](https://www.cnblogs.com/zhoulujun/p/10881639.html)

* 基本类型是保存在栈内存中的简单数据段，它们的值都有固定的大小，保存在栈空间，通过按值访问
* 引用类型是保存在堆内存中的对象，值大小不固定，栈内存中存放的该对象的访问地址指向堆内存中的对象，JavaScript不允许直接访问堆内存中的位置，因此操作对象时，实际操作对象的引用
* 需要注意的是闭包中的变量，实际上是保存在`[[Scoped]]`对象中的，也可以理解为保存在堆中

当访问堆内存中的变量时，首先从栈内存中获取该变量的地址，然后才能从堆内存中根据地址获取对象的数据。

当变量赋值时，栈内存中数据会发生复制：对于原始类型的变量，复制的是值；对于引用类型而言，复制的是对象在堆内存中的地址

**垃圾回收与内存泄漏**

参考：[JavaScript的垃圾回收机制](https://www.shymean.com/article/JavaScript%E7%9A%84%E5%9E%83%E5%9C%BE%E5%9B%9E%E6%94%B6%E6%9C%BA%E5%88%B6)


## 原型与原型链
参考：[原型继承](./原型.md)

## EventLoop
参考：[EventLoop](./EventLoop.md)

## ES6
参考
* [1.5万字概括ES6全部特性](https://juejin.im/post/5d9bf530518825427b27639d)

ES6新增了一些常用的新特性
* 变量声明，let、const代替var，使用块级作用域
* Symbol变量类型
* 解构赋值
* String扩展，如模板字符串等方法
* Number扩展，如将parseInt等方法放在了Math对象上
* 对象扩展，如简洁表示法、属性名表达式、class实现类
* 数组扩展，如扩展运算符、inclueds
* 函数扩展，如默认参数、箭头函数、rest/spread参数
* Set、Map、WeakSet、WeakMap
* Proxy、Reflect
* 模块规范，export/import
* Promise、Generator

### 解构赋值
* 数组：按顺序赋值
* 对象：按属性名赋值

### Set/WeakSet 和 Map/WeakMap
先来看看`Set`和`Map`
* ES6 提供了新的数据结构 Set 它类似于数组，但是成员的值都是唯一的，没有重复的值。
* ES6 提供了 Map 数据结构。它类似于对象，也是键值对的集合，但是“键”的范围不限于字符串，各种类型的值（包括对象）都可以当作键。也就是说，Object 结构提供了“字符串—值”的对应，Map 结构提供了“值—值”的对应，是一种更完善的 Hash 结构实现。

再看看`WeakSet`和`WeakMap`，他们的一个用途是，是储存 DOM 节点，而不用担心这些节点从文档移除时，会引发内存泄漏。
* WeakSet结构与Set类似，也是不重复的值的集合，但是，它与Set有两个区别。首先，WeakSet的成员只能是对象，而不能是其他类型的值，其次，WeakSet中的对象都是弱引用，即垃圾回收机制不考虑 WeakSet 对该对象的引用
* WeakMap结构与Map结构类似，但是WeakMap只接受对象作为键名（null除外），不接受其他类型的值作为键名，同样地，WeakMap的键名所指向的对象，不计入垃圾回收机制

### 装饰器

* [装饰器](http://es6.ruanyifeng.com/#docs/decorator)

## 异步编程
* [Event loop]('./eventLoop.md')
* [理解Generator函数与async函数](https://www.shymean.com/article/%E7%90%86%E8%A7%A3Generator%E5%87%BD%E6%95%B0%E4%B8%8Easync%E5%87%BD%E6%95%B0)
* co库的基本使用


## Proxy
参考
* [proxy - MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy)

```js
let handler = {
    // 监听get
    get: function(target, name){},
    // 监听set
    set: function(obj, prop, value) {}
};

let target = {}
let p = new Proxy(target, handler);
```

## 异常处理

通过责任链模式封装业务错误

参考：
* [JS错误处理 MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Control_flow_and_error_handling)
* [js构建ui的统一异常处理方案](https://www.cnblogs.com/laden666666/p/5281993.html)

## 模块

> 问题：JavaScript有哪些模块规范？他们的区别是什么？模块的循环依赖机制是什么？

参考：[JavaScript模块管理机制](https://www.shymean.com/article/JavaScript%E6%A8%A1%E5%9D%97%E7%AE%A1%E7%90%86%E6%9C%BA%E5%88%B6)

## 装饰器

参考
* [decorator](http://es6.ruanyifeng.com/#docs/decorator)
* [TypeScript装饰器（decorators）](https://www.cnblogs.com/winfred/p/8216650.html)


装饰器本质就是编译时执行的函数，用于装饰类和类的方法，注意不能装饰函数（如果一定要装饰函数，可以采用高阶函数的形式直接执行。）

```js
@decorator
class A {}

// 等同于

class A {}
A = decorator(A) || A; // 如果在装饰器函数内返回新对象，则A会被替换掉
```

在TypeScript中装饰器可以修饰四种语句：类，属性，访问器，方法以及方法参数。

装饰器本身其实就是一个函数，理论上忽略参数的话，任何函数都可以当做装饰器使用。

类型包括
* 类装饰器，应用于类构造函数，其参数是类的构造函数。
* 方法装饰器，它会被应用到方法的 属性描述符上，可以用来监视，修改或者替换方法定义。
* 方法参数装饰器，参数装饰器表达式会在运行时当作函数被调用
* 属性装饰器，属性装饰器表达式会在运行时当作函数被调用
