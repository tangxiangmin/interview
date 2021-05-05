

整理一个合格前端需要了解的知识点。


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
* Axios
* Koa
* 微信小程序
    * 基本使用
    * 跨端框架mpvue、taro原理

## NodeJS

* NodeJS优缺点及应用场景
* NodeJS的结构
* 模块？加载机制、模块缓存、热更新、上下文、包管理
* 核心内置库类？EventEmitter、Stream、fs文件系统、网络、child-process
* 进程、子进程、集群、进程通信、守护进程
* eventLoop？与浏览器的区别？
* express、koa？中间件及原理？
* MVC、RESTful接口设计、RPC
* 编写原生C++模块

## TypeScript

* 使用TS的优缺点
* 类型定义文件`*.d.ts`的作用?
* 如何理解接口、泛型？
* 将TS集成到开发环境？在Vue、React等库中引入TS

## 函数式编程

* 高阶函数
* 纯函数
* 组合
* 柯里化

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
    * 为什么选择使用fis3？有什么优点
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
* 性能瓶颈与性能分析
    * 浏览器解析渲染文档流程，阻塞因素
    * 数据量大小，长列表数据如何优化？
* 提前请求资源
    * DNS预解析
    * preload、prefetch
* 加载速度
    * 静态资源多域名优化
    * 缓存？强缓存与协商缓存？缓存相关头部？如何配置？
    * 减少请求数量，
        * 资源合并、资源压缩、代码切割
        * webp、雪碧图、字体图标、base64图片
    * 压缩文件体积，uglifyJS、gzip
    * CDN原理，CNAME解析流程
* 首屏效果
    * 预加载、懒加载、按需加载
    * ssr
    * 骨架屏
* 代码优化
    * 重绘和回流
    * 选择器嵌套
    * React组件性能优化
    * Vue组件性能优化