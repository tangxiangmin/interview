React
===
参考

* [《React设计模式与最佳实践》读书笔记](https://www.shymean.com/article/%E3%80%8AReact%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%E4%B8%8E%E6%9C%80%E4%BD%B3%E5%AE%9E%E8%B7%B5%E3%80%8B%E8%AF%BB%E4%B9%A6%E7%AC%94%E8%AE%B0)

主要需要掌握下面知识点

* Virtual DOM，JSX, React.createElement
* 组件组件生命周期
* Fiber、diff算法
* React-Router
* 状态管理`Flux`、`Redux`和`react-redux`、`redux-saga`、`Mobx`


## 虚拟DOM优缺点
优点
* 避免手动操作DOM节点，提高开发效率
* 通过diff可以保证性能下限
* 跨平台，虚拟DOM是UI的抽象，与平台无关，可以用于SSR、小程序和Native平台

缺点
* 额外的计算，增加内存消耗，在某些追求性能极致的地方比不上手动操作DOM


## Class组件的生命周期
参考： [React源码分析 生命周期](./React源码分析.md#类组件生命周期)

从横向看，react 分为三个阶段：
* 创建时
  * constructor() - 类构造器初始化，可用于初始化state
  * static getDerivedStateFromProps() - 组件初始化时主动触发
  * render() - 递归生成虚拟 DOM
  * componentDidMount() - 完成首次 DOM 渲染，组件挂载后触发，表示组件及其所有子组件被正确渲染
* 更新时
  * static getDerivedStateFromProps() - 每次 render() 之前执行
  * shouldComponentUpdate() - 校验是否需要执行更新操作，可以通过该函数决定是否重新执行渲染
  * render() - 递归生成虚拟 DOM
  * getSnapshotBeforeUpdate() - 在渲染真实 DOM 之前
  * componentDidUpdate() - 完成 DOM 渲染，将在渲染完成后在每个重新渲染周期中被触发
* 卸载时
  * componentWillUnmount() - 组件销毁之前被直接调用

官方计划在React17版本中移除之前版本中componentWillMount、componentWillReceiveProps、componentWillUpdate三个钩子

## Fiber
之前的递归diff会导致长时间占用浏览器线程，在此期间用户交互无法得到反馈。

Fiber 把当前需要执行的任务分成一个个子任务，安排优先级，然后依次处理，每过一段时间（非常短，毫秒级）就会暂停当前的任务，查看有没有优先级较高的任务，然后暂停（也可能会完全放弃）掉之前的执行结果，跳出到下一个子任务。同时 Fiber 还做了一些优化，可以保持住之前运行的结果以到达复用目的。

所谓高优先级的任务指的是可能会影响用户体验的任务，因此从宏观上来看，尽管不停的检查切换状态可能会带来性能损耗，但提高了用户的流畅体验，不会造成浏览器卡死。基于这个原因，
* 在React能够知道的运行上下文中（如合成事件和生命周期函数中）是“异步”的，
* 而在在原生事件和setTimeout 中由于无法知道当前运行上下文，为了保证视图正确性，都是同步的。

> React 在哪个阶段发起 XhrHttpRequest 比较合适？

React 下一代调和算法 Fiber 会通过开始或停止渲染的方式优化应用性能，其会影响到 componentWillMount 的触发次数。对于 componentWillMount 这个生命周期函数的调用次数会变得不确定，React 可能会多次频繁调用 componentWillMount。如果我们将 AJAX 请求放到 componentWillMount 函数中，那么显而易见其会被触发多次，自然也就不是好的选择。

在后续的版本中，上面提到的生命周期函数可能会被移除。


## 合成事件
参考：[合成事件](https://zh-hans.reactjs.org/docs/events.html)

事件处理函数接收到的 SyntheticEvent 是合并而来。这意味着 SyntheticEvent 对象可能会被重用，而且在事件回调函数被调用后，所有的属性都会无效。出于性能考虑，你不能通过异步访问事件（除非先使用`event.persist()`将事件从池中移除）

## 组件封装

### 组件通信
* 父子组件: prop + 回调
* 兄弟组件: 状态提升到公共父组件
* 跨级通信: Context
* eventBus
* 复杂业务，全局状态管理

### 一些内置接口及组件
* ref:提供了访问DOM节点或组件实例的方式
* Fragments:允许在render函数或函数组件中返回子组件列表，而非单个子组件
* Portal:供了一种将子节点渲染到存在于父组件以外的 DOM 节点的方案

## 组件/逻辑复用

### 高阶组件

通过高阶组件进行属性代理和反向继承

属性代理可以为组件传入一些公共的props，进而复用相关逻辑
```jsx
let loading = {
    show(){},
    hide(){}
}
const addLoading = (Comp)=>{
    reaturn <Comp {...loading}/>
}
```


反向继承可以实现拦截生命周期、state、渲染过程等需求，参考[react反向继承注意点](https://www.jianshu.com/p/49e3516a710b)

```jsx
class Button1 extends Component {
  componentDidMount() {
    console.log("didMount1");
  }
  render() {
    console.log("render1");
    return <button />;
  }
}

// 高阶组件函数
const Hoc = WrappedComponent => {
  return class extends WrappedComponent {
    state = {
      num: 0
    };
    componentDidMount() {
      // 修改劫持了WrappedComponent的同名生命周期函数
      console.log("didMountHoc");
    }
    render() {
        return super.render()
    }
  };
};
```

高阶组件也存在一些缺点
* 会导致组件嵌套很深, 对于单个属性难以溯源，且存在属性覆盖问题
* ref透传问题，可以通过`React.forwardRef`解决



### 渲染属性
参考：[render props 官方文档](https://zh-hans.reactjs.org/docs/render-props.html#___gatsby)

> render prop 是一个用于告知组件需要渲染什么内容的函数 prop，可以解决高级组件存在的问题

类似于slot的概念，可以在父组件中子组件中特定的渲染逻辑，在子组件中可以调用该方法并传入子组件的state，并将返回值插入到组件树中

缺点在于
* 使用比较麻烦，存在函数嵌套的问题


### React Hooks
`hooks` 让函数式组件拥有 `state` 和类生命周期这两个功能

参考
* [一篇文章理解React Hooks](https://zhuanlan.zhihu.com/p/50597236)
* [官方文档](https://zh-hans.reactjs.org/docs/hooks-intro.html)
* https://segmentfault.com/a/1190000016950339
* https://www.jianshu.com/p/ecc6280f31b9

为什么要使用Hooks？Hook实现state组件之间的状态逻辑复用
* 通过render props或者高阶组件，会导致组件嵌套很深
* 函数式组件方便测试，但由于需求的变更可能导致我们需要将其改写class组件
* class组件的this需要很小心使用

Hook的使用点
* Hook 将组件中相互关联的部分拆分成更小的函数（比如设置订阅或请求数据），从而实现状态复用
* Hook 是一些可以让你在函数组件里“钩入” React state 及生命周期等特性的函数
* Hook 允许我们按照代码的用途分离他们，而不是按照生命周期将不同作用的代码堆积到同一个生命周期函数中

```jsx
import React, { useState } from "react";

function Example() {
    // 声明一个新的叫做 “count” 的 state 变量
    const [count, setCount] = useState(0);

    return (
        <div>
            <p>You clicked {count} times</p>
            <button onClick={() => setCount(count + 1)}>Click me</button>
        </div>
    );
}
```
React 假设当你多次调用 useState 的时候，你能保证每次渲染时它们的调用顺序是不变的。这一点十分重要!!

* [`useState`](https://zh-hans.reactjs.org/docs/hooks-state.html)相当于为函数组件添加了state
* `useEffect`相当于在告诉 React 在完成对 DOM 的更改后运行你的“副作用”函数，使用Hook可以把组件内相关的副作用组织在一起
* `useContext`订阅React的Context
* `useReducer`通过 reducer 来管理组件本地的复杂 state
* 更多API用法可以参考[Hook API](https://zh-hans.reactjs.org/docs/hooks-reference.html)

Hook使用注意事项：
* 只能在函数最外层调用 Hook。不要在循环、条件判断或者子函数中调用，这是因为React需要我们保证每次渲染时Hook的调用顺序相同
* 只能在 React 的函数组件和自定义的 Hook 中调用 Hook，不要在其他 JavaScript 函数中调用

每次渲染时都调用`userEffect`可能会导致性能消耗，可以传入指定的props和state，仅当指定属性发生变化时才会调用effect
```js
useEffect(() => {
  document.title = `You clicked ${count} times`;
}, [count]); // 仅在 count 更改时更新
```

自定义Hook指的是封装了`useState`和`useEffect`的方法，约定以`use`开头。需要注意，Hook复用的是状态逻辑而不是state，每次调用会返回新一个新的state。自定义Hook最主要的作用是：可以将组件逻辑提取到可重用的函数中。
* 自定义 Hook 是一个函数，其名称以 “use” 开头，函数内部可以调用其他的 Hook
* 自定义 Hook 是一种自然遵循 Hook 设计的约定，而并不是 React 的特性。

## 状态管理
* [理解数据状态管理](https://www.shymean.com/article/%E7%90%86%E8%A7%A3%E6%95%B0%E6%8D%AE%E7%8A%B6%E6%80%81%E7%AE%A1%E7%90%86)

如果应用比较大，可能会存在很多跨组件跨页面通信的场景，基本的prop、context和eventBus等可能导致代码难以维护和调试，
* prop一层层透传，难以维护
* context局限于祖先组件和后代组件
* eventBus需要手动订阅和解绑

在这种时候，我们可能需要全局的状态管理工具。状态管理将组件与组件之间的关系解耦为数据与数据之间的关系，组件仅仅作为数据渲染的容器而已。

### redux
redux的使用流程：
* 定义相关的action
* 实现一个reducer，并在其中根据action返回对应的state
* 根据reducer创建一个全局唯一的store，在UI层通过
    * `store.subscribe`订阅state的变化，
    * 通过`store.dispatch`分发action
    * 当state变化时调用组件setState，重新render组件

[redux-thunk](https://github.com/reduxjs/redux-thunk/blob/master/src/index.js)的原理是：在中间件中判断action的类型，如果是函数，则将dispatch和getState传入，并在该action中由用户手动dispatch事件枚举值；否则直接调用next

[Redux-Saga](https://redux-saga-in-chinese.js.org/)使用了 ES6 的 Generator 功能，让redux中异步流程更易于读取，写入和测试

### Mobx
参考：
* [Mobx 文档](https://cn.mobx.js.org/intro/overview.html)
* [选择Redux还是Mobx](https://juejin.im/post/5a7fd72c5188257a766324ae)

Mobx使用简单直观的方式来完成数据的流转及数据的更新



## 组件性能优化

对于组件性能优化最重要的点就是减少重新 render 的次数，避免不必要的更新

### 合并渲染 

在UI变化中，不必立即触发每个更新，比如在极短的时间内页面状态`A->B->C`，那更新状态B就导致性能浪费。

可以说，`setState`是对单个组件的合并渲染，`batchedUpdates`是对多个组件的合并渲染。合并渲染是React最主要的优化手段，这在Fiber 源码中已经实现。

我们需要注意的是正确使用setState，理解setState合并更新的原理。


### 代码分割
`React.lazy`函数能让你像渲染常规组件一样处理动态引入（的组件）,`Suspense`可以用于等待异步组件加载的展示

### 减少渲染次数

**React.memo**

如果函数组件在给定相同 props 的情况下渲染相同的结果，那么可以通过将其包装在 [React.memo](https://zh-hans.reactjs.org/docs/react-api.html#reactmemo) 中调用

**shouldComponentUpdate**

在 shouldComponentUpdate() 中根据当前 state 或 props 判断是否需要调用render方法来重新渲染子节点。

https://zh-hans.reactjs.org/docs/react-component.html#shouldcomponentupdate

**PureComponent**

 React.Component 并未实现 shouldComponentUpdate()，而 React.PureComponent 中以浅层对比 prop 和 state 的方式来实现了该函数。

`PureComponent`并未实现 `shouldComponentUpdate`方法，只是对props和state进行浅比较，可以结合使用`Immutable.js`来创建不可变对象，通过它来简化对象比较，提高性能。

## 服务端渲染SSR
参考
* [彻底理解服务端渲染原理](https://juejin.im/post/5d1fe6be51882579db031a6d)
* [将博客重构为SSR渲染](https://www.shymean.com/article/%E5%B0%86%E5%8D%9A%E5%AE%A2%E9%87%8D%E6%9E%84%E4%B8%BASSR%E6%B8%B2%E6%9F%93)