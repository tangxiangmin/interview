webview
===

参考
* [移动端开发之JSBridge](https://juejin.im/post/5cc5adde6fb9a031f4160969)

WebView作为承载H5页面的容器，有一个特性是非常重要，即 它可以捕捉到所有在容器中发起的网络请求。其实想要 JS唤起Native 的方法，只要建立起 JS与Native通信 的桥梁即可，而这一点正好被WebView的这一特性所实现。

## Android
在webview中原生与JS的交互，是通过注入一个全局对象来实现的


