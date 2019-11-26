
# 知识点清单
整理一个合格前端需要了解的知识点。

CSS
===

* 选择器种类及查找规则
* 权重值计算
* 盒子模型
* BFC
    * 浮动与清浮动
    * 外边距折叠
* 包含块
    * 尺寸百分比
    * 定位
* Flex
* BEM
* CSS Modules与CSS Scoped


JavaScript
===

## JavaScript基础

* 变量和类型
    * 有哪些变量类型？基础类型与引用类型？如何判断数据类型?
    * 运算符与运算符优先级
    * 数据类型转换？隐式转换`==`的工作机制？
* 作用域
    * 函数作用域、块级作用域、全局作用域
    * 作用域链与闭包
    * 内存存储、垃圾回收、内存泄漏
    * this？call、apply、bind
* 原型
    * 原型链、继承
    * 设计模式
* 语言特性
    * ES5/6/7/8语法
    * eventLoop，微任务与宏任务
    * 正则
    * 异常处理

## BOM与DOM编程
* DOM节点，增删查改API，jQuery
* 事件
    * 冒泡与事件委托
    * 事件捕获
* History API
    * 单页应用Router原理
* 本地存储
    * cookies
    * sessionStorage 和 localStorage
    * IndexDB
* Canvas
    * 基本API
    * 动画和游戏
* 跨标签页通信
* Web Worker、PostMessage等

## 浏览器
* 浏览器加载页面？DNS、HTTP、W3C标准HTML文件
* 浏览器解析页面？标签阻塞、CSSOM、DOM tree
* 浏览器渲染页面？renderTree
* 整个过程中的性能优化

## 库与框架
* React
    * 理解`UI = f(data)`
    * 三层结构：虚拟DOM层、Fiber Reconciler调和层、reactDOM层
    * 虚拟DOM的优劣、diff算法原理
    * Fiber的意义和实现原理？任务优先级划分规则？setState的同步异步？
    * Class组件生命周期?合成事件
    * 组件通信？父子组件、兄弟组件、祖先后台组件、任意组件？
    * 封装组件的技巧：ref、Fragments、Portal
    * 逻辑复用：HOC高阶组件、render Props、 Hooks
    * 理解状态管理
        * redux,redux-thunk,redux-saga
        * mobx
    * ReactRouter原理及使用、SSR
    * React性能优化：React.memo、shouldComponentUpdate、PureComponent、代码切割
* Vue
    * 响应式系统：监听数据变化、依赖收集、通知变化
    * 虚拟DOM，template编译成render函数
    * 组件通信：props、event、eventBus、vuex
    * 语法糖：v-model、filter、computed、事件修饰符
    * VueRouter原理及使用
    * vuex设计理念，如何划分模块
    * Vue性能优化：`keep-alive`、`nextTick`、代码切割
* 微信小程序
    * 基本使用
    * 跨端框架mpvue、taro原理

## NodeJS

## TypeScript

## 函数式编程

## 网络
* 从地址栏输入URL到浏览器显示页面整个流程
* 网络协议基础
    * TCP/IP协议？三次握手与四次挥手？TCP如何保证数据是可靠的
    * CDN的作用和原理
* HTTP
    * 报文、常见请求方法区别、常见响应状态码、常见报文字段
    * HTTPS、HTTP2
    * WebSocket协议？与HTTP的区别
* 前端
    * AJAX与fetch？如何二次封装
    * 跨域？几种解决方案
    * 缓存控制
    * 页面加载性能优化
    * 安全？XSS、CSRF原理及解决方式
* Nginx
    * 正向代理与反向代理
    * location和rewrite
* 网络调试
    * 抓包
    * 数据mock

## 前端工程化

* gulp
    * gulp基础概念
    * 配置gulp任务
    * 编写一个gulp插件
* fis3
    * 为什么选择使用fis3？有什么有点
    * 基于fis3的静态资源标记，如何实现静态资源精准的按需加载？
* webpack
    * 设计理念？工作机制？
    * 常见配置项，常用loader和plugin
    * `webpack-dev-server`和热更新原理
    * loader和plugin的区别？如何编写一个loader？如何编写一个plugin？
* babel
    * 工作原理，核心库 `babel-core`
    * presets和plugins的选择
    * 编译配置，打包优化

* 脚手架cli
    * vue-cli3
    * create-react-app、roadhog、umi

## 前端性能优化
* 加载速度
    * 浏览器解析渲染文档流程，阻塞因素
    * 缓存？强缓存与协商缓存？缓存相关头部？如何配置？
    * 资源合并、资源压缩、代码切割
    * webp、雪碧图、字体图标、base64图片
    * CDN原理？CNAME解析流程？
    * 静态资源多域名优化原理
* 首屏效果
    * 预加载、懒加载、按需加载
    * ssr
    * 骨架屏
* 代码优化
    * 重绘和回流、选择器嵌套
    * 长列表数据如何优化
    * React组件性能优化
    * Vue组件性能优化