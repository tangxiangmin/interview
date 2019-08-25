

## 需要掌握的东西
* 基本使用及相关技术栈
* 响应式原理
* VNode
* 组件系统，以及如何合理地设计组件
* 事件系统，手动实现 on,emit,off,once
* 性能优化（组件懒加载等）
* Vue-router、Vuex
* SSR原理及实现
* Vue devtools

参考
* https://www.jianshu.com/p/e54a9a34a773
* https://juejin.im/post/59ffb4b66fb9a04512385402
* 之前整理了`V2.5.9`的[源码分析](https://www.shymean.com/article/Vue%E6%BA%90%E7%A0%81%E9%98%85%E8%AF%BB%E7%AC%94%E8%AE%B0%E4%B9%8B%E9%A1%B9%E7%9B%AE%E7%BB%93%E6%9E%84%E5%92%8CVue%E5%AF%B9%E8%B1%A1%EF%BC%88%E4%B8%80%EF%BC%89)
* [面试必备的13道可以举一反三的Vue面试题](https://juejin.im/post/5d41eec26fb9a06ae439d29f)

## 性能优化

参考：

- [Vue 项目性能优化](https://juejin.im/post/5d548b83f265da03ab42471d)

可以从下面几个方面入手

- `v-if`和`v-show`的区别
- 使用`Object.freeze`避免数据劫持
- 在组件卸载前移除定时器、事件订阅等
- 路由懒加载，通过异步组件实现
- 第三方库按需引入，避免打包整个库文件
- 模板预编译，在打包时就将其转换为render函数
- 可以使用**窗口化**来进行优化，只需要渲染少部分区域的内容，减少重新渲染组件和创建 dom 节点的时间，参考:[vue-virtual-scroll-list](https://github.com/tangbc/vue-virtual-scroll-list)


## 常见问题

### Vue 组件 data 为什么必须是函数
* 每个组件都是 Vue 的实例。
* 组件共享 data 属性，当 data 的值是同一个引用类型的值时，改变其中一个会影响其他。

### React和Vue有什么区别
这里有尤大的回答
* https://www.zhihu.com/question/31585377

**项目规模**

React 配合严格的 Flux 架构，适合超大规模多人协作的复杂项目。理论上 Vue 配合类似架构也可以胜任这样的用例，但缺少类似 Flux 这样的官方架构。

小快灵的项目上，Vue 和 React 的选择更多是开发风格的偏好。对于需要对 DOM 进行很多自定义操作的项目，Vue 的灵活性优于 React。

**开发风格的偏好**

React 推荐的做法是 JSX + inline style，也就是把 HTML 和 CSS 全都整进 JavaScript 了。Vue 的默认 API 是以简单易上手为目标，但是进阶之后推荐的是使用 webpack + vue-loader 的单文件组件格式：

JSX 在逻辑表达能力上虽然完爆模板，但是很容易写出凌乱的 render 函数，不如模板看起来一目了然。当然这里也有个人偏好的问题

### Vue和AngularJS的双向绑定实现有什么区别

Vue是通过`Object.defineProperty`劫持数据的访问描述符来实现的

AngularJS是在恰当的时机从$rootScope开始遍历所有$scope，检查它们上面的属性值是否有变化，如果有变化，就用一个变量dirty记录为true，再次进行遍历，如此往复，直到某一个遍历完成时，这些$scope的属性值都没有变化时，结束遍历。由于使用了一个dirty变量作为记录，因此被称为脏检查机制