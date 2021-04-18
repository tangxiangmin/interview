
## React

* [2019年17道高频React面试题及详解](https://juejin.im/post/5d5f44dae51d4561df7805b4)

### React设计理念

react只是关注view层，它的核心思想就是view = f(state)。在React中，一切都是组件，组件是 React 应用 UI 的构建块。这些组件将整个 UI 分成小的独立并可重用的部分。每个组件彼此独立，而不会影响 UI 的其余部分。


### 为什么要改用Fiber Reconciler

避免Stack Reconciler 递归diff运算时间过长的问题

### 新的生命周期函数？会带来什么影响

参考[这张图](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)

由于Fiber导致diff阶段的生命周期函数可能会被重复调用，因此一些逻辑如接口请求应该放在`componentDidMounted`中处理

### setState是同步的还是异步的

在React合成事件和生命周期函数中等React可以知道当前setState运行上下文的地方是异步的，在其他地方是同步的。

### HOC高阶组件

高阶组件是重用组件逻辑的高级方法，是一种源于 React 的组件模式。 HOC 是自定义组件，在它之内包含另一个组件。它们可以接受子组件提供的任何动态，但不会修改或复制其输入组件中的任何行为。你可以认为 HOC 是“纯（Pure）”组件。

高阶组件可以用于
* 代码重用，逻辑和引导抽象
* 渲染劫持
* 状态抽象和控制
* Props 控制

### React合成事件
当用户在为onClick添加函数时，React并没有将Click时间绑定在DOM上面。
而是在document处监听所有支持的事件，当事件发生并冒泡至document处时，React将事件内容封装交给中间层SyntheticEvent（负责所有事件合成）
所以当事件触发的时候，对使用统一的分发函数dispatchEvent将指定函数执行。

### React项目性能优化
可以从下面几个方面入手
* 代码分割，路由按需加载
* 通过`React.memo`、`shouldComponentUpdate`和`PureComponent`手动判断是否需要重新渲染

### PureComponent中浅比较代码实现
使用增强版的`Object.is`比较两个对象，当引用不相同时，只比较两个对象的第一层的值是否相同，


### React中获取ref的几种方法
```js
ref='myRef' // this.refs['xxxname']

ref={el=>this.xxx=el} // this.xxx

this.myRef=React.createRef()
ref={this.myRef} // this.myRef.current

React.forwardRef // 将prop接收到的ref传递给子组件，可以用于在高阶组件中获取原始组件
```

### React中组件父子组件通信的方式？非父子组件之间通信呢？
可以使用
* `props`父子通信
* `ref`获取子组件实例
* `context`，跨级祖先组件与后代组件通信
* `EventBus`事件总线通信
* `flux`、`redux`、`mobx`等全局状态管理

### React.memo的作用是什么？
当组件的输入属性相同时，可以通过`SCU`或`PureComponent`避免重新渲染，这是一个很常见的优化操作，因此提供了`React.memo`达到相同的目的

### ReactDOM.createPortal的作用和引用场景
默认情况下，组件render函数返回的元素会被挂载在它的父级组件上，`createPortal`提供了将render返回的DOM元素渲染到其他地方的方式，可以用来封装如弹窗等组件

### React.Fragment
按照约定一段jsx代码需要通过单节点包裹起来，我们往往会通过一个真实的标签如`div`等来包裹，`Fragment`提供了一个使返回子元素列表而不需要新增一个真实DOM节点的方法。

### React中插入html字符串?
使用保留prop字段`dangerouslySetInnerHTML`，格式为`dangerouslySetInnerHTML={{__html:'html字符串'}}`

### Hooks的优势和劣势有哪些？


## Redux

### 中间件实现原理

通过curry定义中间件，通过compose组合dispatch。

