React中的一些核心实现
===

本文并非按照代码运行流程解析相关源码，而是按照常用的API去了解源码中的实现，因此章节阅读顺序可以随意切换。

## 快速浏览react API

参考：[React顶层API](https://zh-hans.reactjs.org/docs/react-api.html)

为了便于理解源码，我们需要大致了解下面API及其使用

[ref](https://zh-hans.reactjs.org/docs/refs-and-the-dom.html)提供了访问DOM节点或组件实例的方式

* 可以用于集成第三方库、绕开`props`与子节点通信等
* 使用方式：通过`React.createRef`创建Refs，将其赋给子节点的ref属性，在挂载之后可以通过`ref.current`访问
* 如果需要把子组件的ref暴露给父组件，可以通过`React.forwardRef`使用[refs转发](https://zh-hans.reactjs.org/docs/forwarding-refs.html)

[Fragments](https://zh-hans.reactjs.org/docs/fragments.html)允许在render函数或函数组件中返回子组件列表，而非单个子组件
* 无需向DOM中添加额外的子节点
* 使用方式：`<React.Fragment></React.Fragment>` 或更简单的`<></>`包裹子组件列表

[Portal](https://zh-hans.reactjs.org/docs/portals.html)，提供了一种将子节点渲染到存在于父组件以外的 DOM 节点的方案，

* 可以用来实现全局弹窗组件等需求
* 使用方式：在render方法中返回`ReactDOM.createPortal(child, container)`

[Hooks](https://zh-hans.reactjs.org/docs/hooks-intro.html)可以让开发者在不编写 class 的情况下使用 state 以及其他的 React 特性
* 继**高阶组件**、**render props**之后，一种更方便的在组件之间重用状态逻辑的方案
* 使用方式：使用`useState`、`useEffect`等内置Hook，支持自定义Hook

[Context](https://zh-hans.reactjs.org/docs/context.html)提供了一种无须通过props直接在组件树之间进行数据传递的方式
* 可以在多个组件之间使用全局数据，如主题、偏好设置等
* 使用方式：通过`React.createContext`创建上下文`context`，然后使用`<context.Provider>`组件提供数据，在子组件中通过指定`static contextType`属性或者`<context.Consumer>`组件，访问到上下文数据                        

## 类组件生命周期
参考：
* [组件的生命周期](https://zh-hans.reactjs.org/docs/react-component.html#the-component-lifecycle)
* [React生命周期图谱](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)

### beginWork阶段

在之前的源码分析中我们了解到, 在`beginWork`方法中会根据`fiber.tag`判断对应子节点的类型，如果是`ClassComponent`，则调用`updateClassComponent`

```js
// 为了方便理解，下面方法移除了大量代码
function updateClassComponent(){
  const instance = workInProgress.stateNode;
  if (instance === null) {
    // 初始化
    constructClassInstance();
    mountClassInstance();
  } else if (current === null) {
    // 当unitOfWork.alternate为null
    shouldUpdate = resumeMountClassInstance();
  } else {
    // 直接更新
    shouldUpdate = updateClassInstance();
  }
	// 如果shouldUpdate为false，则不会重新渲染
  return finishClassComponent(shouldUpdate)
}
```

接下来看看初始化时的生命周期函数调用顺序。

```js
function constructClassInstance(){
  const instance = new ctor(props, context);
  adoptClassInstance(workInProgress, instance); // 将instance挂载到workInProgress.stateNode
}
function mountClassInstance(){
  const instance = workInProgress.stateNode;
  instance.props = newProps;
  instance.state = workInProgress.memoizedState;
  instance.refs = emptyRefsObject;

  workInProgress.updateQueue !== null && processUpdateQueue()

  // 调用static getDerivedStateFromProps 生命周期函数
  const getDerivedStateFromProps = ctor.getDerivedStateFromProps;
  getDerivedStateFromProps && applyDerivedStateFromProps()

  // 当未使用新的生命周期函数时，作为补丁，则会调用旧的生命周期函数componentWillMount
  if (
    typeof ctor.getDerivedStateFromProps !== 'function' &&
    typeof instance.getSnapshotBeforeUpdate !== 'function' &&
    (typeof instance.UNSAFE_componentWillMount === 'function' ||
      typeof instance.componentWillMount === 'function')
  ) {
     callComponentWillMount(workInProgress, instance);
     workInProgress.updateQueue !== null && processUpdateQueue()
  }
}
// 开始调用render方法获取子节点，然后构建新的fiber树
function finishClassComponent(){
  const instance = workInProgress.stateNode;
  let nextChildren = instance.render();
  reconcileChildren()
  return workInProgress.child;
}
```

#### getDerivedStateFromProps

从源码可以看出，在`getDerivedStateFromProps`接收nextProps和当前的state，并返回新的state
```js
function applyDerivedStateFromProps(){
  const partialState = getDerivedStateFromProps(nextProps, prevState);
  const memoizedState =
    partialState === null || partialState === undefined
      ? prevState
      : Object.assign({}, prevState, partialState);
  workInProgress.memoizedState = memoizedState;
}
```
可见该方法的作用是:让组件在 props 变化时更新 state。

参考官方提供的这篇文档:[什么时候使用派生 state](https://zh-hans.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#when-to-use-derived-state)


注意该钩子为静态方法，也就是说不能在其中通过this获得组件实例。

#### componentWillMount(将废弃)

注意只有当未调用新的生命周期函数时，才会调用componentWillMount

```js
function callComponentWillMount(workInProgress, instance) {
  const oldState = instance.state;
  instance.componentWillMount && instance.componentWillMount(); // 调用componentWillMount

  if (oldState !== instance.state) {
    classComponentUpdater.enqueueReplaceState(instance, instance.state, null);
  }
}
```
可以看见该方法主要是执行了componentWillMount钩子函数，如果在其中显式修改了`this.state`的指向，则相当于调用了`this.setState`方法

#### componentWillReceiveProps(将废弃)

回到前面的`updateClassComponent`中，如果不是初始化

>  当节点未挂载时，则调用`resumeMountClassInstance`

```js
function resumeMountClassInstance(){
	const instance = workInProgress.stateNode;
  // 只有未使用新的生命周期函数时
  if (!hasNewLifecycles && instance.componentWillReceiveProps){
     // 新旧props不相同
     if (oldProps !== newProps || oldContext !== nextContext) {
       // 调用组件的componentWillReceiveProps方法
      callComponentWillReceiveProps();
    }
  }
   // 调用applyDerivedStateFromProps方法
  ctor.getDerivedStateFromProps && applyDerivedStateFromProps();
  
  const shouldUpdate = 
        checkHasForceUpdateAfterProcessing() ||  // 判断是否是forceUpdate
        checkShouldComponentUpdate(); // 调用组件的 instance.shouldComponentUpdate
  if(shouldUpdate){
    	// 调用componentWillMount
     !hasNewLifecycles && instance.componentWillMount();
  }
}
```

首先调用了`componentWillReceiveProps`，然后在非强制更新的情况下调用`checkShouldComponentUpdate`检测是否需要更新，如果需要，再调用`componentWillMount`

> 当节点只需要更新时，调用`updateClassInstance`

```js
function updateClassInstance(){
	const instance = workInProgress.stateNode;
  if (!hasNewLifecycles && instance.componentWillReceiveProps) {
     if (oldProps !== newProps || oldContext !== nextContext) {
      callComponentWillReceiveProps();
    }
  }
  // 调用applyDerivedStateFromProps方法
  ctor.getDerivedStateFromProps && applyDerivedStateFromProps();
  
  const shouldUpdate = 
        checkHasForceUpdateAfterProcessing() ||  // 判断是否是forceUpdate
        checkShouldComponentUpdate(); // 调用组件的 instance.shouldComponentUpdate
  if(shouldUpdate){
    // 调用componentWillUpdate
    !hasNewLifecycles && instance.componentWillUpdate();
  }
}
```

可以看见与上面的`resumeMountClassInstance`相比，除了`shouldUpdate`为true时调用的是`componentWillUpdate`之外，其余流程基本类似。

#### shouldComponentUpdate

在非强制更新时，上面两个方法都调用了`shouldComponentUpdate`

```js
function checkShouldComponentUpdate(
	const instance = workInProgress.stateNode;
  if(instance.shouldComponentUpdate) {
     const shouldUpdate = instance.shouldComponentUpdate(
      newProps,
      newState,
      nextContext,
    );
    return shouldUpdate;
  }	
	if (ctor.prototype && ctor.prototype.isPureReactComponent) {
		return (
      !shallowEqual(oldProps, newProps) || !shallowEqual(oldState, newState)
    );
  }
	return true
}
```

可以看见其内部，优先调用组件`shouldComponentUpdate`方法，如果是`PureReactComponent`，则进行浅比较，最终返回`shouldUpdate`。在后续的`finishClassComponent`方法中，如果传入的`shouldUpdate`为false，则不会重新渲染组件。

```js
function finishClassComponent(){
  if (!shouldUpdate && !didCaptureError) {
    return bailoutOnAlreadyFinishedWork();
  }
}
```

#### 注意事项

引入了Fiber之后，如果`renderRoot`方法是传入了异步调用参数，则在上面提到的、在`commit`之前的所有生命周期函数都可能会被调用多次，程序就可能不会按照开发者预期的流程运行。

### commit阶段

当fiber树构建完毕之后，会进入`commit`阶段，之前分析过`commitRoot`的大致流程

在`commitRootImpl`方法中提交更新任务，可以分为如下三个阶段

```js
function commitRoot(){
   runWithPriority(ImmediatePriority, commitRootImpl.bind(null, root));
}
function commitRootImpl(){
  let firstEffect = finishedWork // 获取需要提交的列表
  
  // before mutation 阶段
  nextEffect = firstEffect; // nextEffect是一个全局变量
  do {
    commitBeforeMutationEffects();
  } while (nextEffect !== null);
  
  // mutation阶段
  nextEffect = firstEffect;
  do {
    commitMutationEffects();
  } while (nextEffect !== null);

  // layout阶段
  nextEffect = firstEffect;
  do {
    commitLayoutEffects(root, expirationTime);
  } while (nextEffect !== null);

  nextEffect = null;
  requestPaint(); // 告诉调度器可以开始绘制下一帧

  onCommitRoot(finishedWork.stateNode, expirationTime);
  flushSyncCallbackQueue();
}
```
#### getSnapshotBeforeUpdate

在`commitBeforeMutationEffects`阶段，会根据`nextEffect.effectTag`来判断，如果`(nextEffect.effectTag & Snapshot) !== NoEffect`，则调用`commitBeforeMutationEffectOnFiber`

```js
// commitBeforeMutationEffectOnFiber，根据`finishedWork.tag`调用对应节点的方法，如果是`ClassComponent`
if (finishedWork.effectTag & Snapshot) {
  // 当更新时调用getSnapshotBeforeUpdate
  if (current !== null) {
    const snapshot = instance.getSnapshotBeforeUpdate(
      finishedWork.elementType === finishedWork.type
        ? prevProps
        : resolveDefaultProps(finishedWork.type, prevProps),
      prevState,
    );
    instance.__reactInternalSnapshotBeforeUpdate = snapshot;
  }
}
```

可以看见`getSnapshotBeforeUpdate`在commit的`before mutation`阶段调用，它使得组件能在发生更改之前从 DOM 中捕获一些信息。

#### componentDitMounted、componentDidUpdate

在`commitLayoutEffects`阶段，会根据`nextEffect.effectTag`来判断，如果是

* `effectTag & (Update | Callback)`，则调用`commitLayoutEffectOnFiber`，即`commitLifeCycles`
* `effectTag & Ref`，则调用`commitAttachRef`

```js
// commitLifeCycles，根据`finishedWork.tag`调用不同类型节点的方法，当其为`ClassComponent`时
const instance = finishedWork.stateNode;
// 如果有更新
if (finishedWork.effectTag & Update) {
    if (current === null) {
        // 初始化时调用componentDidMount
        instance.componentDidMount();
    } else {
        const prevState = current.memoizedState;
        // 更新时调用componentDidUpdate
        instance.componentDidUpdate(
            prevProps,
            prevState,
          	// 该字段是上面getSnapshotBeforeUpdate钩子的返回值
            instance.__reactInternalSnapshotBeforeUpdate
        );
    }
}
const updateQueue = finishedWork.updateQueue;
commitUpdateQueue(updateQueue)
```

可见初始化时调用的是`componentDidMount`钩子，后续更新时调用的是`componentDidUpdate`。

碰巧看见了`commitAttachRef`，我们顺道看看ref是如何挂载的

```js
function commitAttachRef(finishedWork: Fiber) {
  const ref = finishedWork.ref;
  if (ref !== null) {
    // 获取节点的实例，DOM节点为实际元素，类组件为组件实例
    const instance = finishedWork.stateNode;
    let instanceToUse = instance;
    if (typeof ref === 'function') {
      // ref={(el)=>{this.xxx = el}}形式的ref
      ref(instanceToUse);
    } else {
      // React.createRef形式的ref
      ref.current = instanceToUse;
    }
  }
}
```

初始化时可以通过ref获取子节点的引用，在后续的声明周期如`getSnapshotBeforeUpdate`中，可以通过ref获取DOM节点，并获取该节点在发生变化之前的信息（如滚动位置等）

#### componentWillUnmount

在Commit过程的`mutation`阶段，调用`commitMutationEffects`，根据`effectTag`判断实际的改动

* `Placement`，调用`commitPlacement`插入节点
* `PlacementAndUpdate`，调用`commitPlacement`和`commitWork`
* `Update`，调用`commitWork`更新容器
* `Deletion`，调用`commitDeletion`删除节点，此处会调用卸载`Unmount`函数

```js
function commitDeletion(current: Fiber): void {
  // 实际上ReactDOM中调用的是unmountHostComponents，将DOM从父节点移除，
  // 其内部调用commitNestedUnmounts
  commitNestedUnmounts(current);
  // 清空fiber的相关引用，准备释放
  detachFiber(current);
}
function commitNestedUnmounts(root: Fiber): void {
  let node: Fiber = root;
  while (true) {
    // 依次调用commitUnmount
    commitUnmount(node);
    // node遍历顺序 root->子节点->兄弟节点->父节点
  }
}
function commitUnmount(current: Fiber): void {
  if(current.tag === ClassComponent){
    // 清除ref
    safelyDetachRef(current);
    const instance = current.stateNode;
    // 调用componentWillUnmount方法
    if (typeof instance.componentWillUnmount === 'function') {
      safelyCallComponentWillUnmount(current, instance);
    }
    return;
  }
}
```

`instance.componentWillUnmount`会在组件卸载及销毁之前直接调用，该钩子函数主要用于执行一些清除操作，如计数器、网络请求、事件订阅等。



## setState批量更新

参考：

- [你真的了解setState吗](https://juejin.im/post/5b45c57c51882519790c7441)



每次`setState`都会重新渲染子树。如果你想提高性能，就尽量在低层次结构中调用`setState`或者使用`shouldComponentUpdate`去阻止渲染很大的子树。

之前在整理`ReactDOM.render`方法时了解到，在初始化时`legacyRenderSubtreeIntoContainer`方法内部调用的是

```js
unbatchedUpdates(() => {
	updateContainer(children, fiberRoot, parentComponent, callback);
});
```

这里我们来看看`unbatchedUpdates`方法的作用，可见其内部只是将全局变量`executionContext`设置为了

```js
export function unbatchedUpdates<A, R>(fn: (a: A) => R, a: A): R {
  const prevExecutionContext = executionContext;
  executionContext &= ~BatchedContext;
  executionContext |= LegacyUnbatchedContext;
  try {
    return fn(a);
  } finally {
    executionContext = prevExecutionContext;
    if (executionContext === NoContext) {
      // Flush the immediate callbacks that were scheduled during this batch
      flushSyncCallbackQueue();
    }
  }
}
```



我们可以回顾一下`setState`的执行流程

```
this.setState() 
this.updater.enqueueSetState

this.updater = classComponentUpdater
```

搜索`executionContext`，找到赋值为`BatchedContext`的地方

### 小结

在合成事件和钩子函数中，React会通过一个

* `setState` 只在合成事件和钩子函数中是“异步”的，在原生事件和 `setTimeout` 等异步队列中中都是同步的。

## React中的事件

参考：
* [合成事件-React官方文档](https://zh-hans.reactjs.org/docs/events.html)
* [React事件机制](https://www.jianshu.com/p/c01756e520c7)

### 事件注册

在前面的整理中我们知道了DOM节点的初始化流程，主要经过下面步骤
* 调用`renderRoot`方法渲染根节点，内部调用`performUnitOfWork`->`completeUnitOfWork`->`completeWork`
* 在`completeWork`中，根据当前正在运行的`workInProgress.tag`来选择对应的运行逻辑，如果是`HostComponent`
  * 调用`createInstance`来创建DOM对象，接着在`finalizeInitialChildren`方法中调用`setInitialProperties`来获取需要初始化的属性`nextProps`，实际上即为JSX在标签上解析的相关属性
  * 然后调用在`setInitialDOMProperties`，并遍历`nextProps`上的字段，根据不同的字段类型做对应处理，如`dangerouslySetInnerHTML`、`children`和事件名等，这里我们暂时只需要关注事件属性的处理
  * 如果节点上包含事件属性，则调用`ensureListeningTo(rootContainerElement, propKey)`
    * 通过`listeningSet`集合，保证多个节点的相同事件名只会在document上注册一次
    * 事件的注册是在`trapEventForPluginEventSystem`方法中完成的，内部会根据事件名确认事件优先级，然后实现对应的事件处理函数如` listener = dispatchEvent.bind(null, topLevelType, PLUGIN_EVENT_SYSTEM)`
* 最后将对应事件名和事件处理函数注册在根节点`document`上，完成事件委托

### 事件分发

前面我们知道了所有的事件类型都被注册在document上，现在来整理一下事件触发时的运行流程，以`click`为例，
* 点击文档时，将触发事件处理函数，此时将获取原始的事件对象`nativeEvent`和事件类型，根据`nativeEvent.target`可以获取对应的`targetInst`，及该DOM节点对应的`Fiber Node`
* 根据事件类型和原始事件，调用`possiblePlugin.extractEvents`初始化一个合成事件`event`
  * 调用`EventConstructor.getPooled`获取事件对象
    * 如果事件池有剩余的事件对象，则取出并根据原始事件修改属性
    * 如果事件池无可用的事件对象，则初始化一个合成事件对象
  * 调用`accumulateTwoPhaseDispatchesSingle`获取事件处理函数
    * 从`targetInst`开始，向上遍历父节点，填充事件传递的path，越靠后的节点越顶层
    * 从后向前遍历节点，触发`captured`，然后获取节点props的`on...Capture`属性作为事件处理函数，如果存在，则将其保存在`event._dispatchListeners`
    * 从前向后遍历节点，触发`bubbled`，然后获取节点props的`on...`属性作为事件处理函数，如果存在，则同样将其保存在`event._dispatchListeners`
    * 注意当前`event._dispatchListeners`可能保存了多个节点的事件处理函数
* 然后在`executeDispatchesAndRelease`方法中执行事件处理函数
  * 依次调用事件处理函数列表，先捕获后冒泡，并将合成事件`event`作为参数传递给事件处理函数
  * 事件函数处理完毕，判断合成事件是否可回收，如果可回收，则将其放回事件池，留作下次使用


## React性能优化

从源码中我们可以发现下面几个优化点

### 代码分割
`React.lazy`函数能让你像渲染常规组件一样处理动态引入（的组件）,`Suspense`可以用于等待异步组件加载的展示


### 合并渲染 

在UI变化中，不必立即触发每个更新，比如在极短的时间内页面状态`A->B->C`，那更新状态B就导致性能浪费。

可以说，setState是对单个组件的合并渲染，batchedUpdates是对多个组件的合并渲染。合并渲染是React最主要的优化手段。

### 减少渲染次数

#### React.memo

如果函数组件在给定相同 props 的情况下渲染相同的结果，那么可以通过将其包装在 [React.memo](https://zh-hans.reactjs.org/docs/react-api.html#reactmemo) 中调用

#### shouldComponentUpdate
在 shouldComponentUpdate() 中根据当前 state 或 props 判断是否需要调用render方法来重新渲染子节点。

https://zh-hans.reactjs.org/docs/react-component.html#shouldcomponentupdate

#### PureComponent

 React.Component 并未实现 shouldComponentUpdate()，而 React.PureComponent 中以浅层对比 prop 和 state 的方式来实现了该函数。

`PureComponent`并未实现 `shouldComponentUpdate`方法，只是对props和state进行浅比较，可以结合使用`Immutable.js`来创建不可变对象，通过它来简化对象比较，提高性能。

## Hooks实现原理

在`updateFunctionComponent`中，调用的是`renderWithHooks`返回子节点

## 全局Context