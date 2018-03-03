JavaScript
===


## ECMAScript
* 变量声明提前，变量作用域
* 闭包
* 作用域链与属性委托
* this
* call、apply、bind
* JS单线程，执行上下文、执行栈、异步
* ES6、7新特性
* 函数科里化
* event-loop事件队列，定时器，Promise、nextTick执行顺序

### 闭包的使用
封装模块

## DOM
* DOM操作、节点常用属性
* 事件的执行阶段，事件委托
* 节流函数
* [前端HTML5几种存储方式的总结](https://mp.weixin.qq.com/s?__biz=MzIzNTU2ODM4Mw==&mid=2247485935&idx=1&sn=b3faae7b8e21c4ff296d64b4dfaaeb58&chksm=e8e4647fdf93ed696db04e9b0dbd4fe1a06df6221ea1c2ede19ce1baf91d911be14110516d3b&mpshare=1&scene=1&srcid=02242xNs4l2IA16v4qOcJPA6#rd)
* requestAnimFrame ，传入的函数在重绘之前调用


## ES6
### Promise
Promise核心思想是将所有的同步和异步代码都转换为异步执行，即先在then方法中注册对应的回调函数，然后才会执行对应的异步操作（同步代码也会转换成异步执行）

为了实现链式调用，每个then方法都会返回一个新的`Promise`对象，且在新的`Promise`的构造参数`resolver`中为前一个`promise`对象注册对应的回调函数，并根据对应对调的返回值`result`是否是可`thenable`的，
* 不是`thenable`，则直接执行该新的`Promise`对象的`resolve`
* 是`thenable`，则在返回值`result`的`then`方法中执行`resolve`

### 解构赋值
* 数组：按顺序赋值
* 对象：按属性名赋值

### let和const

### Set 和 Map 数据结构
* ES6 提供了新的数据结构 Set 它类似于数组，但是成员的值都是唯一的，没有重复的值。
* ES6 提供了 Map 数据结构。它类似于对象，也是键值对的集合，但是“键”的范围不限于字符串，各种类型的值（包括对象）都可以当作键。也就是说，Object 结构提供了“字符串—值”的对应，Map 结构提供了“值—值”的对应，是一种更完善的 Hash 结构实现。
