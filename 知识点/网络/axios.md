axios
===

了解一款常见的网络框架原理

* 请求拦截器和响应拦截器的实现
* 参数封装
* 并发限制
* 用户鉴权认证、JWT


## 拦截器是如何实现的
下面是axios中拦截器的基本运行流程，可以运行下面代码查看拦截器的运行流程

```js
// 原始的接口
function dispatchRequest(config){
    let res = {
        params: config,
        code: 200,
        data: "hello response",
    }
    // 省略实际接口请求逻辑
    return Promise.resolve(res);
}
var chain = [dispatchRequest, undefined];

// 请求配置
var config = {
    headers: {
        'x-token': 'xxxx12token'
    },
    params: {
        id: 1
    }
};
var promise = Promise.resolve(config);

var interceptors = {
    request: [
        {
            fulfilled(config) {
                console.log(config);
                return config;
            },
            rejected() {
                console.log("request reject");
            }
        }
    ],
    response: [
        {
            fulfilled(res) {
                console.log(res)
            },
            rejected() {
                console.log("response reject");
            }
        }
    ]
};
// 请求拦截器在dispatchRequest请求前触发
interceptors.request.forEach(function unshiftRequestInterceptors(
     interceptor
 ) {
     chain.unshift(interceptor.fulfilled, interceptor.rejected);
 });

// 响应拦截器在dispatchRequest请求后触发
interceptors.response.forEach(function pushResponseInterceptors(
     interceptor
 ) {
     chain.push(interceptor.fulfilled, interceptor.rejected);
 });

while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
}

// request方法返回的promise对象暴露给业务方使用
promise.then(res=>{
    console.log(res)
})
```

可见拦截器的实现方式是利用队列与Promise.then链式调用实现的，下面是`Axios.prototype.request`源码实现
```js
Axios.prototype.request = function request(config) {
	// ...初始化配置
  
	// 构建任务链
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);
	// 注册请求拦截器
  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });
	// 注册响应拦截器
  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};
```