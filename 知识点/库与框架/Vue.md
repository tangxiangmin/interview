Vue
===

* [重新阅读Vue源码](https://www.shymean.com/article/%E9%87%8D%E6%96%B0%E9%98%85%E8%AF%BBVue%E6%BA%90%E7%A0%81)

## MVC、MVP、MVVM

MVC，以传统web应用为例
* HTML文件代表View，专门处理数据展示
* 后台接口相当于Model，专门处理数据逻辑
* JavaScript代表Controller，监听View的交互（如事件注册）,从Model获取数据(如Ajax请求)，然后操作DOM将数据更新到View上
    * View→Controller事件触发
    * Controller→Model网络请求
    * Model→View 操作DOM，相当于我们直接在网络请求回调中直接更新DOM

这种模式下，各个模块互相耦合，尤其是更新View的地方，分散在各个网络回调中，因此出现了MVP，MVP将View和Model分隔开，
* Presenter中接收View的事件，然后请求Model获取数据
* Presenter将获取的数据更新到View上，（不是在网络回调函数中直接操作DOM，而是在JavaScript中封装操作DOM节点的相关方法）

在Presenter中需要封装大量手动操作DOM的方法，对于开发者而言是十分苦恼的，于是出现了MVVM，其中的`VM`表示ViewModel
* ViewModel可以和View绑定，可以将数据的变化自动更新到View上
* ViewModel不仅仅是一个概念，还需要有对应的代码实现，常见的如`Object.defineProperty`

## 虚拟DOM
与React基本一致

## 响应式系统
* 属性劫持，监听数据变化
* 依赖收集，在get时订阅数据变化，在set时通知Watcher更新
* 批量更新，对于同一个Watcher，在一次更新阶段只会进入队列一次

## 语法糖

Vue中提供了大量的语法糖，
* v-model
* 事件修饰符
* filters 过滤器
* computed 计算属性
* is的使用场景

## 组件

需要掌握核心概念
* prop
* event
* slot

### 组件通信
使用prop、eventBus、provide/inject等，也可以使用全局状态管理工具Vuex等

### 组件封装的技巧
参考：[封装Vue组件的一些技巧](https://www.shymean.com/article/%E5%B0%81%E8%A3%85Vue%E7%BB%84%E4%BB%B6%E7%9A%84%E4%B8%80%E4%BA%9B%E6%8A%80%E5%B7%A7)


## 性能优化
参考
* [最全的 Vue 性能优化指南，值得收藏](https://mp.weixin.qq.com/s/MRrUDEfNcWA340u1Ovhh0A)

代码层面的优化

* `v-if`和`v-show`
* computed 和 watch，计算属性 `computed` 的值有缓存，`watch`每当监听的数据变化时都会执行回调 
* 使用`Object.freeze`对不需要响应式的数据避免劫持。
* 在beforeDestory之前销毁事件订阅、定时器等，避免内存泄漏
* 长列表通过窗口化复用DOM节点
* SSR渲染SEO优化

打包层面的优化

* 路由懒加载
* 库文件按需加载

网络层面的优化

## 开发环境


### vue-cli3

### Vue-loader
参考
* [从vue-loader源码分析CSS-Scoped的实现](https://www.shymean.com/article/%E4%BB%8Evue-loader%E6%BA%90%E7%A0%81%E5%88%86%E6%9E%90CSS-Scoped%E7%9A%84%E5%AE%9E%E7%8E%B0)

需要理解在loader中是如何处理SFC单文件组件的。

### 手动配置vue开发环境
需要注意
* 安装`vue-loader`和`vue-template-compiler`同版本
* 引入`VueLoaderPlugin`
```js
let HtmlWebpackPlugin = require("html-webpack-plugin");
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const path = require("path");

module.exports = {
    mode: "development",
    entry: "./src/index.js",
    devtool: "inline-source-map",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist")
    },
    module: {
        rules: [
            {
                test: /\.vue?$/,
                use: "vue-loader",
                exclude: /node_modules/
            }
        ]
    },
    
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "./src/index.html")
        }),
        new VueLoaderPlugin()
    ]
};

```


## Vue3

> 有了解过Vue3吗？

参考：[Vue3 深度解析](https://juejin.im/post/5dd3d4dae51d453d493092da#heading-8)

```html
<div id="app">
    <p>{{ state.text }}</p>
    <button @click="clickBtn">click</button>
</div>
<script>
  const { createApp, reactive, onMounted } = Vue
  const App = {
    setup() {
      onMounted(() => {
        console.log('onMounted: hello world!')
      })
      let state = reactive({ text: 'hello world!' })
      return {
        state,
        clickBtn: () => {
          state.text = 'hell world'
        }
      }
    }
  }
  createApp().mount(App, '#app')
</script>
```

主要改动

* API写法调整，从之前的Option API 更新为新的Composition API ，与React Hook类似，可以更方便地复用逻辑代码
* 使用`Proxy`代替`Object.defineProperty`
* 源码从flow迁移到TypeScript

只是大概了解了一下一些新特性，具体细节还没有深入了解。