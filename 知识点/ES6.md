ES6
===

## Promise
Promise核心思想是将所有的同步和异步代码都转换为异步执行，即先在then方法中注册对应的回调函数，然后才会执行对应的异步操作（同步代码也会转换成异步执行）

为了实现链式调用，每个then方法都会返回一个新的`Promise`对象，且在新的`Promise`的构造参数`resolver`中为前一个`promise`对象注册对应的回调函数，并根据对应对调的返回值`result`是否是可`thenable`的，
* 不是`thenable`，则直接执行该新的`Promise`对象的`resolve`
* 是`thenable`，则在返回值`result`的`then`方法中执行`resolve`

## 解构赋值
* 数组：按顺序赋值
* 对象：按属性名赋值

## let和const
