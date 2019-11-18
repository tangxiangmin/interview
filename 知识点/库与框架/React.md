React
===
* Virtual DOM，JSX, React.createElement
* 组件组件生命周期
* Fiber、diff算法
* React-Router
* 状态管理`Flux`、`Redux`和`react-redux`、`redux-saga`、`Mobx`
* https://juejin.im/post/5d5f44dae51d4561df7805b4


## 组件
* [《React设计模式与最佳实践》读书笔记](https://www.shymean.com/article/%E3%80%8AReact%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%E4%B8%8E%E6%9C%80%E4%BD%B3%E5%AE%9E%E8%B7%B5%E3%80%8B%E8%AF%BB%E4%B9%A6%E7%AC%94%E8%AE%B0)

### 有状态组件的生命周期
参考
* [理解React-组件生命周期](https://juejin.im/post/5a9a0ff26fb9a028b92c9a29)

![](https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1520253711095&di=71e09be1902f051e242ceb66cb71e7b2&imgtype=0&src=http%3A%2F%2Fstatic.open-open.com%2Flib%2FuploadImg%2F20170502%2F20170502142621_556.png)

React的生命周期主要包含下面几个
* constructor，实例化组件时触发，可用于初始化state
* componentWillMount，组件挂载前触发
* componentWillReceiveProps(nextProps)，将在props变化时触发
* shouldComponentUpdate(nextProps, nextState, nextContext)，组件默认在它们接收到的props，其状态或环境发生变化时重新render自己，可以通过该函数决定是否重新执行渲染
* componentWillUpdate(nextProps, nextState)，在实际重新渲染组件时才会触发此方法
* componentDidUpdate(prevProps, prevState, prevContext)，将在渲染完成后在每个重新渲染周期中被触发
* componentDidCatch(errorString, errorInfo)，处理子元素抛出的错误
* componentDidMount，组件挂载后触发，表示组件及其所有子组件被正确渲染
* componentWillUnmount，组件卸载时触发

> React 在哪个阶段发起 XhrHttpRequest 比较合适？

React 下一代调和算法 Fiber 会通过开始或停止渲染的方式优化应用性能，其会影响到 componentWillMount 的触发次数。对于 componentWillMount 这个生命周期函数的调用次数会变得不确定，React 可能会多次频繁调用 componentWillMount。如果我们将 AJAX 请求放到 componentWillMount 函数中，那么显而易见其会被触发多次，自然也就不是好的选择。

### React Hooks
`hooks` 让函数式组件拥有 `state` 和类生命周期这两个功能

参考
* [一篇文章理解React Hooks](https://zhuanlan.zhihu.com/p/50597236)

## 状态管理
* [理解数据状态管理](https://www.shymean.com/article/%E7%90%86%E8%A7%A3%E6%95%B0%E6%8D%AE%E7%8A%B6%E6%80%81%E7%AE%A1%E7%90%86)


### redux
redux的使用流程：
* 定义相关的action
* 实现一个reducer，并在其中根据action返回对应的state
* 根据reducer创建一个全局唯一的store，在UI层通过
    * `store.subscribe`订阅state的变化，
    * 通过`store.dispatch`分发action
    * 当state变化时调用组件setState，重新render组件

[redux-thunk](https://github.com/reduxjs/redux-thunk/blob/master/src/index.js)的原理是：在中间件中判断action的类型，如果是函数，则将dispatch和getState传入，并在该action中由用户手动dispatch事件枚举值；否则直接调用next


## 服务端渲染SSR
参考
* https://juejin.im/post/5d1fe6be51882579db031a6d