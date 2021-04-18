NodeJS
===

> NodeJS中的event loop和浏览器有什么区别？NodeJS作为服务有哪些优势？nginx反向代理？Koa的原理和中间件的实现？

参考：
* [NodeJS面试题](https://github.com/jimuyouyou/node-interview-questions)
* [如何通过饿了么 Node.js 面试](https://elemefe.github.io/node-interview/#/sections/zh-cn/)，[部分解答](https://www.jianshu.com/p/5fe87b14340e?utm_campaign=maleskine&utm_content=note&utm_medium=seo_notes&utm_source=recommendation)

## NodeJS优缺点及应用场景
优点
* 基于事件模型，节省了为每一个请求建立连接的服务端资源，可以支持高并发
* 通过异步和回调实现非阻塞IO，在IO密集应用下很有用

缺点
* 不适合CPU密集型应用，长时间的计算会阻塞JavaScript执行异步任务
* 默认只支持单核

## node核心内置类库
主要需要了解事件，流，文件，网络等模块的使用

### EventEmitter
参考：[Class: EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter)

`EventEmitter`提供了`on`、`once`、`emit`、`off`等方法，用于实现观察者模式，其主要功能是监听和发射消息，方便多个模块之间的通信

```js
const EventEmitter = require("events");
const myEmitter = new EventEmitter();

// newListener是一个内部保留事件，当调用on方法添加事件处理函数时将触发该事件
// 可以用来做事件机制的反射，特殊应用，事件管理
myEmitter.once('newListener', (event, listener) => {
  if (event === 'event') {
    // Insert a new listener in front
    myEmitter.on('event', () => {
      console.log('B');
    });
  }
});
myEmitter.on('event', () => {
  console.log('A');
});
myEmitter.emit('event');
// Prints:
//   B
//   A
```

此外需要注意的是：NodeJS监听事件时的错误处理风格一般是将err放事件处理函数的第一个参数，如
```js
fs.stat('/tmp/world', (err, stats) => {
    // 如果有错误则抛出异常
    if (err) throw err;
    // 没有错误则执行正常逻辑
    console.log(`文件属性: ${JSON.stringify(stats)}`);
  });
```

### Stream
参考: [Stream API](http://nodejs.cn/api/stream.html)

Node.js 提供了多种流对象，流可以是可读的、可写的、或者可读可写的，`Stream`是 Node.js 中处理流式数据的抽象接口。

流的开发者可以声明一个新的 JavaScript 类并继承四个基本流类中之一（stream.Writeable、 stream.Readable、 stream.Duplex 或 stream.Transform），且确保调用了对应的父类构造器。

不同类型的流需要实现不同的方法，具体可以参考：[用于实现流的 API](http://nodejs.cn/api/stream.html#stream_api_for_stream_implementers)
```js
const { Writable } = require('stream');

class MyWritable extends Writable {
  constructor(options) {
    super(options);
    // ...
  }
  _write(){}
  _writev(){} 
  _final(){}

}
```

### 文件系统
参考:[fs API](http://nodejs.cn/api/fs.html)

`fs`模块提供了一个 API，用于以模仿标准 [POSIX](https://zh.wikipedia.org/wiki/%E5%8F%AF%E7%A7%BB%E6%A4%8D%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E6%8E%A5%E5%8F%A3) 函数的方式与文件系统进行交互。

操作文件一般有下面几种方式
* [fs.open](http://nodejs.cn/api/fs.html#fs_file_descriptors) 方法，分配新的文件描述符。 一旦被分配，则文件描述符可用于从文件读取数据、向文件写入数据、或请求关于文件的信息。
* 通过流来操作文件，如[fs.createReadStream](http://nodejs.cn/api/fs.html#fs_fs_createreadstream_path_options)用于从文件从文件中读取一定范围的字节而不是读取整个文件;[fs.createWriteStream](http://nodejs.cn/api/fs.html#fs_fs_createwritestream_path_options)用于在文件开头之后的某个位置写入数据
* 通过fs模块提供的同步或异步方法操作文件，如`fs.readFile`和`fs.readFileSync`，其中带`Sync`后缀的接口表示同步操作

### 网络
参考
* [Node.js之网络通讯模块浅析](https://segmentfault.com/a/1190000008908077)
* [一次 HTTP 传输解析](https://nodejs.org/zh-cn/docs/guides/anatomy-of-an-http-transaction/)

在Node.js的模块里面，与网络相关的模块有Net、DNS、HTTP、TLS/SSL、HTTPS、UDP/Datagram等，我们常用的应该是`http`模块。

```js
const http = require('http');
http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('hello world');
    res.end();
}).listen(3000); //绑定当前服务到3000端口
```

### child-process
参考：
* [child_process API](http://nodejs.cn/api/child_process.html)
* [Nodejs进阶：如何玩转子进程（child_process）](https://www.cnblogs.com/chyingp/p/node-learning-guide-child_process.html)

`child_process` 模块提供了衍生子进程的能力，子进程的运行结果储存在系统缓存之中（最大200KB），等到子进程运行结束以后，主进程再用回调函数读取子进程的运行结果。

## NodeJS事件循环机制
参考：
* [event-loop-timers-and-nexttick](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/)
* [eventloop](./eventLoop.md)


在NodeJS中，事件循环可以分为几个阶段`timer`、`pending callbacks`、`poll`等阶段，在每个阶段完成之后，才会清空微任务队列，然后执行下一个阶段的任务。

在`v11`以后的版本中，为了与浏览器的事件循环保持一致，调整为每完成一个宏任务之后，就调用`process._tickCallback()`清空微任务队列。


## 编写原生C++模块

参考：[写一个N-API没那么难](https://juejin.im/post/5de484bef265da05ef59feb5)


## Web开发
> 什么是Restful API ? koa和express有什么区别？中间件的作用是什么，能大概实现一下吗？你用过哪些模板引擎，他们有什么优劣？

### Restful API
* Restful的意思就是表现层状态转化。
* "表现层"其实指的是"资源"（Resources）的"表现层"，把"资源"具体呈现出来的形式，叫做它的"表现层"（Representation）。
* 所谓"资源"，就是网络上的一个实体，或者说是网络上的一个具体信息。它可以是一段文本、一张图片、一首歌曲、一种服务，总之就是一个具体的实在，每一个URI代表一种资源。
* 果客户端想要操作服务器，必须通过某种手段，让服务器端发生"状态转化"（State Transfer）。而这种转化是建立在表现层之上的，所以就是"表现层状态转化"。
* Restful就是客户端和服务器之间，传递这种资源的某种表现层
* 客户端通过四个HTTP动词，对服务器端资源进行操作，实现"表现层状态转化"
* Restful API就是符合Restful架构的API设计。

### 中间件
`app.use`中间件的原理是什么，我写了一个[简单的实现](https://github.com/tangxiangmin/JSMagic/tree/master/Middleware)
其原理就是维护一个中间件队列，每个中间件接收下一个中间件`next`作为参数，并手动调用

### express

### Koa
* [Koa中间件的原理](https://www.shymean.com/article/koa%E4%B8%AD%E9%97%B4%E4%BB%B6%E5%AF%BC%E8%87%B4%E6%8E%A5%E5%8F%A3404%E7%9A%84%E9%97%AE%E9%A2%98)

### 模板引擎
参考
* [实现一个简易的JS模板引擎](https://www.shymean.com/article/%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AA%E7%AE%80%E6%98%93%E7%9A%84JS%E6%A8%A1%E6%9D%BF%E5%BC%95%E6%93%8E)
