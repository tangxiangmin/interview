---
title: 重新阅读Vue源码
tags:
---

最近一直在折腾React源码，后来发现有必要重新阅读Vue的源码，从设计思想和底层实现上了解两种框架的差异，因此有了这一篇文章。

<!--more-->

本文将从`new Vue`开始，分析实例化Vue组件的过程中发生的事情，然后着重分析Vue中几个比较核心的概念

* 响应式系统
* 虚拟DOM与diff算法
* 组件系统

## new Vue

一个Vue项目是从`new Vue`开始的

```js
function Vue (options) {
  this._init(options)
}
Vue.prototype._init = function (options?: Object) {
    const vm: Component = this
    vm._uid = uid++
    vm._isVue = true
    // 合并options
    if (options && options._isComponent) {
      initInternalComponent(vm, options)
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      )
    }
  
    vm._self = vm
    initLifecycle(vm)
    initEvents(vm)
    initRender(vm)
    callHook(vm, 'beforeCreate')
    initInjections(vm) // resolve injections before data/props
    initState(vm) // 处理props、methods、data、computed、watch等配置
    initProvide(vm) // resolve provide after data/props
    callHook(vm, 'created')
  	
    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
```

可以看见，实例化一个Vue组件的时候，调用`this._init`进行初始化，其中最重要的应该是`initState(vm)`方法

```js
export function initState (vm: Component) {
  vm._watchers = []
  const opts = vm.$options
  if (opts.props) initProps(vm, opts.props)
  if (opts.methods) initMethods(vm, opts.methods)
  if (opts.data) {
    // 通过Object.defineProperty设置data参数属性setter与getter函数，实现监听数据的变化
    initData(vm)
  } else {
    observe(vm._data = {}, true /* asRootData */)
  }
  if (opts.computed) initComputed(vm, opts.computed)
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch)
  }
}
```

Vue的监听`options.data`的变化，就是在`initData`中实现的

```js
function initData (vm: Component) {
  let data = vm.$options.data
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {}
  // proxy data on instance
  const keys = Object.keys(data)
  const props = vm.$options.props
  const methods = vm.$options.methods
  // ...实现数据代理
  let i = keys.length
  while (i--) {
    const key = keys[i]
    // 判断key是否是以$或_开头的保留字符
    if (!isReserved(key)) {
      // 实现数据代理
      proxy(vm, `_data`, key)
    }
  }
  // observe data
  observe(data, true /* asRootData */)
}
```

