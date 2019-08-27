

## 基本使用
了解一款常见的网络框架原理`axios`，通过**适配器模式**，在浏览器封装`xhr`，在node封装`http`模块，上层的调用保持一致。

需要掌握
* 请求拦截器和响应拦截器的实现
* 基于axios进行二次封装，实现业务特定需求
* 并发限制
* 用户鉴权认证、JWT

## 拦截器

构造函数

```js
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}
```

然后来看看`InterceptorManager`这个拦截器管理类

```js
function InterceptorManager() {
  this.handlers = [];
}
// 添加拦截器
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};
// 取消拦截器
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};
// 遍历拦截器
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};
```

核心方法`Axios.prototype.request `

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

理解拦截器也十分容易了

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

interceptors.request.forEach(function unshiftRequestInterceptors(
     interceptor
 ) {
     chain.unshift(interceptor.fulfilled, interceptor.rejected);
 });

interceptors.response.forEach(function pushResponseInterceptors(
     interceptor
 ) {
     chain.push(interceptor.fulfilled, interceptor.rejected);
 });

while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
}

promise.then(res=>{
    console.log(res)
})
```

## 取消请求

需要了解`cancelable promises proposal`，目前该提案已被取消，Promise是不能被取消的，那么axios是如何实现取消请求的呢？

查看[文档示例](https://www.kancloud.cn/yunye/axios/234845)，可以使用下面两种方式取消

```js
var CancelToken = axios.CancelToken;
var source = CancelToken.source();

axios.get('/user/12345', {
  cancelToken: source.token
}).catch(function(thrown) {
  if (axios.isCancel(thrown)) {
    console.log('Request canceled', thrown.message);
  } else {
    // 处理错误
  }
});

// 取消请求（message 参数是可选的）
// 使用同一个 cancel token 取消多个请求
source.cancel('Operation canceled by the user.');
```

也可以使用下面方式

```js
var CancelToken = axios.CancelToken;
var cancel;

axios.get('/user/12345', {
  cancelToken: new CancelToken(function executor(c) {
    // executor 函数接收一个 cancel 函数作为参数
    cancel = c;
  })
});

// 取消请求
cancel();
```



查看`CancelToken`源码

```js
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }
		// 设置reason
    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};
```

可见看见，如果调用了传入`executor`的`cancel`方法，在后续的`dispatchRequest`中会判断是否存在`reason`来决定是否取消本次请求。

查看发送请求的源码`dispatchRequest`

```js
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}
function dispatchRequest(config) {
  // 判断是否cancelToken是否已经执行了cancel方法，如果已执行，则抛出异常终止后续的promise
  throwIfCancellationRequested(config);
  // ...网路请求逻辑
  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);
    // ...
  },function(){
    throwIfCancellationRequested(config);
    // ...
  })
}
```

