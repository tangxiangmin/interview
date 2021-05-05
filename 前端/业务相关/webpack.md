webpack
===

webpack是一个打包模块化javascript的工具，在webpack里一切文件皆模块，通过loader转换文件，通过plugin注入钩子，最后输出由多个模块组合成的文件，webpack专注构建模块化项目。

* 基本需求，比如样式表分离，脚本压缩，内联文件，HTML模板，热更新等
* 常用loader和插件，打包策略
* 优化，打包效率，输出包体积等

参考：
* http://imweb.io/topic/59324940b9b65af940bf58ae
* [深入浅出webpack-电子书](http://webpack.wuhaolin.cn/)
* [细说 webpack 之流程篇](http://taobaofed.org/blog/2016/09/09/webpack-flow/)
* [[万字总结] 一文吃透 Webpack 核心原理](https://mp.weixin.qq.com/s/Jw_-cZepryo9nbnk1mwjjw)

## webpack基本使用


## webpack原理

### 核心概念
> webpack是一个打包模块化js的工具，可以通过loader转换文件，通过plugin扩展功能。

* Entry：入口，Webpack 执行构建的第一步将从 Entry 开始，可抽象成输入。
* Module：模块，在 Webpack 里一切皆模块，一个模块对应着一个文件。Webpack 会从配置的 Entry 开始递归找出所有依赖的模块。
* Chunk：代码块，一个 Chunk 由多个模块组合而成，用于代码合并与分割。
* Loader：模块转换器，用于把模块原内容按照需求转换成新内容。
* Plugin：扩展插件，在 Webpack 构建流程中的特定时机注入扩展逻辑来改变构建结果或做你想要的事情。
* Output：输出结果，在 Webpack 经过一系列处理并得出最终想要的代码后输出结果。

### 流程

从启动webpack构建到输出结果经历了一系列过程，它们是：
* 解析webpack配置参数，合并从shell传入和webpack.config.js文件里配置的参数，生产最后的配置结果。
* 注册所有配置的插件，好让插件监听webpack构建生命周期的事件节点，以做出对应的反应。
* 从配置的entry入口文件开始解析文件构建AST语法树，找出每个文件所依赖的文件，递归下去。
* 在解析文件递归的过程中根据文件类型和loader配置找出合适的loader用来对文件进行转换。
* 递归完后得到每个文件的最终结果，根据entry配置生成代码块chunk。
* 输出所有chunk到文件系统。
* 需要注意的是，在构建生命周期中有一系列插件在合适的时机做了合适的事情，比如UglifyJsPlugin会在loader转换递归完后对结果再使用UglifyJs压缩覆盖之前的结果。


### 热更新原理
参考: 
* [Webpack热刷新与热加载的原理分析](https://mp.weixin.qq.com/s?__biz=MzIyMTg0OTExOQ==&mid=2247484504&idx=2&sn=958ac64a0fd7b8dac97e3a61e4e3e741&chksm=e8373728df40be3efca40714045ab313821c319ad18da0e29dd15ca9f86c62b8fecb92f773a7&scene=21#wechat_redirect)
* [轻松理解webpack热更新原理](https://juejin.im/post/5de0cfe46fb9a071665d3df0)
* https://zhuanlan.zhihu.com/p/30623057
* https://zhuanlan.zhihu.com/p/30669007
* [EventSource MDN文档](https://developer.mozilla.org/zh-CN/docs/Server-sent_events/EventSource)

热更新就是当你在开发环境修改代码后，不用刷新整个页面即可看到修改后的效果。借助webpack-dev-server插件可以实现项目的热更新

当资源发生改变，以下三种方式都会生成新的bundle，但是又有区别：
```
// 1. 不会刷新浏览器，类似于locatin.reload()
webpack-dev-server
//2. 刷新浏览器
webpack-dev-server --inline
//3. 重新加载改变的部分，HRM失败则刷新页面
webpack-dev-server  --inline --hot
```

热更新的大致实现原理如下所示
* webpack在watch模式下检测到文件变化，对模块重新打包，编译结果保存在内存中
* webpack-dev-server 和 webpack 之间的接口交互，开启服务器并获取webpack的编译结果
* webpack-dev-server 通过sockjs在浏览器和服务器之间开启长连接，方便将webpack编译各阶段的状态告知浏览器，包括传递最主要的信息：新模块的hash值
* HotModuleReplacement.runtime 在浏览器端接收到上一步传递给他的新模块的 hash 值，然后向服务端发送ajax请求，返回所有要更新模块的hash值，获取更新列表，然后通过JSONP请求获取最新的模块代码
* 如果热更新失败，则通过刷新浏览器来获得最新的打包代码

下面这个流程是抄过来的，可以参考一下
* Webpack编译期，为需要热更新的 entry 注入热更新代码(EventSource通信)
* 页面首次打开后，服务端与客户端通过 EventSource 建立通信渠道，把下一次的 hash 返回前端
* 客户端获取到hash，这个hash将作为下一次请求服务端 hot-update.js 和 hot-update.json的hash
* 修改页面代码后，Webpack 监听到文件修改后，开始编译，编译完成后，发送 build 消息给客户端
* 客户端获取到hash，成功后客户端构造hot-update.js script链接，然后插入主文档
* hot-update.js 插入成功后，执行hotAPI 的 createRecord 和 reload方法，获取到 Vue 组件的 render方法，重新 render 组件， 继而实现 UI 无刷新更新。

### 实现一个简易的webpack
参考：[mano-webpack](https://github.com/azl397985856/mono-webpack)

大致思路
* 将一个模块抽象为一个普通的JS对象
```js
{
    dependencies: ['./a.js'],
    id: 12,
    filename: '/Users/Txm/test/b.js',
    code: 'console.log(123)'
}
```

webpack本身不做转换处理
// todo

### 上下文
参考
* [require.context](https://webpack.docschina.org/guides/dependency-management/)

在某些时候需要频繁地引入文件，一个常见的场景是在Vue中引入子组件，然后通过`components`注册局部组件，当组件库比较庞大时，开发起来比较麻烦
```js
// /src/component/register.js
import Vue from 'vue'
/**
 * 首字母大写
 * @param str 字符串
 * @example heheHaha
 * @return {string} HeheHaha
 */
function capitalizeFirstLetter (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
}
/**
 * 对符合'xx/xx.vue'组件格式的组件取组件名
 * @param str fileName
 * @example abc/bcd/def/basicTable.vue
 * @return {string} BasicTable
 */
function validateFileName (str) {
    return /^\S+\.vue$/.test(str) &&
        str.replace(/^\S+\/(\w+)\.vue$/, (rs, $1) => capitalizeFirstLetter($1))
}
const requireComponent = require.context('./', true, /\.vue$/)
// 找到组件文件夹下以.vue命名的文件，如果文件名为index，那么取组件中的name作为注册的组件名
requireComponent.keys().forEach(filePath => {
    const componentConfig = requireComponent(filePath)
    const fileName = validateFileName(filePath)
    const componentName = fileName.toLowerCase() === 'index'
        ? capitalizeFirstLetter(componentConfig.default.name)
        : fileName
    // 自动将目录和子目录下的组件注册为全局组件
    Vue.component(componentName, componentConfig.default || componentConfig)
})

```
然后在入口文件引入`src/component/register.js`即可，

### hash、chunkhash、contenthash区别

通过配置hash，可以控制输出文件的名称，进而进行本地缓存，需要注意这几种hash的区别
* `hash`，hash是跟整个项目的构建相关，只要项目里有文件更改，整个项目构建的hash值都会更改，并且全部文件都共用相同的hash值
* `chunkhash`，它根据不同的入口文件(Entry)进行依赖文件解析、构建对应的chunk，生成对应的哈希值
* `contenthash`，根据输出文件的内容生成hash，每个文件的内容改动不会影响其他文件的输出hash名，对缓存的精准控制而言最有效

### 代码切割
参考：
* [webpack 4.x 代码分割实践](https://www.jianshu.com/p/3c93c0e724ba)
* [webpack之代码拆分](https://juejin.im/post/5a6d7eeef265da3e4d72f1f9)

**SplitChunksPlugin**

配置多个entry，如果每个entry都引入了某些公共模块，会导致打包出来的文件体积比较大，可以配置[SplitChunksPlugin](https://webpack.js.org/plugins/split-chunks-plugin/)将公共文件单独打包
```
optimization: {
     splitChunks: {
         chunks: 'all'
     }
 }
```
之前的插件叫做`webpack.optimize.CommonsChunkPlugin`
```
entry: {
    // ... 入口文件
    vendor:['react'], //第三方库显示声明
    common:['./util'] //公共组件声明为common
},
//***
plugins: [
    new webpack.optimize.CommonsChunkPlugin({
        names:["common", "vendor"],
        filename: "[name].js"
    })  
]
```


**按需加载**

有两种方式供我们实现动态导入，其本质都是通过插入script标签，然后加载对应的模块

`import(xxx).then()`,ES的提案，返回以一个promise，导入的模块在then中拿到，注意使用该语法需要配置babel插件`@babel/plugin-syntax-dynamic-import`

`require.ensure()` // webpack在编译时会静态地解析代码中的require.ensure()，将里面require的模块添加到一个分开的chunk中

## 编写组件和loader
参考
* [编写gulp、webpack与fis3插件](https://www.shymean.com/article/%E7%BC%96%E5%86%99gulp%E3%80%81webpack%E4%B8%8Efis3%E6%8F%92%E4%BB%B6)

## 性能优化

[webpack折腾记（四）：性能优化](https://www.shymean.com/article/webpack%E6%8A%98%E8%85%BE%E8%AE%B0%EF%BC%88%E5%9B%9B%EF%BC%89%EF%BC%9A%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96)

### 处理不经常更新的库文件

* CommonsChunkPlugin，实际上每次打包时还需要去处理这些第三方库，打包完成后，能把第三方库和自己的业务代码分开
* DLLPlugin，预编译，把第三方代码完全分离开，即每次只打包项目自身的代码。

### 性能分析
> 如何了解webpack打包性能瓶颈？如何优化webpack打包效率？

参考：[使用webpack4提升180%编译速度](http://louiszhai.github.io/2019/01/04/webpack4/)

使用`webpack-bundle-analyzer `

为何升级webpack4后编译速度会增加的很明显？

升级至 webpack4 后，通过搭载 ParallelUglifyPlugin 、happyPack 和 dll 插件，编译速度可以提升181%，整体编译时间减少了将近 2/3，为开发节省了大量编译时间！而且随着项目发展，这种编译提升越来越可观

* happyPack，运用多核并行处理webpack任务
* ParallelUglifyPlugin并行通过 UglifyJS 去压缩代码
* dll预编译不经常改动的库文件

### 打包优化
参考
* https://mp.weixin.qq.com/s/WmTWXoYn_CvD60nd0_biuQ

首先通过一些工具如[speed-measure-webpack-plugin](https://www.npmjs.com/package/speed-measure-webpack-plugin)分析打包性能瓶颈，一般来说耗时操作都位于`loader`和`babel`等文件内容解析等操作上


然后选择优化策略，一般分为缓存、多核、抽离以及拆分
* 使用`cache-loader`缓存loader编译文件的结果到磁盘上，如果源文件未发生改变，则不会重新编译
* 使用`happypack`进行多核编译
* 避免在库文件的时间消耗，可以通过
    * `webpack-dll-plugin`，将所有库文件打包到一个vendor.js中，加载速度会比较缓慢
    * `Externals`将库文件通过CDN直接引入，结合HTTP2的多路复用特性，可以快速的加载依赖

### 减少代码体积

* 按需加载组件`babel-plugin-component`
* 减少 ES6 转为 ES5 的冗余代码` babel-plugin-transform-runtime`，合理设置`preset`
* 按需使用`babel-polyfill`
* 正确使用`tree shaking`
* 结合extenals将库文件通过CDN引入

## 常见问题

参考：
* https://zhuanlan.zhihu.com/p/44438844
* https://www.jianshu.com/p/bb1e76edc71e
* https://juejin.im/post/5c6cffde6fb9a049d975c8c1
