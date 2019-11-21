Vue
===

* [重新阅读Vue源码](https://www.shymean.com/article/%E9%87%8D%E6%96%B0%E9%98%85%E8%AF%BBVue%E6%BA%90%E7%A0%81)

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

* `v-if`和`v-show`
* computed 和 watch，计算属性 `computed` 的值有缓存，`watch`每当监听的数据变化时都会执行回调 
* 使用`Object.freeze`对不需要响应式的数据避免劫持。
* 在beforeDestory之前销毁事件订阅、定时器等，避免内存泄漏

## Vue-loader
参考
* [从vue-loader源码分析CSS-Scoped的实现](https://www.shymean.com/article/%E4%BB%8Evue-loader%E6%BA%90%E7%A0%81%E5%88%86%E6%9E%90CSS-Scoped%E7%9A%84%E5%AE%9E%E7%8E%B0)

需要理解在loader中是如何处理SFC单文件组件的。