webview
===

参考
* [移动端开发之JSBridge](https://juejin.im/post/5cc5adde6fb9a031f4160969)
* [Hybrid APP开发：JSSDK](http://ju.outofmemory.cn/entry/360590)
* [iOS基础之webview](https://www.shymean.com/article/iOS%E5%9F%BA%E7%A1%80%E4%B9%8Bwebview)
* [安卓入门之WebView](https://www.shymean.com/article/%E5%AE%89%E5%8D%93%E5%85%A5%E9%97%A8%E4%B9%8BWebView)

WebView作为承载H5页面的容器，有一个特性是非常重要，即 它可以捕捉到所有在容器中发起的网络请求。其实想要 JS唤起Native 的方法，只要建立起 JS与Native通信 的桥梁即可，而这一点正好被WebView的这一特性所实现。

## 判断环境
在浏览器中可以通过`user-agent`来判断当前运行在何种环境下

## 通信

**调用客户端方法**

在网页中可以通过 **发起网络请求来向Native端传递消息**，一般通过`iframe.src`发起网络请求，Native端在捕捉到这种协议头的请求时，会进行解析然后调用对应的方法。

**客户端处理回调**

在唤起Native方法后，往往还需要执行一些回调，由于客户端无法直接执行JS代码，但可以获取WebView中的 全局变量，因此可以将回调方法挂载在全局变量上，之后客户端调用全局变量上的回调方法就可以了。

## JSSDK

* 抹平JSBridge的平台实现差异
* 对齐端能力，内部消化版本差异
* sdk封装后的代码更加符合前端习惯
* 权限控制、鉴权、对外开放，实现生态建设

## iOS中 WKWebView 和 UIWebview
参考：
* [WKWebView和UIWebView对比](https://www.jianshu.com/p/79e329ff8953)
