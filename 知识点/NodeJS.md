NodeJS
===

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
