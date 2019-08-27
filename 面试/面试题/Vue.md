
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

## 一些关于Vue的面试题
参考
* [面试必备的13道可以举一反三的Vue面试题](https://juejin.im/post/5d41eec26fb9a06ae439d29f)
* [Vue面试题汇总](https://juejin.im/post/59ffb4b66fb9a04512385402)
* [整理前端面试题(十一): Vue面试题合集](https://www.jianshu.com/p/e54a9a34a773)


### 谈谈你对于MVVM框架的理解

参考: https://juejin.im/post/5cb706efe51d456e6865930a

把系统分为三个基本部分：模型（Model）、视图（View）和视图模型（ViewModel）。

其核心是提供对View 和 ViewModel 的双向数据绑，这使得ViewModel 的状态改变可以自动传递给 View，自动修改可以避免手动同步更新Model和View无需手动操作复杂的DOM API

数据绑定可以认为是Observer模式或者是Publish/Subscribe模式，原理都是为了用一种统一的集中的方式实现频繁需要被实现的数据更新问题。

比起MVP，MVVM不仅简化了业务与界面的依赖关系，还优化了数据频繁更新的解决方案，甚至可以说提供了一种有效的解决模式。

### new Vue(options)中发生了什么操作
* 初始化，调用this._init进行初始化，
    * 包括生命周期、事件、 props、 methods、 data、 computed 与 watch 等，
    * 此外最重要的是通过Object.defineProperty设置data参数属性setter与getter函数，用来用来实现响应式数据以及依赖收集
* 模板编译，如果传入的是template而不是render函数，则会进行模板编译过程。
    * parse，通过正则解析模板，生成AST
    * optimize，优化AST，包括标记静态节点，为后续path操作提供优化基础
    * generate，将AST转换成渲染函数
* 渲染页面，调用渲染函数，根据Vnode生成DOM节点，然后挂载到页面上
* 在这个过程中会调用对应的生命周期钩子函数
* 更新页面，当data发生变化时，依赖收集执行的Dep会通知相关watcher，更新视图，通过diff算法按需更新Vnode，重新渲染相关节点，更新页面

### 简述Vue响应式系统的原理

首先需要监听数据属性的变化。

然后需要为每个属性收集依赖，方便在该属性更新的时候通知执行相关逻辑，这是一个发布订阅系统
* Dep在observer数据时，在getter中收集依赖watcher，在setter中通过通知watcher，
* Watcher是一个视图更新、$watch注册回调等 进行抽象封装的一个类，当数据更新时，只需要调用watcher.update即可，至于具体执行什么操作，由初始化时注册的watcher.cb开始

具体执行流程如下
* 初始化时会递归遍历`data`数据的属性，通过`Object.defineProperty`劫持属性访问描述符`set`和`get`，通过闭包为每个属性都维护了一个`Dep`对象
* 每个组件在执行`vm.$mount`时，都初始化了一个处理视图更新的Wathcer，同时注册`updateComponent`回调
* 在调用render函数时，使用到的属性将触发get，从而调用`dep.depend`收集Watcher；
* 当属性更新时，将触发set，调用`dep.notify`通知Watcher，并执行watcher回调`updateComponent`，重新渲染组件

### 如果让你用proxy实现Vue的响应式系统，你会如何处理

proxy有下面特性
* proxy监听的是对象而不是单个属性，因此可以直接监听对象和数组的变化
* 除开set和get之外，还有多种拦截方法如apply、ownKeys、deleteProperty、has


### Vue和AngularJS的双向绑定实现有什么区别

Vue是通过`Object.defineProperty`劫持数据的访问描述符来实现的

AngularJS是在恰当的时机从$rootScope开始遍历所有$scope，检查它们上面的属性值是否有变化，如果有变化，就用一个变量dirty记录为true，再次进行遍历，如此往复，直到某一个遍历完成时，这些$scope的属性值都没有变化时，结束遍历。由于使用了一个dirty变量作为记录，因此被称为脏检查机制


### Vue 组件 data 为什么必须是函数
* 每个组件都是 Vue 的实例。
* 组件共享 data 属性，当 data 的值是同一个引用类型的值时，改变其中一个会影响其他。

### React和Vue有什么区别
参考尤大在知乎上的[回答](https://www.zhihu.com/question/31585377)。

**项目规模**

React 配合严格的 Flux 架构，适合超大规模多人协作的复杂项目。理论上 Vue 配合类似架构也可以胜任这样的用例，但缺少类似 Flux 这样的官方架构。

小快灵的项目上，Vue 和 React 的选择更多是开发风格的偏好。对于需要对 DOM 进行很多自定义操作的项目，Vue 的灵活性优于 React。

**开发风格的偏好**

React 推荐的做法是 JSX + inline style，也就是把 HTML 和 CSS 全都整进 JavaScript 了。Vue 的默认 API 是以简单易上手为目标，但是进阶之后推荐的是使用 webpack + vue-loader 的单文件组件格式：

JSX 在逻辑表达能力上虽然完爆模板，但是很容易写出凌乱的 render 函数，不如模板看起来一目了然。当然这里也有个人偏好的问题

### Vue生命周期的原理是什么

Vue通过` callHook (vm: Component, hook: string)`方法，在程序运行的某些特定时刻，调用`vm.$options[hook]`方法，即对应的生命周期函数。

生命周期函数，实际上就是在代码运行的不同的阶段调用预先传入的配置函数。因为框架在运行期间就像是一个黑盒，通过钩子函数，我们可以在外部获取到程序在某个具体时刻的代码和数据。

### 为什么要求组件模板只能有一个根元素

从概念上来说，虚拟DOM组件树由多个子树构造，一棵子树代表一个子组件，且一棵树只能有一个根节点。一个组件节点可以看做是tag比较特殊的VNode，其组件实例为`vnode.componentInstance`，DOM节点为`vnode.elm`。

从实现上来说，当渲染页面时调用`patch`函数，是从旧的根节点与新的根节点进行对比的，如果有多个节点，显然是不正确的。React中实现了Fragment的技术，Vue中并没有类似的实现



### v-model的实现原理

`v-model`是一个内置指令实现，其本质是语法糖，封装了父子组件的事件通信，父组件传入特定的props字段`value`，子组件触发事件`input`通知父组件修改`value`。

`input`事件处理函数内部调用`vm.$set`完成数据的更新。该事件处理函数在编译`render`函数时，通过生成`el.model`表达式然后由Vue自动注册。

因此组件只需要处理何时触发`input`执行`$set`逻辑即可
* 对于原生表单元素如`input`（`textarea`标签实现相同，`select`略有不同），在directive触发`inserted`时，监听变化事件如`change`事件，并在事件回调中触发`input`事件
* 对于组件而言，需要组件内部自己处理触发`input`事件的逻辑


### 为什么Vue中可以通过`this`访问到和修改`this.$data`的值
这是通过数据代理实现的，原理是修改对应的`getter`和`setter`

在初始化时的`initData`方法中，可以看见遍历了`options.data`的key值，然后依次调用了` proxy`

```js
function proxy (target: Object, sourceKey: string, key: string) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  }
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}
```

通过这种方式，就可以实现通过`this.xxx`可以访问到`this._data.xxx`的方式了。

### 在使用计算属性的时，函数名和data数据源中的数据可以同名吗
Vue初始化属性`initState`中的顺序是：`props`、`methods`、`data`、`computed`、`watch`。

在`initComputed`方法中，会检测`key in vm`，只有key不在当前组件实例上时，才会注册。由于先使用了`initData`代理data数据源中的数据，如果在`computed`中定义了与data或props中相同的键名，则会提示错误信息

```js
for (const key in computed) {
    // ...
    if (!(key in vm)) {
      defineComputed(vm, key, userDef)
    } else if (process.env.NODE_ENV !== 'production') {
      if (key in vm.$data) {
        warn(`The computed property "${key}" is already defined in data.`, vm)
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(`The computed property "${key}" is already defined as a prop.`, vm)
      }
    }
}
```



### keep-alive的实现原理和相关的生命周期

`keep-alive`是一个内置组件，其原理就是通过维护一个cache，在render函数中根据key返回缓存的vnode，来实现组件的持久化。

相关的生命钩子函数
* `activated`，在patch操作完成后节点需要插入的`hook.insert`阶段，keep-alive 组件激活时调用
* `deactivated`，在patch操作完成后节点需要被移除的`hook.destroy`阶段，在keep-alive 组件停用时调用

### Vue中diff算法key的作用
Vue在比较两个a、b节点时，会优先判断`a.key === b.key`，只有当他们相同、或者均为undefined时，才比较`tag`类型

在首首、尾尾、首尾、尾首四种比较均布满足的情况下，Vue会尝试尽量在旧节点找到一个可以复用的DOM实例，使用key可以构建一个映射，快速找到目标节点，否则需要每次循环查找旧节点中tag相同的节点进行对比进行对比。

### css scoped是如何在Vue中实现的

在patch节点的`createElm`方法中，如果vnode.tag存在，则会调用`setScope(vnode) `方法，该方法会根据`vnode.fnScopeId`为DOM实例设置一个`@styleScope`属性为`scopeId`，该属性可以用来实现`css scoped`

### Vue中的错误处理机制

可以使用`errorCaptured`生命钩子函数，该方法会在子组件发生错误时调用，并通过`while(cur = cur.$parent)`依次向父节点冒泡，可以通过返回false阻止错误继续向上传播

### vue变量名如果以_、$开头的属性会发生什么问题？怎么访问到它们的值？

在`initData`中，会通过`isReserved`判断key是否由`_`或`$`开头，如果是，则不会执行`proxy`进行数据代理，因此无法通过`this._xx`访问，只能通过`this.$data.xx`访问。


### 说下$attrs和$listeners的使用场景

`$attrs`：包含了父作用域中不被 prop 所识别 (且获取) 的特性绑定 ( class 和 style 除外 )
`$listeners`：包含了父作用域中的 (不含 .native 修饰器的) v-on 事件监听器。

* 用于创建高级组件，如利用`$listeners`实现事件节流
* 隔代组件之间的通信


### Vue组件之间的通信

* props / $emit 父子组件通信 
* ref 与 $parent / $children 直接获取父子组件的引用
* EventBus （$emit / $on）通过事件订阅通信
* $attrs/$listeners 适用于 隔代组件通信
* provide / inject 适用于 隔代组件通信，祖先组件向其后代组件注入依赖
* Vuex 全局状态管理



### Vue项目性能优化

参考：[Vue 项目性能优化](https://juejin.im/post/5d548b83f265da03ab42471d)

可以从下面几个方面入手

* `v-if`和`v-show`的区别
* 使用`Object.freeze`避免数据劫持
* 在组件卸载前移除定时器、事件订阅等
* 路由懒加载，通过异步组件实现
* 第三方库按需引入，避免打包整个库文件
* 模板预编译，在打包时就将其转换为render函数
* 可以使用**窗口化**来进行优化，只需要渲染少部分区域的内容，减少重新渲染组件和创建 dom 节点的时间，参考:[vue-virtual-scroll-list](https://github.com/tangbc/vue-virtual-scroll-list)
