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
* SSR原理及实现
* Vue devtools

参考面试题
* https://www.jianshu.com/p/e54a9a34a773
* https://juejin.im/post/59ffb4b66fb9a04512385402


## Vue生命周期


## vue 父子组件嵌套时，组件内部的各个生命周期钩子触发先后顺序
从源码分析`patch`函数时可以发现，先创建父组件，遇见子组件就创建子组件，然后将子组件挂载到父组件，最后执行父组件的挂载操作

## SSR
参考：
* https://juejin.im/post/5a9ca40b6fb9a028b77a4aac

## Vue 组件 data 为什么必须是函数
* 每个组件都是 Vue 的实例。
* 组件共享 data 属性，当 data 的值是同一个引用类型的值时，改变其中一个会影响其他。

## Vue computed 实现
理解computed的两个需求
* 建立与其他属性（如：data、 Store）的联系；
* 属性改变后，通知计算属性重新计算。

实现方式
* 初始化 data， 使用 Object.defineProperty 把这些属性全部转为 getter/setter。
* 初始化 computed, 遍历 computed 里的每个属性，每个 computed 属性都是一个 watch 实例。每个属性提供的函数作为属性* 的 getter，使用 Object.defineProperty 转化。
* Object.defineProperty getter 依赖收集。用于依赖发生变化时，触发属性重新计算。
* 若出现当前 computed 计算属性嵌套其他 computed 计算属性时，先进行其他的依赖收集。

## Vue complier 实现
理解主要过程
* parse 过程，将 template 利用正则转化成 AST 抽象语法树。
* optimize 过程，标记静态节点，后 diff 过程跳过静态节点，提升性能。
* generate 过程，生成 render 字符串。
