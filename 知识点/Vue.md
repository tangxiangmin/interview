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

参考
* https://www.jianshu.com/p/e54a9a34a773
* https://juejin.im/post/59ffb4b66fb9a04512385402
* 之前整理了`V2.5.9`的源码分析，放在[github](https://github.com/tangxiangmin/Vue-source-code-analysis)上面了

网上有很多的关于Vue的源码分析，这里只是简单梳理一下，面试应该也不会有太多时间去深入每个细节，但是基本的原理肯定是需要掌握的。

## Vue源码分析


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


## 响应式系统
响应式系统需要理解两部分
* 基于`Object.defineProperty`的响应式原理
* 依赖收集于触发更新

### 劫持访问描述符
我们知道Vue内部是通过`Object.defineProperty`，递归劫持`options.data`属性的`getter`和`setter`来实现
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
### 依赖收集
依赖收集的原因有下面两个：
* 只有当模板中使用的数据发生了变化，才更新对应的视图
* 如果有多个模板使用对应的数据，当数据发生变化时需要更新所有依赖的视图

Vue的设计是发布-订阅者模式，在`get`中进行依赖收集，在`set`中通知相关订阅者`Watcher`，下面是最基本的发布-订阅者模型
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
    constructor(){
        Dep._target = this
    }
    update(){
        console.log('watcher is update')
    }
}
```
在Vue中的`defineReactive`中，为每个属性实例化一个`Dep`发布者，然后在`getter`中进行依赖收集，即实例化一个`Watcher`，然后添加到对应属性的`Dep`中。

在该属性`setter`触发时，对应Dep就会通知所有的订阅者，然后执行视图的更新。
稍微修改一下defineReactive
```js
function defineReactive(obj, key, val) {
    observer(val)
    let dep = new Dep()
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function () {
            dep.depend()
            return val
        },
        set: function (newval) {
            val = newval
            update(newval)
        }
    })
}
```
在实例化Watcher的时候，会修改`Dep._target`，然后完成依赖收集。实例化Watcher的时机是在`mountComponent`进行的，其主要目的就是更新视图，更详细的源码这里就不分析了
```js
let updateComponent
updateComponent = () => {
      const name = vm._name
      const id = vm._uid
      const vnode = vm._render()
      vm._update(vnode, hydrating)
}

// 实例Watcher对象，绑定响应式数据
new Watcher(vm, updateComponent, noop, null, true /* isRenderWatcher */)
```
## 数据代理
Vue中可以通过`this`访问到和修改`this.$data`的值，这是通过代理实现的，原理是修改对应的`getter`和`setter`

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
## 更新VNode的diff算法
`patch`方法中最重要的就是diff算法。diff 算法是通过同层的树节点进行比较而非对树进行逐层搜索遍历的方式，所以时间复杂度只有 O(n)，是一种相当高效的算法

## 批量更新策略和nextTick
参考[官方文档](https://cn.vuejs.org/v2/guide/reactivity.html#%E5%BC%82%E6%AD%A5%E6%9B%B4%E6%96%B0%E9%98%9F%E5%88%97)

> Vue 异步执行 DOM 更新。只要观察到数据变化，Vue 将开启一个队列，并缓冲在同一事件循环中发生的所有数据改变。如果同一个 watcher 被多次触发，只会被推入到队列中一次。这种在缓冲时去除重复数据对于避免不必要的计算和 DOM 操作上非常重要。然后，在下一个的事件循环“tick”中，Vue 刷新队列并执行实际 (已去重的) 工作

其原理是：
每次触发某个数据的 setter 方法后，对应的 Watcher 对象其实会被 push 进一个队列 queue 中，在下一个 tick 的时候将这个队列 queue 全部拿出来 run（ Watcher 对象的一个方法，用来触发 patch 操作） 一遍。

如果需要在数据变化之后等待 Vue 完成更新 DOM，则需要使用`vm.$nextTick()`接口

Watcher**去重**的工作是通过Watcher对象的uid来实现的。然后在Watcher的update中将其添加进更新队列，然后去重（通过一个哈希表提高效率），最后在下一个事件循环中执行已去重的实际工作。


## Vuex
有时候需要处理一些组件间共享的数据或状态，或是需要通过 props 深层传递的一些数据

-------
常见问题
=======

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


## 路由懒加载
参考
* [官方文档](https://router.vuejs.org/zh-cn/advanced/lazy-loading.html)
* [Vue代码分割懒加载](https://segmentfault.com/a/1190000012038580)
* [Vue2组件懒加载浅析](https://www.cnblogs.com/zhanyishu/p/6587571.html)

## vue-router
* keep-alive
* 滚动位置还原