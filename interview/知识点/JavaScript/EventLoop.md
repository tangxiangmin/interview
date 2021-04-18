EventLoop
===

之前整理了一部分：[理解EventLoop](https://www.shymean.com/article/%E7%90%86%E8%A7%A3EventLoop)
## 为什么要区分宏任务微任务？

从浏览器角度看，宏任务是一个个离散的，独立的工作单元。

微任务是更小的任务，微任务更新应用程序的状态，但是必须在浏览器任务继续执行其他任务之前执行，浏览器任务包括重新渲染页面的UI，因此微任务需要尽可能快地、通过异步方式执行

基于上述原因，将异步任务划分为了宏任务和微任务。

## Promise
参考
* [使用 Promise MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Using_promises)


> Promise.race和Promise.all的区别和应用场景？

* `Promise.all`会在所有任务都结束后才进行reslove，因此可以将多个异步结果合并到一起
* `Promise.race`只要当任何任务完成后就进行reslove，常见的用法是：将定时器和网络请求放在race中，用来网络请求是否超时

使用注意事项
* 为了避免意外，then中的回调都是异步执行的（放在微任务队列中）

错误处理，
```
// catch实际上是下面代码的简写
then(null, (e)=>{
    console.log('brefore catch')
})
```
当promise链中抛出某个error时，将跳过后面的then并找到第一个catch进行处理

## Generator 和yield

next可以传递参数，会将参数作为上一条yield语句的返回值，在下面的代码中可以看见通过next改变generator函数中yield的返回值
```js
function *createIterator() {
    let first = yield 1;
    let second = yield first + 2; // 4 + 2 
                                  // first =4 是next(4)将参数赋给上一条的
	yield second + 3;             // 5 + 3
	console.log(first, second) // 4, 5
}

let iterator = createIterator();

console.log(iterator.next());    // "{ value: 1, done: false }"
console.log(iterator.next(4));   // "{ value: 6, done: false }"
console.log(iterator.next(5));   // "{ value: 8, done: false }"
console.log(iterator.next());    // "{ value: undefined, done: true }"
```
下面代码展示了使用generator函数封装异步任务的方法
```js
// 1. 首先写一个异步任务,在一秒后返回特定字符串
function asyncTask(callback){
    setTimeout(()=>{
        callback('Hello Leo')
    }, 100)
}

// 2. 接下来写出期望执行的顺序
function* runTask() {
    let text = yield asyncTask
    console.log(text) // 我们期望这里正常输出Hello Leo
}
// 3. 按照期望值执行函数
const gen = runTask()// 此时执行权已经交出
gen.next().value(function (text) {// 执行asyncTask并传入callback ，关键点在于在callback里调用next交还执行权
    console.log('next.value')
    gen.next(text) // 将结果赋值给上一条yield语句`yield asyncTask`的左侧
}) 
// 注意这里不能直接调用后续的next，否则会导致上面注册回调中的gen.next无法正常获取参数
// gen.next()
```
除了编写generator函数之外，我们还需要手动调用next方法，因此在一个使用generator封装的任务中，我们需要将手动调用next的逻辑封装到一个运行器里面，
```js
function isFunction(source) {
    return Object.prototype.toString.call(source) === "[object Function]"
}

function autoExecute(task) {
    const gen = task()
    let result = gen.next()
    let isRuningAsync = false // 由于加入了异步处理，所以要增加一个标志位避免重复进入循环体
    loop()
    function loop(){
        while (!isRuningAsync) {
            if (result.done) {
                return
            }
            console.log(result.value)
    
            /* start 补充的处理函数 */
            if (isFunction(result.value)) {
                isRuningAsync = true
                const callback = (arg) => {
                    result = gen.next(arg) // 核心代码
                    isRuningAsync = false
                    loop()
                }
                result.value(callback)
                /* end 补充的处理函数 */
            } else {
                result = gen.next(result.value)
            }
        }
    }
   
}
autoExecute(test) // 试着用这个自动执行器执行之前的异步任务

```

## async/await

> 阅读过async/await代码通过webpack打包后的代码吗

源代码
```js
async function test(){
    let result = await 1;
    console.log(result)
}
test()
```
webpack打包后的代码
```js
function test() {
    var result;
    return regeneratorRuntime.async(function test$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                _context.next = 2;
                return regeneratorRuntime.awrap(1);

                case 2:
                result = _context.sent;
                console.log(result);

                case 4:
                case "end":
                return _context.stop();
            }
        }
    });
}

test();
```