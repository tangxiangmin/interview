
Event loop
===

参考
* [一次弄懂Event Loop](https://mp.weixin.qq.com/s/KEl_IxMrJzI8wxbkKti5vg)


在JavaScript中，任务被分为两种，
* 一种宏任务（MacroTask）也叫Task，包括：script全部代码、setTimeout、setInterval、setImmediate（浏览器暂不支持）、I/O、UI Rendering。
* 一种叫微任务（MicroTask），包括：Process.nextTick（Node独有）、Promise、Object.observe(废弃)、MutationObserver。await也是由promise实现的，因此也理解为是MicroTask

## 浏览器中的Event loop
浏览器中，事件循环模型为
* 执行栈在执行完同步任务后，查看执行栈是否为空，
* 如果执行栈为空，就会去检查微任务(microTask)队列是否为空，如果为空的话，就执行Task（宏任务），否则就一次性执行完所有微任务。
* 每次单个宏任务执行完毕后，检查微任务(microTask)队列是否为空，如果不为空的话，会按照先入先出的规则全部执行完微任务(microTask)后，设置微任务(microTask)队列为null，然后再执行宏任务，如此循环。


查看下面代码
```
console.log('script start');

setTimeout(function () {
    console.log('setTimeout');
}, 0);

new Promise((resolve, reject)=>{
    console.log('promise')
    resolve()
}).then(function () {
    console.log('promise1');
}).then(function () {
    console.log('promise2');
});

console.log('script end');
```
执行步骤为
* 第一次执行，
    * 执行同步代码，将宏任务（Tasks）和微任务(Microtasks)划分到各自队列中。
    * 宏任务包括setTimeout callback，微任务包括promise1.then
    * 输出script start、promise、script end
* 第二次执行，
    * 此时宏任务包括setTimeout callback，微任务(Microtasks)队列中不为空，先执行微任务队列Promise1，
    * 执行完成Promise1后，调用Promise2.then，放入微任务(Microtasks)队列中，再执行Promise2.then。
    * 输出promise1、promise2
* 第三次执行，
    * 当微任务(Microtasks)队列中为空时，执行宏任务（Tasks）队列，执行setTimeout callback。
    * 输出setTimeout

所以输出结果依次为script start、promise、script end、promise1、promise2、setTimeout


再来看个包含async的例子
```
console.log('script start')
async function async1() {
  await async2()
  console.log('async1 end')
}

async function async2() {
  console.log('async2 end')
}

async1()

setTimeout(function() {
  console.log('setTimeout')
}, 0)

new Promise(resolve => {
  console.log('Promise')
  resolve()
}).then(function() {
  console.log('promise1')
}).then(function() {
  console.log('promise2')
})

console.log('script end')
```
代码依次输出script start、async2 end、Promise、script end、async1 end、promise1、promise2、setTimeout

把await理解成
```
async function f() {
  await p
  console.log('ok')
}
```
```
function f() {
  return RESOLVE(p).then(() => {
    console.log('ok')
  })
}
```
这样就比较容易理解了

## Node 中的 Event Loop
node中的任务也分为宏任务和微任务等
* 宏任务包括：setTimeout、setInterval、 setImmediate、script（整体代码）、 I/O 操作等。
* 微任务包括：process.nextTick、new Promise().then(回调)等

Node的Event loop一共分为6个阶段，每个细节具体如下：
* **timers**: 执行setTimeout和setInterval中到期的callback。
* pending callback: 上一轮循环中少数的callback会放在这一阶段执行。
* idle, prepare: 仅在内部使用。
* **poll**: 最重要的阶段，执行pending callback，在适当的情况下会阻塞在这个阶段。
* **check**: 执行setImmediate(setImmediate()是将事件插入到事件队列尾部，主线程和事件队列的函数执行完成之后立即执行setImmediate指定的回调函数)的callback。
* close callbacks: 执行close事件的callback，例如socket.on('close'[,fn])或者http.server.on('close, fn)。

node中的事件循环模型它们会按照上面顺序反复运行。每当进入某一个阶段的时候，都会从对应的回调队列中取出函数去执行。当队列为空或者执行的回调函数数量到达系统设定的阈值，就会进入下一阶段。

```
console.log('start')
setTimeout(() => {
  console.log('timer1')
  Promise.resolve().then(function() {
    console.log('promise1')
  })
}, 0)
setTimeout(() => {
  console.log('timer2')
  Promise.resolve().then(function() {
    console.log('promise2')
  })
}, 0)
Promise.resolve().then(function() {
  console.log('promise3')
})
console.log('end')
```
在node v11版本之前，上面依次输出start、end、promise3、timer1、timer2、promise1、promise2
在浏览器中，上面依次输出start、end、promise3、timer1、promise1、timer2、promise2

这个是因为在node中，当timer阶段执行完一个宏任务之后，并不会立即执行微任务队列，而是继续执行已到期的定时器任务，直到timer阶段完毕（与浏览器的差别较大）

浏览器环境下，microtask的任务队列是每个macrotask执行完之后执行。而在Node.js中，microtask会在事件循环的各个阶段之间执行，也就是一个阶段执行完毕，就会去执行microtask队列的任务。

但是在node v11版本之后，上面node环境输出与浏览器保持一致，参考https://juejin.im/post/5c3e8d90f265da614274218a，这是因为在timer中增加了执行完一个定时器宏任务之后，就调用`process._tickCallback()`清空微任务队列导致的，其目的大概是为了与浏览器保持一致。

**注意setTimeout 和 setImmediate**

* setImmediate 设计在poll阶段完成时执行，即check阶段；
* setTimeout 设计在poll阶段为空闲时，且设定时间到达后执行，但它在timer阶段执行

```
setTimeout(function timeout () {
  console.log('timeout');
},0);
setImmediate(function immediate () {
  console.log('immediate');
});
```
下面这一段代码反复执行，可能输出timeout、immediate的顺序，也可能输出immediate、timeout的顺序，原因在于：进入事件循环也是需要成本的，如果准备时间过长，在 timer 阶段就会直接执行 setTimeout 回调，否则，先在check阶段执行了setImmediate回调，然后在下一个timer阶段执行setTimeout

**process.nextTick**
process.nextTick有一个自己的队列，当每个阶段完成后，如果存在 nextTick 队列，就会清空队列中的所有回调函数，并且优先于其他 microtask 执行
