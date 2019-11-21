JavaScript
===


## 变量类型
变量类型包括
* 六种原始类型，包括Boolean、String、Number、Null、Undefined、Symbol
* 引用类型，Object对象

类型判断用到哪些方法?
* typeof，可以得到undefined boolean number string object function、symbol等类型结果
    * 注意对于数组、null和object而言，typeof都会返回`'object'`
* instanceof，用于实例和构造函数的对应，其工作机制是：检测右侧构造函数的`prototype`属性是否出现在左侧实例对象的原型链上。
* `Object.prototype.toString.call(xxx)`将会得到一个包含变量类型的字符串

### 数据类型转换 == 和 ===
主要需要注意的是 == 操作符的比较规则，当两个数据的类型不一致时会发生类型转换，且可能同时发生类型转换，对应规则如下图所示
![](https://ws3.sinaimg.cn/large/006tNc79gy1fqaabatp6kj310i0aqgn8.jpg)

总结一下`==`比较的规则
* `null == undefined`，反之亦然；
* 字符串与数字比较，会将字符串转换成数字然后进行比较
* 布尔值与任何类型比较，都先将布尔值转换成数字，然后再进行比较
* 字符串与对象比较，先将对象传入toPrimitive，然后与字符串进行对比；数字同理

关于对象转原始类型`ToPrimitive(input, PreferredType?)`，可以参考:
* [JavaScript 对象转换到基本类型值算法](https://juejin.im/post/5a695ec16fb9a01ca10b195b)
* [Symbol.toPrimitive](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toPrimitive)
* [详解ECMAScript7规范中ToPrimitive抽象操作的知识（示例）](https://www.php.cn/js-tutorial-410318.html)

其中hint的取值可以为`number`、`string`或`default`，表示当前语境传入的值(或者说是表示这是一个什么类型的运算)，常见的运算中
```js
var a = {
    [Symbol.toPrimitive](hint) {
        console.log(hint)
    }
}
+a // hint为number
a + 1 // hint为default

// 下面情况hint为string
var o = {}
o[a] = 'xx' // string
alert(a) // string
parseInt(a) // string
```

`ToPrimitive`的具体流程如下：
* 如果对象存在`Symbol.toPrimitive`，调用 obj[Symbol.toPrimitive](hint)，
    * 其中hint为当前语境传入的值(或者说是表示这是一个什么类型的运算)，取`number`、`string`或`default`；
*如果不存在`Symbol.toPrimitive`，且 `hint` 取值是 "string"：
    * 无论是否存在，先调用 `obj.toString()`，如果返回了原始值，则使用该值；否则调用`obj.valueOf()`。
* 否则（也就是 hint 取值是 "number" 或 "default" 的情况）：
    * 无论是否存在，先调用 `obj.valueOf()`，如果返回了原始值，则使用该值；否则调用`obj.toString()`。

需要注意
* `Symbol.toPrimitive`方法或最后调用的`obj.toString`只能返回原始值，否则会抛出`TypeError`
* 我们创建的字面量对象`{}`和`[]`不包含`Symbol.toPrimitive`方法，且`valueOf`方法返回的是自身，仍旧为引用值
* 但是`Date`对象实现了默认的`Symbol.toPrimitive`方法，且返回的返回的是`date.toString`的值

```js
let user = {
    name: "John",
    money: 1000,

    [Symbol.toPrimitive](hint) {
        // 手动修改toPrimitive的值
        return false
    }
};
console.log(user == false) // true

// 先调用valueOf，返回[]，需要再调用toString，返回'', 表达式变成'' == false，
// 然后将布尔值转换为数字, '' == 0, 
// 字符串与数字比较时将字符串转换为数字，表达式变为 0 == 0，返回true
console.log([] == false) 

```
最后，记住上面的比较只会发生在原始值和对象之间，当二者均为引用对象时，比较的是内存地址而不是上面的运算规则

实战一下
```js
console.log(null == undefined) // true
console.log(undefined == null) // true

console.log(undefined == false) // false NaN !== 0
console.log(undefined == true) // false NaN !== 1

console.log([] == '') // true, '' == '' => 0 == 0
console.log([] == true) // false, '' == true => 0 === 1
console.log([] == ![]) // true, Boolean([])为true, [] == false => 0 == 0
console.log([] == []) // false, 数组地址不同
console.log([0] == false) // true '0' == 0 => 0 == 0

console.log({} == {}) // false，对象地址不同
console.log({} == !{}) // false, {} == false => '[object Object]' == 0 => 1 == 0 
```

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

### 数字精度问题
`0.1 + 0.2 `不等于`0.3`，这是因为，计算机的二进制实现和位数限制有些数无法有限表示。
JS采用双精度存储
* 1位用来表示符号位
* 11位用来表示指数
* 52位表示尾数

当表示浮点数时可能出现尾数无限循环，因此只能四舍五入，由于只存在0和1，这就会导致计算机浮点数运算出现误差。

解决办法
* 现将浮点数转换成整数，计算之后在除以扩大的倍数，如`(0.1*10+2*10)/10`
* 手动实现计算库，按位进行计算

## 运算符

参考：
* [运算符优先级](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Operator_Precedence)
* [JavaScript运算符优先级](https://juejin.im/post/5b22a5a36fb9a00e43465e2c)

需要注意两个地方
* 运算符优先级
* 运算符关联性，从右向左还是从左向右

```js
// 优先级高的运算符最先被执行
1 || 1 ? 2 : 3 // ||的优先级高于 ?: 因此为 (1 || 1) ? 2 : 3

// 关联性，一个运算符有规定的操作方向，如 =、?: 为从右向左，||、&&等从左向右
var a = b = 1 // 从右向左执行相当于 b=1;var a=b;只声明了a
```

### 优先级
在计算表达式时，先根据运算符的优先级将子表达式绑定在一起(相当于用`()`包起来)
```js
1 || true && fn() // && 优先级高，因此将后面的子表达式绑定在一起 => 1 || (ture  && fn())
1 || (true && fn()) // || 的关联方向从左向右，因此 先执行左边 为true，短路直接返回 1
```

```js
var a = 42;
var b = "foo";
var c = 0;

c || b ? a : b ;  // || 的优先级高，因此将前面的关联起来 
(c || b) ? a : b; // c||b为true，因此返回a
```

### 关联性
运算符的关联式决定了我们如何拆分子表达式
```js
var a = 42;
var b = "foo";
var c = 0;
a && b || c ? c || b ? a : c && b : a  
// && || 均为从左向右, ?:为从右向左，因此先拆分表达式
a && b || c ? (c || b ? a : c && b) : a  
a && b || c ? (c || b ? a : (c && b)) : a  
// 然后再根据优先级将子表达式进行绑定
((a && b ) || c ) ? ((c || b) ? a : (c && b)) : a  
// 最后返回 a
```

### 小结
关联性和优先级都是我们需要记忆的，这里了整理了一下
* 优先级而言：属性访问 > 算术操作符 > 比较操作符> 逻辑操作符 > "="赋值符号
* 关联性而言，
    * 从右向左的运算符有：
        * `new Foo无参数列表`
        * 逻辑非`!xx`、按位非`~xx`、一元加法`+a`、一元减法`-b`、`++a`、`--a`、`typeof a`、`void a`、`delete a.b`、`await`
        * 幂`a**b`
        * 条件运算`a ? b : c`
        * 赋值运算`=`以及`+=`、`-=`等组合赋值运算
        * `yield`、`yield * `
    * 无关联性的运算符有
        * `new Foo(带参数列表)`
        * `a++`、`a--`
        * 展开运算符`...[a,b]`
    * 其余均为从左向右关联性的运算符

可以查阅文档：[运算符优先级](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Operator_Precedence)

### 一个常见的考题
参看下面的题目
```js
function Foo() {
    getName = function () {
        console.log(1)
    }
    return this;
}
Foo.getName = function () {
    console.log(2)
}
Foo.prototype.getName = function () {
    console.log(3)
}
var getName = function () {
    console.log(4)
}

function getName() {
    console.log(5)
}

Foo.getName() // 2, 调用类的静态方法Foo.getName

getName()  // 4, function getName()会进行提升,之后被var getName重新赋值

Foo().getName() // 1, 修改外部变量getName为console.log(1)

new Foo.getName() //  2, new运算符的优先级低于属性访问符`.` => new (Foo.getName)() 将 Foo.getName作为构造函数调用

new Foo().getName() // 3, 运算符优先级 new的优先级大于函数调用Foo()，且从左向右结合，转换为 (new Foo()).getName()，访问实例对象上的getName方法，委托到原型链查找

new new Foo().getName() // 3, 表达式中的运算符均从左向右结合 new (new Foo()).getName() => new ((new Foo()).getName)()， 将Foo.prototype.getName作为构造函数调用
```


## 作用域和闭包
参考：
* [JavaScript中的变量作用域](https://www.shymean.com/article/JavaScript%E4%B8%AD%E7%9A%84%E5%8F%98%E9%87%8F%E4%BD%9C%E7%94%A8%E5%9F%9F)

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

当访问堆内存中的变量时，首先从栈内存中获取该变量的地址，然后才能从堆内存中根据地址获取对象的数据。

当变量赋值时，栈内存中数据会发生复制：对于原始类型的变量，复制的是值；对于引用类型而言，复制的是对象在堆内存中的地址

**垃圾回收与内存泄漏**

参考：[JavaScript的垃圾回收机制](https://www.shymean.com/article/JavaScript%E7%9A%84%E5%9E%83%E5%9C%BE%E5%9B%9E%E6%94%B6%E6%9C%BA%E5%88%B6)


## 原型与原型链
参考：[原型继承](./原型.md)

## EventLoop

参考：[理解EventLoop](https://www.shymean.com/article/%E7%90%86%E8%A7%A3EventLoop)

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