在`observe`中，通过劫持`data`的每个属性的访问描述符来实现监听数据的变化，且通过闭包为每个属性维护了一个`Dep`对象，用于收集依赖。详情可以参考下面的[核心概念：响应式系统](#核心概念：响应式系统)。

**vm.$mount**

在`$mount`中首先会判断`options.render`是否存在，`render`函数返回的实际上就是一个vnode节点

```js
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && query(el)

  const options = this.$options
  // 如果没有提供render方法，则需要将template编译为render
  if (!options.render) {
    let template = options.template
    // ... 获取template模板
    if (template) {
      // 将template编译为render
      const { render, staticRenderFns } = compileToFunctions(template, {
        outputSourceRange: process.env.NODE_ENV !== 'production',
        shouldDecodeNewlines,
        shouldDecodeNewlinesForHref,
        delimiters: options.delimiters,
        comments: options.comments
      }, this)
      options.render = render
      options.staticRenderFns = staticRenderFns
    }
  }
  return mount.call(this, el, hydrating)
}

function mount(el?: string | Element, hydrating?: boolean): Component {
  el = el && inBrowser ? query(el) : undefined
  return mountComponent(this, el, hydrating)
}
```

如果传入的是`template`模板而不是`render`函数，则会调用`compileToFunctions`进行模板编译

- parse，通过正则解析模板，生成AST
- optimize，优化AST，包括标记静态节点，为后续path操作提供优化基础
- generate，将AST转换成渲染函数

这一步应该是Vue源码中最复杂的部分之一，相当于实现了一个模板编译器。但是，这一步并不是必须的，出于性能考虑，在某些时刻(如使用单页面组件时)会提前将模板编译为`render`函数。

**mountComponent**

在确保render已经存在之后，就会调用`mountComponent`。

```js
export function mountComponent (
  vm: Component,
  el: ?Element,
  hydrating?: boolean
): Component {
  vm.$el = el
  callHook(vm, 'beforeMount')
  let updateComponent = () => {
    vm._update(vm._render(), hydrating)
  }
  // updateComponent作为Watcher的回调传入，在接收到数据变化时由Dep发送的通知后会重新调用updateComponent
  new Watcher(vm, updateComponent, noop, {
    before () {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate')
      }
    }
  }, true /* isRenderWatcher */)
  hydrating = false // 非服务端渲染
  if (vm.$vnode == null) {
    vm._isMounted = true
    callHook(vm, 'mounted')
  }
  return vm
}
```

可以看见在`mountComponent`中，初始化了一个`Watcher`对象，用于订阅数据变化，注册`updateComponent`回调。

由于初始化`Watcher`时，会根据`!watcher.lazy`直接调用一次`updateComponent`，因此可以实现页面的初始化。

`updateComponent`方法也比较简单，

- 首先调用`vm._render`（即前面的）方法获取子节点，
- 然后将其传入`vm._update`中进行更新

**vm._render**

```js
Vue.prototype._render = function (): VNode {
  const vm: Component = this
  const { render, _parentVnode } = vm.$options

  if (_parentVnode) {
    vm.$scopedSlots = normalizeScopedSlots(
      _parentVnode.data.scopedSlots,
      vm.$slots,
      vm.$scopedSlots
    )
  }
  vm.$vnode = _parentVnode
  // render self
  let vnode = render.call(vm._renderProxy, vm.$createElement)
  vnode.parent = _parentVnode
  return vnode
}
```

可见调用的是前面`options.render`方法，并返回对应的vnode。

**vm._update**

在`vm._update`中调用了`vm.__patch__`diff算法，首先将新旧节点进行对比，然后将变化更新到视图上 

```js
Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
  const vm: Component = this
  const prevEl = vm.$el
  const prevVnode = vm._vnode
  vm._vnode = vnode // 将新节点挂载到vm._vnode上，用作下一次比较

  if (!prevVnode) {
    // 初始化渲染，完成视图更新，并将DOM实例保存在$el属性
    vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)
  } else {
    // 数据更新重新渲染
    vm.$el = vm.__patch__(prevVnode, vnode)
  }
}
```

至此基本完成整个组件的构建，详细diff流程可以移步下面的[diff算法](#核心概念：虚拟DOM)。

## 核心概念：响应式系统
Vue的一个重要特点在于其内部自动的数据响应系统：数据变化时将自动更新视图。为了实现这个目标，需要满足：
* 监听到数据变化，JS中可以通过通过`Object.defineProperty`和ES6的proxy
* 在某个数据变化时，能够通知使用了该数据的视图进行变化
    * 依赖收集，为每个数据收集使用了该数据的所有视图
    * 通知变化，能够通知视图进行更新

### 监听数据变化

Vue内部通过`Object.defineProperty`，递归劫持`options.data`属性的`getter`和`setter`访问描述符来监听数据的变化

```js
// 需要监听的数据，
var data = {
    a: 100,
    sub: {
        z: 12
    }
}
// 假装这里是一个需要更新的
function update(val) {
    console.log('update: ', val)
}

function defineReactive(obj, key, val) {
    // 递归监听属性值
    observer(val)
    // 劫持getter和setter
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function () {
            return val
        },
        set: function (newval) {
            val = newval
            update(newval)
        }
    })
}

function observer(obj) {
    if (!obj || typeof obj !== 'object') {
        return;
    }

    Object.keys(obj).forEach(key => {
        defineReactive(obj, key, obj[key])
    })
}

observer(data)

data.a = 1000
data.sub.z = 233 // 嵌套属性也会触发
```

需要注意的是，`Object.defineProperty`存在下面缺点
* 无法检测到对象属性的添加或删除
* 不能监听数组的变化，Vue在内部重写了数组方法的重写

Vue后续可能会使用ES6中Proxy 作为实现数据代理的主要方式，当然二者都需要考虑浏览器兼容问题。

### 依赖收集
之所以要观察数据，其目的在于当数据的属性发生变化时，可以通知使用了该数据的视图进行更新。依赖收集的原因有下面两个：
* 只有当模板中使用的数据发生了变化，才更新对应的视图
* 如果有多个模板使用对应的数据，当数据发生变化时需要更新所有依赖的视图

依赖收集是一个典型的**发布-订阅者模式**：在`get`中进行依赖收集，在`set`中通知相关订阅者。下面是一个最基本的发布-订阅者模型示例代码。其中

* `Dep`作为发布者，用来收集依赖、删除依赖和向依赖发送消息，每一个被劫持的属性都会维持一个`Dep`对象
* `Watcher`作为订阅者，是一个视图更新、$watch注册回调等 进行抽象封装的一个类，当数据更新时，只需要调用watcher.update即可，至于具体执行什么操作，由初始化时注册的`watcher.cb`开始


```js
// 发布者
class Dep {
    constructor() {
        this.subs = []
    }
    addSub(sub) {
        if (!~this.subs.indexOf(sub)) {
            this.subs.push(sub)
        }
    }
    // 收集依赖
    depend() { 
        if(Dep._target){
            this.addSub(Dep._target)
        }
    }
    notify() {
        this.subs.forEach(sub => {
            sub.update()
        })
    }
}
// 观察者
class Watcher {
    constructor(cb){
        Dep._target = this
        this.cb = cb // 每个watcher实例的更新方法
    }
    update(){
        this.cb()
    }
}
```
在Vue中的`defineReactive`中，为每个属性实例化一个`Dep`发布者，然后在`getter`中进行依赖收集：实例化一个订阅者`Watcher`，然后添加到对应属性的发布者`Dep`中。

在该属性`setter`触发时，对应发布者`Dep`就会通知所有的订阅者`Watcher`，然后执行视图的更新。

稍微修改一下defineReactive
```js
function defineReactive(obj, key, val) {
    observer(val)
    let dep = new Dep()
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function () {
            // 在需要订阅数据的地方，会先实例化一个Watcher修改Dep._target的指向
            dep.depend()
            return val
        },
        set: function (newval) {
            val = newval
            // 通知dep的所有订阅者进行更新
            dep.notify()
        }
    })
}
```
在实例化Watcher的时候，会修改`Dep._target`，然后完成依赖收集。

实例化Watcher的时机是在`mountComponent`进行的，其主要目的就是注册视图更新方法`updateComponent`
```js
let updateComponent = () => {
      const name = vm._name
      const id = vm._uid
      const vnode = vm._render()
      vm._update(vnode, hydrating)
}

// 实例Watcher对象，绑定响应式数据
new Watcher(vm, updateComponent, noop, null, true /* isRenderWatcher */)
```

可见每一个Vue组件都有至少一个`Watcher`用于注册并在接收到通知时调用`updateComponent`方法。

### 批量更新

参考[官方文档](https://cn.vuejs.org/v2/guide/reactivity.html#%E5%BC%82%E6%AD%A5%E6%9B%B4%E6%96%B0%E9%98%9F%E5%88%97)

一个组件的Watcher会监听多个属性的变化，如果每个属性的变化都触发一个回调
触发某个数据的 setter 方法后Dep会通知对应的Watcher，实际上Watcher会被 push 进一个队列 queue 中，在下一个 tick 的时候将这个队列 queue 全部拿出来 run一遍。

如果需要在数据变化之后等待 Vue 完成更新 DOM，则需要使用`vm.$nextTick()`接口

在`watcher.update`中，有策略地去决定什么时候调用注册的回调函数：

- 将需要更新的watcher放在一个更新队列中，根据`watcher.id`，同样的watcher只会被放入一次
- 在`nextTick`进行批量更新，触发watcher注册的回调，完成页面的渲染



我们知道，属性变化时会通过对应`Watcher`执行update方法

```js
// Dep.notify
notify () {
  const subs = this.subs.slice()
  // 可以看见这里同步通知Watcher的
  for (let i = 0, l = subs.length; i < l; i++) {
    subs[i].update()
  }
}
// Watcher.update
update () {
  if (this.lazy) {
    this.dirty = true
  } else if (this.sync) {
    // 同步的Watcher将会立即执行注册的回调方法
    this.run()
  } else {
    // 默认的Watcher将会被放入对垒中
    queueWatcher(this)
  }
}
```

在默认情况下，触发`Watcher.update`时，会将当前Watcher推入到一个队列中，而不是直接调用

```js
export function queueWatcher (watcher: Watcher) {
  const id = watcher.id
  // 通过一个hash保证同一个Watcher在一次更新时只会调用一次
  if (has[id] == null) {
    has[id] = true
    if (!flushing) {
      // queue是一个全局的Watcher队里
      queue.push(watcher)
    } else {
      let i = queue.length - 1
      while (i > index && queue[i].id > watcher.id) {
        i--
      }
      // 将watcher按照id插入到正确位置
      queue.splice(i + 1, 0, watcher)
    }
    if (!waiting) {
      waiting = true
      // 在nextTick中调用
      nextTick(flushSchedulerQueue)
    }
  }
}

function flushSchedulerQueue () {
  currentFlushTimestamp = getNow()
  flushing = true
  let watcher, id
  
  // Watcher.id越小，越早初始化，父组件的Watcher总是比子组件的Watcher先初始化
  // 用户自定义的Watcher比视图更新的Watcher要早注册
  queue.sort((a, b) => a.id - b.id)
  // 由于在更新时可能会有新的Watcher插入queue，因此此处不能先缓存queue.length
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index]
    if (watcher.before) {
      watcher.before()
    }
    id = watcher.id
    has[id] = null
    watcher.run() // 执行Watcher注册的回调函数
  }
	// 重置has、waiting、flushing等状态
  resetSchedulerState()
}
```

`nextTick`是一个将`flushSchedulerQueue`放入异步队列中的方法

```js
export function nextTick (cb?: Function, ctx?: Object) {
  // callbacks是一个全局数组，用于保存传入的cb回调
  callbacks.push(() => {
    cb.call(ctx)
  })
  if (!pending) {
    pending = true
    // timerFunc是根据运行环境注册的一个微任务事件，可以理解为setTimeout
    timerFunc()
  }
}
```

### 小结

整个流程大致如下
* 在`new Vue({data, methods})`初始化时，`data`属性会通过Observer转换成了getter/setter的形式，用来追踪数据的变化，并通过闭包为每一个被劫持的属性维护了一个`Dep`发布者
* 在`mountComponent`时，会初始化一个`Watcher`，并设置为`Dep.target`，传入的回调为`updateComponent`
    * `updateComponent`方法内部调用render方法获取vnode，同时初始化一个Watcher订阅者，由于渲染视图会使用data的属性值，因此会触发属性的getter，该字段的Dep对象会将此时的`Dep.target`收集起来
    * Watcher构造函数内部会调用一次`updateComponent`，完成组件的渲染和挂载
* 修改对象属性值时，会触发对应属性的setter，然后对应字段的Dep通过`Dep.notify()`通知所有的订阅者，触发实现注册的回调，完成视图的重新渲染或回调函数执行

## 核心概念：虚拟DOM

渲染函数实际返回的是VNode，它是一个用来映射真实DOM的JavaScript对象。由于VNode不依赖于真实的浏览器环境，因此可以跨平台使用，如weex、Node、浏览器等。

当逻辑操作更新数据时，就会重新渲染视图。为了提高效率，Vue不会把新的VNode完全渲染然后替换旧的VNode内容，而是进行`diff`操作，然后将有差异的DOM进行修改。

关于虚拟DOM和diff算法，可以了解一下这个项目：[snabbdom](https://github.com/snabbdom/snabbdom)。

### createElement

Vue支持多种编写视图的方式：template、单页面组件、直接编写render，其中前两种方式都会被编译成render方法然后调用。render方法实际上就是一个依次调用`createElement`构建虚拟DOM树的函数。

VNode实际上是通过`createElement`方法返回的一个JavaScript对象。组件树就是通过一层一层调用`createElement`返回返回的vnode节点来构建的。

```js
vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true)

export function createElement (
  context: Component,
  tag: any,
  data: any,
  children: any,
  normalizationType: any,
  alwaysNormalize: boolean
): VNode | Array<VNode> {
  // ...格式化参数
  return _createElement(context, tag, data, children, normalizationType)
}

export function _createElement (
  context: Component,
  tag?: string | Class<Component> | Function | Object,
  data?: VNodeData,
  children?: any,
  normalizationType?: number
): VNode | Array<VNode> {
	// 如果存在is属性，则将其作为tag
  if (isDef(data) && isDef(data.is)) {
    tag = data.is
  }
	// ... 省略格式化children

  let vnode, ns
  if (typeof tag === 'string') {
    let Ctor
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag)
    if (config.isReservedTag(tag)) {
      // HTML保留标签，当做原生DOM节点
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      )
    } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag)
    } else {
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      )
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children)
  }
	return vnode
}
```

根据`tag`和`data`判断标签的类型

* 如果是保留标签名，则直接返回`new VNode`节点
* 如果是组件，则调用`createComponent`，其内部主要是处理了data的一些属性，然后返回一个`VNode`节点

```js
export function createComponent (
  Ctor: Class<Component> | Function | Object | void,
  data: ?VNodeData,
  context: Component,
  children: ?Array<VNode>,
  tag?: string
): VNode | Array<VNode> | void {
  const baseCtor = context.$options._base
  // ... 省略处理async component 和 functional component
  data = data || {}
	// ... 省略处理data上的一些属性，如data.on转换为data.nativeOn, data.model转换为event和props
	// ... 省略处理Ctor.options.abstract
	
	// 初始化data.hook属性，该属性在patch阶段会使用
	// data.hook主要包含init、prepatch、insert、destroy四个方法
  installComponentHooks(data)
  // 组件需要返回一个占位的vnode
  const name = Ctor.options.name || tag
  const vnode = new VNode(
    `vue-component-${Ctor.cid}${name ? `-${name}` : ''}`,
    data, undefined, undefined, undefined, context,
    { Ctor, propsData, listeners, tag, children },
    asyncFactory
  )
  return vnode
}
```

### 跨平台渲染

由于vnode只是UI的描述性对象，因此在不同平台下，可以渲染出不同的原生组件等。将VNode渲染成平台真实组件的工作实在`vm.__patch__`方法中实现的

```js
import * as nodeOps from 'web/runtime/node-ops' // 封装了一些操作DOM的方法，如removeChild等
import { createPatchFunction } from 'core/vdom/patch'

// 封装一些与vnode相关的方法，如ref、directives
import baseModules from 'core/vdom/modules/index'
// 封装了一些与DOM相关的方法，如attrs、class、dom-props、event、style、transition
import platformModules from 'web/runtime/modules/index'

// 每个模块都提供了诸如create、update、destory相关的API，
// 在构造和diff组件树时，会依次调用相关方法进行初始化和更新相关属性
const modules = platformModules.concat(baseModules) 

 // 定义patch方法，主要是通过闭包传入nodeOps和modules，方便不同平台实现各自对应的节点操作方式
export const patch: Function = createPatchFunction({ nodeOps, modules })

Vue.prototype.__patch__ = inBrowser ? patch : noop
```

可以看见，`vm.__patch__`是通过向`createPatchFunction`方法传入了一些与平台相关的配置方法`nodeOps`和`modules`进行注册的。

这种设计方式可以保证`createPatchFunction`本身是与平台无关的，各个平台只需要实现各自对应的操作节点实例及属性的方法即可。

### patch

Vue在重新渲染页面时，会通过对比新旧节点，收集变化的节点，并统一更新，这样可以尽可能地复用旧节点，减少DOM操作。

为了在diff效率和DOM性能之前获得平衡，diff算法选择了如下策略

- 只比较同级节点
- 相同的tag表示渲染出相同的DOM实例，可以复用；不同的tag表示节点发生变化，需要重新创建

因此整个diff流程如下所示

* 旧节点如果不存在，则直接创建并插入新节点
* 新节点如果不存在，则删除旧节点
* 新节点与旧节点类型相同，则复用新旧节点的实例，比较两个vnode的属性是否相同，如果不同则需要更新
* 新节点与旧节点类型相同，则创建并插入新节点，同时删除旧节点

**patch**

```js
return function patch (oldVnode, vnode, hydrating, removeOnly) {
  // 如果不存在新节点，则删除旧节点
  if (isUndef(vnode)) {
    if (isDef(oldVnode)) invokeDestroyHook(oldVnode)
    return
  }

  let isInitialPatch = false
  const insertedVnodeQueue = []

  if (isUndef(oldVnode)) {
    // 旧节点如果不存在，则直接创建节点
    isInitialPatch = true
    createElm(vnode, insertedVnodeQueue)
  } else {
    const isRealElement = isDef(oldVnode.nodeType)
    if (!isRealElement && sameVnode(oldVnode, vnode)) {
      // 如果新旧vnode类型相同，则进行patch操作
      patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly)
    } else {
      // 否则需要新建一个新节点，然后替换旧节点
      if (isRealElement) {
        // ... 省略判断SSR
        oldVnode = emptyNodeAt(oldVnode)
      }

      const oldElm = oldVnode.elm
      const parentElm = nodeOps.parentNode(oldElm)
      // 创建新节点
      createElm(
        vnode,
        insertedVnodeQueue,
        oldElm._leaveCb ? null : parentElm,
        nodeOps.nextSibling(oldElm)
      )

      // ... 省略，从ancestor = vnode.parent递归向上遍历
      // 每一层都依次调用modules的destroy、create，和ancestor.data.hook.insert方法

      // 然后删除旧节点
      if (isDef(parentElm)) {
        removeVnodes([oldVnode], 0, 0)
      } else if (isDef(oldVnode.tag)) {
        invokeDestroyHook(oldVnode)
      }
    }
  }
  invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch)
  return vnode.elm
}
```

#### createElm

由于在初始化时传入的`oldVnode`是容器DOM节点，会进入“创建新节点，移除旧节点”的逻辑。`createElm`是vnode节点转换为真实DOM节点的核心代码，其内部实例化了`vnode.elm`

```js
function createElm (vnode, insertedVnodeQueue, parentElm, refElm, nested, ownerArray, index) {
  vnode.isRootInsert = !nested
  // 如果是组件，则进入createComponent的逻辑
  if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
    return
  }
  // 创建DOM节点
  const data = vnode.data
  const children = vnode.children
  const tag = vnode.tag
  if (isDef(tag)) {
    // 元素标签节点
    vnode.elm = vnode.ns
      ? nodeOps.createElementNS(vnode.ns, tag)
    : nodeOps.createElement(tag, vnode) // 根据tag区分创建DOM节点的类型
    setScope(vnode) // 实现css scoped需要的一些属性，后面再说

    // 首先创建子节点，并将子节点插入到当前节点vnode.elm上
    createChildren(vnode, children, insertedVnodeQueue)
    if (isDef(data)) {
      invokeCreateHooks(vnode, insertedVnodeQueue)
    }
    // 然后将当前节点插入到父节点
    insert(parentElm, vnode.elm, refElm)
  } else if (isTrue(vnode.isComment)) {
    // 注释节点
    vnode.elm = nodeOps.createComment(vnode.text)
    insert(parentElm, vnode.elm, refElm)
  } else {
    // 文本节点
    vnode.elm = nodeOps.createTextNode(vnode.text)
    insert(parentElm, vnode.elm, refElm)
  }
}
// 创建子节点
function createChildren (vnode, children, insertedVnodeQueue) {
  if (Array.isArray(children)) {
    for (let i = 0; i < children.length; ++i) {
      // 递归调用createElm创建子节点，并插入到父节点中
      createElm(children[i], insertedVnodeQueue, vnode.elm, null, true, children, i)
    }
  } else if (isPrimitive(vnode.text)) {
    nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text)))
  }
}
```

在`createElm`中，对组件标签和DOM标签进行了区分

* DOM标签将根据`vnode.tag`直接实例化，并调用`createChildren`渲染子节点
* 组件将调用`createComponent`初始化

**createComponent**

```js
function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
  let i = vnode.data
  if (isDef(i)) {
    const isReactivated = isDef(vnode.componentInstance) && i.keepAlive
    if (isDef(i = i.hook) && isDef(i = i.init)) {
      // 调用vnode.data.hook.init初始化vnode.componentInstance
      // 这是在createComponent创建组件VNode的时候注册的
      i(vnode, false /* hydrating */)
    }
    if (isDef(vnode.componentInstance)) {
      // 将vnode.elm取值vnode.componentInstance.$el
      initComponent(vnode, insertedVnodeQueue)
      // 将vnode.elm插入到父节点，完成组件的渲染
      insert(parentElm, vnode.elm, refElm)
      if (isTrue(isReactivated)) {
        reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm)
      }
      return true
    }
  }
}
```

可以看见内部通过连续赋值，调用了`vnode.data.hook.init`，这个属性是在`createComponent`中的`installComponentHooks`内赋值的

```js
const componentVNodeHooks = {
  init (vnode: VNodeWithData, hydrating: boolean): ?boolean {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestroyed &&
      vnode.data.keepAlive
    ) {
      // 处理keep-alive组件
      const mountedNode: any = vnode // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode)
    } else {
      // 初始化，调用
      const child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance
      )
      child.$mount(hydrating ? vnode.elm : undefined, hydrating)
    }
  },
}
```

在`createComponentInstanceForVnode`，调用的是组件的构造函数实例化组件，会重新完成上面的整个`new Vue`流程

```js
export function createComponentInstanceForVnode (
  vnode: any, // we know it's MountedComponentVNode but flow doesn't
  parent: any, // activeInstance in lifecycle state
): Component {
  const options: InternalComponentOptions = {
    _isComponent: true,
    _parentVnode: vnode,
    parent
  }
  return new vnode.componentOptions.Ctor(options)
}
```

关于`vnode.componentOptions.Ctor`的来源，可以参考下面的[Vue.extend分析](#核心概念：组件系统)。

至此，我们完成了初始化时整个组件树转换成DOM树的过程，从容器根节点开始

* 调用`createElm`创建DOM节点实例并插入父节点
* 调用`createComponent`创建组件实例，由于组件在初始化时会自动调用`vm.$mount`，递归调用`vm.__patch__`方法，并将生成的DOM节点`vnode.elm`插入父节点

#### patchVnode

`patchVnode`主要用来比较两个节点

```js
function patchVnode (oldVnode,  vnode,  insertedVnodeQueue,  ownerArray,  index,  removeOnly
) {
  if (oldVnode === vnode) {
    return
  }

  if (isDef(vnode.elm) && isDef(ownerArray)) {
    // clone reused vnode
    vnode = ownerArray[index] = cloneVNode(vnode)
  }

  const elm = vnode.elm = oldVnode.elm

  let i
  const data = vnode.data
  if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
    // 执行data.hook.prepatch
    i(oldVnode, vnode)
  }

  const oldCh = oldVnode.children
  const ch = vnode.children
  if (isDef(data) && isPatchable(vnode)) {
    // 依次调用所有modules的update方法，更新vnode
    for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode)
   	// 调用data.hook.update方法
    if (isDef(i = data.hook) && isDef(i = i.update)) i(oldVnode, vnode)
  }
  if (isUndef(vnode.text)) {
    if (isDef(oldCh) && isDef(ch)) {
      // 比较新旧子节点
      if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly)
    } else if (isDef(ch)) {
      // 旧子节点不存在，直接添加新子节点列表
      if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, '')
      addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)
    } else if (isDef(oldCh)) {
      // 新子节点不存在，直接移除旧子节点
      removeVnodes(oldCh, 0, oldCh.length - 1)
    } else if (isDef(oldVnode.text)) {
      nodeOps.setTextContent(elm, '')
    }
  } else if (oldVnode.text !== vnode.text) {
    // 判断文本节点内容是否相同
    nodeOps.setTextContent(elm, vnode.text)
  }
  if (isDef(data)) {
    // 调用data.hook.postpatch方法
    if (isDef(i = data.hook) && isDef(i = i.postpatch)) i(oldVnode, vnode)
  }
}
```

`updateChildren`是用来对比新旧子节点的核心实现，其内部会递归调用`patchVnode`来实现

```js
function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
  let oldStartIdx = 0
  let newStartIdx = 0
  let oldEndIdx = oldCh.length - 1
  let oldStartVnode = oldCh[0]
  let oldEndVnode = oldCh[oldEndIdx]
  let newEndIdx = newCh.length - 1
  let newStartVnode = newCh[0]
  let newEndVnode = newCh[newEndIdx]
  let oldKeyToIdx, idxInOld, vnodeToMove, refElm

  const canMove = !removeOnly
  
  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    // 两两比较，共四种比较方式
    if (isUndef(oldStartVnode)) {
      oldStartVnode = oldCh[++oldStartIdx] // Vnode has been moved left
    } else if (isUndef(oldEndVnode)) {
      oldEndVnode = oldCh[--oldEndIdx]
    } else if (sameVnode(oldStartVnode, newStartVnode)) {
      // 首节点进行比较
      patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
      oldStartVnode = oldCh[++oldStartIdx]
      newStartVnode = newCh[++newStartIdx]
    } else if (sameVnode(oldEndVnode, newEndVnode)) {
      // 尾节点进行比较，避免首节点变化导致后面的所有节点均变化的情况
      patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx)
      oldEndVnode = oldCh[--oldEndIdx]
      newEndVnode = newCh[--newEndIdx]
    } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
      // 首尾节点进行比较，处理节点顺序变化的情况
      patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx)
      canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm))
      oldStartVnode = oldCh[++oldStartIdx]
      newEndVnode = newCh[--newEndIdx]
    } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
      // 尾首节点进行比较，同处理节点顺序变化的情况
      patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
      canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)
      oldEndVnode = oldCh[--oldEndIdx]
      newStartVnode = newCh[++newStartIdx]
    } else {
      // 都不满足，则跨游标寻找一个同类型旧节点
      if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
      idxInOld = isDef(newStartVnode.key)
        ? oldKeyToIdx[newStartVnode.key] // 根据key找到旧节点索引值
        : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx) // 从oldStartIdx, oldEndIdx区间找到一个类型相同的旧节点索引值
      if (isUndef(idxInOld)) { // New element
        createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
      } else {
        vnodeToMove = oldCh[idxInOld]
        if (sameVnode(vnodeToMove, newStartVnode)) {
          patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
          oldCh[idxInOld] = undefined
          canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm)
        } else {
          // key相同但是节点类型不同，也需要创建新节点
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
        }
      }
      // 移动新节点
      newStartVnode = newCh[++newStartIdx]
    }
  }
  if (oldStartIdx > oldEndIdx) {
    // 新节点未遍历完，则需要将未遍历的节点插入
    refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm
    addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue)
  } else if (newStartIdx > newEndIdx) {
    // 旧节点列表未遍历完，则需要移除
    removeVnodes(oldCh, oldStartIdx, oldEndIdx)
  }
}
```

首先初始化oldCh和newCh两个列表各自两个头尾的游标StartIdx和EndIdx，然后按照下面顺序进行对比
* `oldStartVnode`、`oldEndVnode`、`newStartVnode`、`newEndVnode`两两比较类型是否相同（共有2X2四种比较），如果相同，则递归调用`patchVnode`比较两个节点

* 如果根据上面这4种比较方式都没有找到类型相同的节点，会根据是否设置了`key`来找到需要对比的旧节点的索引值
  * 如果设置了key，则通过`oldKeyToIdx[newStartVnode.key]`快速找到一个同key可复用的旧节点
* 如果没有设置key，则每次都需要`findIdxInOld`遍历旧节点列表，找到一个可复用的节点
  * 使用key只需要遍历一次旧节点，相比而言查找效率更高
  
* 通过游标判断当`oldCh`和`newCh`至少有一个已经遍历时，就会结束比较，同时处理剩下子列表的节点
  * `newCh`未遍历完，则在对应位置插入剩余节点
  * `oldCh`未遍历完，则删除剩余节点

除了索引值相同的节点进行比较，还可能进行首尾节点交叉对比，这个设计与React有所区别。对于这种设计，我的理解是：

* Vue是在diff阶段即时更新DOM
  * 为了复用DOM、尽量少创建或删除DOM，在diff期间会尽可能找到一个满足条件的DOM节点
  * 因此除了比较两个首节点，还会在首节点不满足的情况下进行尾节点、首尾节点的比较，尽可能找到符合条件的DOM节点。
* React是批量更新DOM节点，
  * 在完成整个Reconciler diff收集需要变化的节点，再做commit操作统一更新DOM
  * 所以从头开始按照索引值进行diff操作即可，在commit阶段可以优化从而减少DOM操作

这里有一篇文章分析Vue中diff算法的执行流程，包含相关配图，不妨移步阅读，[传送门](https://github.com/aooy/blog/issues/2)。

### 小结

在Vue中，render函数实际上就是层层调用`createElement`创建Vnode，构造组件树，用于描述整个应用的展示。

Vnode是一个UI的抽象概念，基于此设计，可以实现Vue的跨平台渲染，传入同一个vnode，不同的平台会进行不同的处理，在web中就会创建DOM节点。

组件树转换成DOM树的过程是递归实现的，从根节点开始，递归调用`createElm`创建元素

* 如果是DOM标签，则直接创建DOM节点，并将其插入到父节点
* 如果是组件标签，则初始化`vnode.componentInstance`，将组件实例`$mount`方法返回的DOM节点插入到父节点
* 所有子节点及后代节点构建插入完毕，最后将根节点插入到页面上

组件树的diff更新也是递归实现的，从根节点开始，首先调用update更新节点，然后调用`patchNode`比较新旧根节点

* 如果同时存在新旧节点，则调用`updateChildren`更新子节点列表，通过按照同级比较的策略递归调用`patchNode`比较新旧子节点
* 如果只存在新节点，则将其插入到父节点
* 付过只存在旧节点，则将其从父节点移除

Vue的diff和patch是同步进行的，当遇见需要变化的Vnode节点时，就会将变化同步到DOM节点上。

## 核心概念：组件系统

一个组件就是一个Vue实例。需要了解组件相关API、组件通信、封装组件的一些方法

### Vue.extend

Vue通过`Vue.extend`定义组件

### 事件通信

`$on `、`$once`、`$off`、`$emit`

## 源码细节

### 生命周期钩子函数

[官网上的这张图片介绍的十分清楚](https://cn.vuejs.org/v2/guide/instance.html#生命周期图示)

> vue 父子组件嵌套时，组件内部的各个生命周期钩子触发先后顺序?

从源码分析`patch`函数时可以发现，先创建父组件，遇见子组件就创建子组件，然后将子组件挂载到父组件，最后执行父组件的挂载操作

在初始化和更新时会触发对应的生命周期钩子函数


### 数据代理
Vue中可以通过`this`访问到和修改`this.$data`的值，这是通过代理实现的，原理是修改对应的`getter`和`setter`

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

### computed 实现

理解computed的两个需求
* 建立与其他属性（如：data、 Store）的联系；
* 属性改变后，通知计算属性重新计算。

实现方式
* 初始化 data， 使用 Object.defineProperty 把这些属性全部转为 getter/setter。
* 初始化 computed, 遍历 computed 里的每个属性，每个 computed 属性都是一个 watch 实例。每个属性提供的函数作为属性* 的 getter，使用 Object.defineProperty 转化。
* Object.defineProperty getter 依赖收集。用于依赖发生变化时，触发属性重新计算。
* 若出现当前 computed 计算属性嵌套其他 computed 计算属性时，先进行其他的依赖收集，这是在更新队列中通过`watcher.id`排序实现的。

### complier 实现
理解主要过程
* parse 过程，将 template 利用正则转化成 AST 抽象语法树。
* optimize 过程，标记静态节点，后 diff 过程跳过静态节点，提升性能。
* generate 过程，生成 render 字符串。

### SSR

通过虚拟DOM技术，可以实现服务端渲染。

参考：
* https://juejin.im/post/5a9ca40b6fb9a028b77a4aac

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