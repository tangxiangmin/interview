Fetch
===
> 了解fetch吗？fetch 如何解决跨域问题？如何取消 fetch 请求？能否监听 fetch 的上传进度?

### 基本使用
参考：[Fetch-MDN文档](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API/Using_Fetch)

Fetch 的核心在于对 HTTP 接口的抽象，包括 Request，Response，Headers，Body，

```js
var url = "/index.php"
fetch(url, {
    method: "POST",
    body: JSON.stringify({code:'1'}).
}).then(res=>{
    return res.text()
}).then(res=>{
    console.log(res)
})
```
只有POST方式可以配置body参数

### fetch中解决跨域
与ajax相同，可以通过CORS解决fetch的跨域问题，服务器通过`Access-Control-Allow-Origin`响应头来允许指定的源进行跨域。

除此之外，fetch还可以通过`mode`配置项，设置请求的模式，
* same-origin，该模式不允许跨域的，发送的请求需要遵守同源策略
* cors，该模式支持跨域请求，顾名思义它是以CORS的形式跨域；当然该模式也支持同域请求
* no-cors，该模式用于跨域请求但是服务器不带CORS响应头，其作用是运行浏览器发送此次请求，但无法访问响应的内容，与img标签类似

### 使用fetch常见的一些问题
参考: [fetch使用的常见问题及解决办法](http://www.cnblogs.com/wonyun/p/fetch_polyfill_timeout_jsonp_cookie_progress.html)

**兼容性**

fetch本身存在浏览器兼容性的问题，此外由于fetch依赖Promise，而promise本身也存在兼容性问题。

一种常规的fetch-polyfill的思路是：首先判断浏览器是否原生支持fetch，否则结合Promise使用XMLHttpRequest的方式来实现。

**cookie**

fetch可以手动控制是否需要在请求中携带cookie，手动配置`credentials`，其取值有
* omit: ~~默认值~~，忽略cookie的发送
* same-origin: 表示cookie只能同域发送，不能跨域发送
* include: cookie既可以同域发送，也可以跨域发送

测试发现在Chrome72中credentials的默认值貌似已经调整为`same-origin`

**响应错误的处理**

fetch返回的是一个Promise，其抛出reject的机制为：在某些错误的http状态下如400、500等不会reject，相反它会被resolve；只有网络错误会导致请求不能完成时，fetch 才会被 reject；因此需要在resolve做一层判断
```js
fetch(url).then(function(response) {
  if(response.ok) {
    return response.json();
  }
  throw new Error('Network response was not ok.');
}).catch(function(error) {
  console.log(error.message);
});
```

**不支持timeout和abort**

fetch并没有提供请求超时时间的配置项，不过可以通过下面思路实现fetch的timeout功能
```js
var oldFetchfn = window.fetch
window.fetch = function(url, opts) {
    return new Promise((resolve, reject) =>{
        // 超过timeout时间仍未响应，则抛出超时的错误
        var timeoutTimer = setTimeout(() => {
            reject(new Error("fetch timeout"));
        }, opts.timeout);

        oldFetchfn(url, opts).then(
            res => {
                clearTimeout(timeoutTimer);
                resolve(res);
            },
            err => {
                clearTimeout(timeoutTimer);
                reject(err);
            }
        );
    });
};
```

另外，根据Promise指导规范标准，promise实例是不能abort的，这表示在通过fetch发送请求之后，无法中断请求，根据上面的思路，我们可以手动实现abort
```js
var oldFetchfn = fetch;
window.fetch = function (input, opts) {
    return new Promise(function (resolve, reject) {
        var p = oldFetchfn(input, opts).then(resolve, reject);
        
        p.abort = function () {
            reject(new Error("fetch abort"))
        };
        return p;
    })
}
```

尽管上面实现了类似于timeout和abort的功能，但需要注意
* 这里实现的timeout并不是“请求连接超时”的配置项，而包含了请求连接、服务器处理、响应回来直至改变promise状态的这一整段时间
* 这里实现的abort功能，只是忽略了这次请求的响应，因为即使调用abort，实际上本次请求也不会被abort掉，仍旧会发送到服务端

**不支持jsonp**

jsonp只是一种实现跨域的方法，而不是xhr和fetch这样的协议。fetch不支持jsonp是理所应当的。

**不支持监听进度**

在xhr中，可以通过下面方式获取进度
```js
xhr.upload.onprogress = ()=>{}; //上传的progress事件
xhr.onprogress = ()=>{}; //下载的progress事件
```
在fetch并，并没有提供相关的事件，因此**fetch是不支持progress的**；不过在fetch中，`response.body`是一个可读字节流对象，因此可以用来模拟progresss，详情可参考[2016 - the year of web streams](https://jakearchibald.com/2016/streams-ftw/)
```js
fetch(url).then(response => {
  var reader = response.body.getReader();
  var bytesReceived = 0;

  reader.read().then(function processResult(result) {
    if (result.done) {
      console.log("Fetch complete");
      return;
    }

    bytesReceived += result.value.length;
    console.log('Received', bytesReceived, 'bytes of data so far');

    return reader.read().then(processResult);
  });
});

```