webview
===

参考
* [移动端开发之JSBridge](https://juejin.im/post/5cc5adde6fb9a031f4160969)
* [Hybrid APP开发：JSSDK](http://ju.outofmemory.cn/entry/360590)


## 通信

### JS调用客户端方法

**客户端API注入**

API注入的原理： Native 获取 JavaScript环境上下文，并直接在上面挂载对象或者方法，使 js 可以直接调用。

Android 与 IOS 分别拥有对应的挂载方式，参考之前整理的客户端文章
* [iOS基础之webview](https://www.shymean.com/article/iOS%E5%9F%BA%E7%A1%80%E4%B9%8Bwebview)
* [安卓入门之WebView](https://www.shymean.com/article/%E5%AE%89%E5%8D%93%E5%85%A5%E9%97%A8%E4%B9%8BWebView)

**网络拦截**

WebView作为承载H5页面的容器，有一个特性是非常重要，即 它可以捕捉到所有在容器中发起的网络请求。其实想要 JS唤起Native 的方法，只要建立起 JS与Native通信 的桥梁即可，而这一点正好被WebView的这一特性所实现。

在网页中可以通过 **发起网络请求来向Native端传递消息**，一般通过`iframe.src`发起网络请求，Native端在捕捉到约定协议头（Schema）的请求时，会进行解析然后调用对应的方法，同时可以在url上携带一些参数。

### 客户端调用JS方法

考虑以下场景
* 在唤起Native方法后，往往还需要执行一些回调，（如客户端需要把数据通过回调函数的形式通知JS）
* JS需要暴露一些接口给客户端，并在合适的时机调用（如点击返回上一页按钮时）

可以将回调方法挂载在约定的全局变量上，之后客户端调用JavaScript全局变量上的回调方法就可以了。

android
```java
webview.loadUrl("javascript:alert('Hello from ios');"); // 可以调用JavaScript的全局对象
```

iOS
```c
[webView evaluateJavaScript:@"document.body.style.backgroundColor = 'blue'" completionHandler:^(id result, NSError *error) {
    NSLog(@"Result %@", result);
}];
```

## JSSDK
一般会将上面JavaScript与客户端的通信进行封装，主要为了
* 抹平JSBridge的平台实现差异
* 对齐端能力，内部消化版本差异
* sdk封装后的代码更加符合前端习惯
* 权限控制、鉴权、对外开放，实现生态建设

## 其他问题

### 判断环境

我们可能需要判断当前页面运行在哪个平台或者是浏览器下，可以通过`user-agent`进行判断判断

### iOS中 WKWebView 和 UIWebview

参考：
* [WKWebView和UIWebView对比](https://www.jianshu.com/p/79e329ff8953)
