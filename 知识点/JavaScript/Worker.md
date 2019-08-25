
## Web Worder
参考
* [Web Worker MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API)
* [Web Worker 使用教程](http://www.ruanyifeng.com/blog/2018/07/web-worker.html)

JavaScript 语言采用的是单线程模型。Web Worker 的作用，就是为 JavaScript 创造多线程环境，允许主线程创建 Worker 线程，将一些任务分配给后者运行，这样做的好处是可以在独立线程中执行费时的处理任务，从而允许主线程（通常是UI线程）不会因此被阻塞/放慢。

在主线程中
```js
// 创建worker
var worker = new Worker('work.js');
// 向worker发送消息
worker.postMessage('Hello World');
// 注意传输的数据是值的拷贝，worker无法修改主线程中的变量
worker.postMessage({method: 'echo', args: ['Work']});

// 主线程通过事件，接收子线程发回来的消息
worker.onmessage = function (event) {
  console.log('Received message ' + event.data);
  doSomething();
}
// 监听worker的错误
worker.onerror(function (event) {});


// 主线程关闭worker
worker.terminate();
```

在worker中，通过`self`代表子线程自身，即子线程的全局对象
```js
// 监听message事件，接收主线程发送的消息
self.addEventListener('message', function (e) {
  // 通过postMessage向主线程发送消息
  self.postMessage('You said: ' + e.data);
}, false);

// 主动关闭
self.close();
```

## Service Worker

参考：
* [Service Worker API](https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API)
* [Service Worker：简介](https://developers.google.com/web/fundamentals/primers/service-workers/)

可以用来作为web应用程序、浏览器和网络（如果可用）之间的代理服务，常见的如控制缓存等

