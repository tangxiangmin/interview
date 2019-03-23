NodeJS
===

## 开启服务器
```js
// 引入内置http模块
var http = require('http');

http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World\n');
}).listen(9999, '127.0.0.1');
```


## 模块
[JavaScript模块管理机制](http://www.shymean.com/article/JavaScript%E6%A8%A1%E5%9D%97%E7%AE%A1%E7%90%86%E6%9C%BA%E5%88%B6)

### CommonJS 中的 require/exports 和 ES6 中的 import/export 区别？
* ES6中的模块规范还没有被很好的支持，babel等的实现也是通过将其打包为CommonJ规范等实现的
* CommonJS允许动态require导入模块，
* import是在编译的时候去做解析请求包，只能出现在代码顶层，模块名只能是字符串字面量
* import可以按需引入模块的一部分，对`tree shaking`更有利~


## Express
### 中间件
`app.use`中间件的原理是什么，我写了一个[简单的实现](https://github.com/tangxiangmin/JSMagic/tree/master/Middleware)
其原理就是维护一个中间件队列，每个中间件接收下一个中间件`next`作为参数，并手动调用

## Koa
### async和await

async函数本身返回一个promise
```
async function testAsync(){
	return "hello";
}

const result = testAsync();

// console.log(result); // Promise { hello }
result.then(res=>{
	console.log(res)
})
```

[await](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/await)后跟一个表达式。await可以阻塞当前async函数中的代码，并等待其后面的表达式执行完成。然后取消阻塞并继续执行后续代码。

```
function timer(){
	return new Promise((res, rej)=>{
		setTimeout(()=>{
			res("hello");
		}, 500)
	})
}

async function getTimer(){
	let data = await timer(); // 阻塞 500ms
	console.log(data);
}

getTimer();
```

## Restful API
* Restful的意思就是表现层状态转化。
* "表现层"其实指的是"资源"（Resources）的"表现层"，把"资源"具体呈现出来的形式，叫做它的"表现层"（Representation）。
* 所谓"资源"，就是网络上的一个实体，或者说是网络上的一个具体信息。它可以是一段文本、一张图片、一首歌曲、一种服务，总之就是一个具体的实在，每一个URI代表一种资源。
* 果客户端想要操作服务器，必须通过某种手段，让服务器端发生"状态转化"（State Transfer）。而这种转化是建立在表现层之上的，所以就是"表现层状态转化"。
* Restful就是客户端和服务器之间，传递这种资源的某种表现层
* 客户端通过四个HTTP动词，对服务器端资源进行操作，实现"表现层状态转化"
* Restful API就是符合Restful架构的API设计。