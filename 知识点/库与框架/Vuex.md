Vuex
===

[vuex](https://vuex.vuejs.org/zh/)是一个专为vue.js应用程序开发的状态管理模式（它采用集中式存贮管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化）

## 为什么要用vuex？

在应用中会遇见**多个组件共享状态**的情况
* 多个视图共享一个状态
* 来自不同的视图行为需要修改同一个状态

通过定义和隔离状态管理中的各种概念并通过强制规则维持视图和状态间的独立性，我们的代码将会变得更结构化且易维护

## vuex的核心概念；
需要掌握核心的五个API
* state：存储数据，存储状态；在根实例中注册了store 后，用 this.$store.state 来访问；对应vue里面的data；存放数据方式为响应式，vue组件从store中读取数据，如数据发生变化，组件也会对应的更新。
* getter：可以认为是 store 的计算属性，它的返回值会根据它的依赖被缓存起来，且只有当它的依赖值发生了改变才会被重新计算。
* mutation：更改 Vuex 的 store 中的状态的唯一方法是提交 mutation。
* action：包含任意异步操作，通过提交 mutation 间接更变状态。
* module：将 store 分割成模块，每个模块都具有state、mutation、action、getter、甚至是嵌套子模块。

数据传递流程，可以参考官网的这张图片

![](http://ww2.sinaimg.cn/large/006tNc79gy1g5r9hyf12wj30jh0fb0sz.jpg)

当组件进行数据修改的时候我们需要调用dispatch来触发actions里面的方法。actions里面的每个方法中都会有一个commit方法，当方法执行的时候会通过commit来触发mutations里面的方法进行数据的修改。mutations里面的每个函数都会有一个state参数，这样就可以在mutations里面进行state的数据修改，当数据修改完毕后，会传导给页面。页面的数据也会发生改变。

## 一些使用技巧

mapState

mapMutations

mapGetters

mapActions

## 状态持久化

## 源码分析
