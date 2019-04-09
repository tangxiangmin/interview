NodeJS
===

> NodeJS中的event loop和浏览器有什么区别？NodeJS作为服务有哪些优势？nginx反向代理？Koa的原理和中间件的实现？

## 常用的模块
* [fs]
* [path]
* [http]

## CommonJS模块规范
参考
* [JavaScript模块化](./模块化.md)

> CommonJS 中的 require/exports 和 ES6 中的 import/export 区别？
* ES6中的模块规范还没有被很好的支持，babel等的实现也是通过将其打包为CommonJ规范等实现的
* CommonJS允许动态require导入模块，
* import是在编译的时候去做解析请求包，只能出现在代码顶层，模块名只能是字符串字面量
* import可以按需引入模块的一部分，对`tree shaking`更有利~

## 网络框架
> 什么是Restful API ? koa和express有什么区别？中间件的作用是什么，能大概实现一下吗？你用过哪些模板引擎，他们有什么优劣？

### Restful API
* Restful的意思就是表现层状态转化。
* "表现层"其实指的是"资源"（Resources）的"表现层"，把"资源"具体呈现出来的形式，叫做它的"表现层"（Representation）。
* 所谓"资源"，就是网络上的一个实体，或者说是网络上的一个具体信息。它可以是一段文本、一张图片、一首歌曲、一种服务，总之就是一个具体的实在，每一个URI代表一种资源。
* 果客户端想要操作服务器，必须通过某种手段，让服务器端发生"状态转化"（State Transfer）。而这种转化是建立在表现层之上的，所以就是"表现层状态转化"。
* Restful就是客户端和服务器之间，传递这种资源的某种表现层
* 客户端通过四个HTTP动词，对服务器端资源进行操作，实现"表现层状态转化"
* Restful API就是符合Restful架构的API设计。

### 中间件
`app.use`中间件的原理是什么，我写了一个[简单的实现](https://github.com/tangxiangmin/JSMagic/tree/master/Middleware)
其原理就是维护一个中间件队列，每个中间件接收下一个中间件`next`作为参数，并手动调用

### express
// todo
### Koa
* [Koa中间件的原理](https://www.shymean.com/article/koa%E4%B8%AD%E9%97%B4%E4%BB%B6%E5%AF%BC%E8%87%B4%E6%8E%A5%E5%8F%A3404%E7%9A%84%E9%97%AE%E9%A2%98)

### 模板引擎
参考
* [JS模板引擎（初级篇）](https://www.shymean.com/article/JS%E6%A8%A1%E6%9D%BF%E5%BC%95%E6%93%8E%EF%BC%88%E5%88%9D%E7%BA%A7%E7%AF%87%EF%BC%89)

## 单页面应用SSR原理
参考
* [Vue SSR指南](https://ssr.vuejs.org/zh/#%E4%BB%80%E4%B9%88%E6%98%AF%E6%9C%8D%E5%8A%A1%E5%99%A8%E7%AB%AF%E6%B8%B2%E6%9F%93-ssr-%EF%BC%9F)

### nuxt.js
客户端请求服务器，服务器根据请求地址获得匹配的组件，在调用匹配到的组件返回 Promise (官方是preFetch方法)来将需要的数据拿到。最后再通过

<script>window.__initial_state=data</script>
将其写入网页，最后将服务端渲染好的网页返回回去。

接下来客户端会将vuex将写入的 initial_state 替换为当前的全局状态树，再用这个状态树去检查服务端渲染好的数据有没有问题。遇到没被服务端渲染的组件，再去发异步请求拿数据。

### SSR的优缺点