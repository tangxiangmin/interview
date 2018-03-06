Vue
=== 
* 基本使用及相关技术栈
* 响应式原理
* VNode
* 组件系统，以及如何合理地设计组件
* 事件系统，手动实现 on,emit,off,once
* 性能优化（组件懒加载等）
* Vue-router
* Vuex原理

参考面试题
* https://www.jianshu.com/p/e54a9a34a773
* https://juejin.im/post/59ffb4b66fb9a04512385402


## Vue生命周期

## vue 父子组件嵌套时，组件内部的各个生命周期钩子触发先后顺序
从源码分析`patch`函数时可以发现，先创建父组件，遇见子组件就创建子组件，然后将子组件挂载到父组件，最后执行父组件的挂载操作

## SSR
参考：
* https://juejin.im/post/5a9ca40b6fb9a028b77a4aac