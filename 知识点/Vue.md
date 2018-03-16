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

## 实例化过程中发生了什么

**初始化**
调用`this._init`进行初始化，包括生命周期、事件、 props、 methods、 data、 computed 与 watch 等，此外最重要的是通过`Object.defineProperty`设置data参数属性`setter`与`getter`函数，用来用来实现**响应式数据**以及**依赖收集**

**模板编译**
如果传入的是`template`而不是`render`函数，则会进行模板编译过程。
* parse，通过正则解析模板，生成AST
* optimize，优化AST，包括标记静态节点，为后续path操作提供优化基础
* generate，将AST转换成渲染函数

**渲染**
渲染函数执行时，因为会读取所需对象的值，所以会触发 getter 函数进行依赖收集。
依赖收集的实质是是将观察者 Watcher 对象存放（`pushTarget(this)`修改`Dep._target`) 到当前闭包中的订阅者 Dep 的 subs。一个属性可能对应多个Watcher，他们都保存在对应的Dep中。

修改对象的值的时候，会触发对应的setter， 在setter内部通知之前依赖收集到的Dep中的每一个Watcher，这些 Watcher 就会开始调用update来更新视图，从而重新渲染视图。

**虚拟节点**
渲染函数实际返回的是VNode，它是一个用来映射真实DOM的JavaScript对象。由于VNode不依赖于真实的浏览器环境，因此可以跨平台使用，如weex、Node、浏览器等。

**更新视图**
当逻辑操作更新数据时，就会重新渲染视图。为了提高效率，Vue不会把新的VNode完全渲染然后替换旧的VNode内容，而是进行`diff`操作，然后将有差异的DOM进行修改。

## Vue生命周期

-------
常见问题
===

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
