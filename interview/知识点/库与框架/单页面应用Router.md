
## 基本原理
参考：
* [详解vue 单页应用（spa）前端路由实现原理](https://blog.csdn.net/qq_34629352/article/details/79837815#123)

hash Router 和 history Router的区别

* hash优点
    * 兼容性比较好，兼容性达到了ie8
    * 除了会发送ajax和资源加载之外不会发送其他请求
    * 不需要在服务端进行任何设置和开发
* hash缺点
    * 服务端无法准确捕获路由的信息
    * 对于需要锚点功能的需求会与当前路由机制发生冲突
    * 对于需要重定向的操作，后段无法获取url全部内容，导致后台无法得到url数据，典型的例子就是微信公众号的oauth验证。
* browser优点
    * 当发生路由重定向时不会丢失url数据 ，后端也可以拿到这个数据
    * 后端可以准确追踪到路由
    * 可以使用history.state获取路由的信息
* browser缺点
    * 兼容性不如hash 。兼容性只到ie10
    * 需要后端额外配置配置

## Vue-router
路由指根据不同的 url 地址展示不同的内容或页面。
在浏览器端可以通过hash或者history API实现

* keep-alive
* 滚动位置还原

### 路由懒加载

参考
* [官方文档](https://router.vuejs.org/zh-cn/advanced/lazy-loading.html)
* [Vue代码分割懒加载](https://segmentfault.com/a/1190000012038580)
* [Vue2组件懒加载浅析](https://www.cnblogs.com/zhanyishu/p/6587571.html)

## React-Router

根据匹配的url渲染子节点


## 单页面应用SSR原理
参考
* [Vue SSR指南](https://ssr.vuejs.org/zh/#%E4%BB%80%E4%B9%88%E6%98%AF%E6%9C%8D%E5%8A%A1%E5%99%A8%E7%AB%AF%E6%B8%B2%E6%9F%93-ssr-%EF%BC%9F)

以[nuxt.js](https://zh.nuxtjs.org/)为例，客户端请求服务器，服务器根据请求地址获得匹配的组件，在调用匹配到的组件返回 Promise (官方是preFetch方法)来将需要的数据拿到。最后再通过
```html
<script>window.__initial_state=data</script>
```
将其写入网页，最后将服务端渲染好的网页返回回去。

接下来客户端会将vuex将写入的 initial_state 替换为当前的全局状态树，再用这个状态树去检查服务端渲染好的数据有没有问题。遇到没被服务端渲染的组件，再去发异步请求拿数据。
