# 前端 Mock

## 常见的 mock 开发方案

在前后端分离的项目中，前端一般会先模仿后台数据接口字段，生成模拟测试数据。

### 直接在业务代码里面硬编码

返回数据，对代码侵入性很强，需要记得在测试完毕后移除 mock 数据，下次 mock 时又要重新硬编码

```js
export function fetchUserInfo() {
    // return http.get('/user/inof')
    return Promise.resolve({
        code: 200,
        data: {},
        msg: "SUCCESS",
    });
}
```

### 在前端拦截网络请求


在前端拦截网络请求，常见的做法是代理 xhr 或者 fetch，如`mockjs`，之前的整理：[mockjs使用心得](http://www.shymean.com/article/mockjs%E4%BD%BF%E7%94%A8%E5%BF%83%E5%BE%97)
-   根据后台接口字段，`Mock.mock(url, tpl)`拦截响应请求，返回模拟数据
-   将所有的 mock 至于一个单独的`_mock`模块中，根据环境参数，在开发环境引入

```js
// _mock.js
Mock.mock(/\/api\/taskStatus/, "get", {
    code: 0,
    msg: null,
    data: {
        userId: 1,
    },
});
// ... 其他的mock接口，如果项目过大可以拆分成多个文件，然后统一引入入口文件


// 然后判断环境变量，在开发环境引入，不影响线上环境
if (process.env.NODE_ENV === 'development') {
  require('./_mock')
}
```

这种方式的缺点在于
-   不能在调试面板看见真实的请求，
-   仅适用于前端，如小程序、app 等无 xhr 的场景下就不使用了
-   对 xhr 的改写，在某些特殊业务场景下也存在一些问题

### 网络代理拦截

通过代理软件 charles、fiddler 的 mock remote、mock local 等功能进行拦截，比较真实，可以满足大部分模拟请求，甚至可以拦截线上项目的请求；缺点在于操作繁琐，也不方便统一管理 mock 模板

### mock server

启动 mock server，将需要 mock 的请求重定向到这个服务器，不需要侵入代码，操作也很方便

比较流行的是[easy mock](https://github.com/easy-mock/easy-mock)，可以进行本地安装

依赖 mongodb、redis，node 版本需要 v8，本地使用的 v8.10.0

clone 仓库后，依次启动本地的 mongodb、redis，然后 npm run dev 即可启动本地服务。
