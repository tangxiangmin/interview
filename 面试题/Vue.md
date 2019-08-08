
## 谈谈对于MVVM框架的理解
把系统分为三个基本部分：模型（Model）、视图（View）和视图模型（ViewModel）。
ViewModel大致上就是MVP的Presenter和MVC的Controller了，而View和ViewModel间没有了MVP的界面接口，而是直接交互，用数据“绑定”的形式让数据更新的事件不需要开发人员手动去编写特殊用例，而是自动地双向同步。
数据绑定你可以认为是Observer模式或者是Publish/Subscribe模式，原理都是为了用一种统一的集中的方式实现频繁需要被实现的数据更新问题。
比起MVP，MVVM不仅简化了业务与界面的依赖关系，还优化了数据频繁更新的解决方案，甚至可以说提供了一种有效的解决模式。

## new Vue(options)中发生了什么操作
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

## Vue响应式系统的原理
在渲染函数执行时，因为会读取所需对象的值，所以会触发 getter 函数进行依赖收集。 依赖收集的实质是是将观察者 Watcher 对象存放（pushTarget(this)修改Dep._target) 到当前闭包中的订阅者 Dep 的 subs。一个属性可能对应多个Watcher，他们都保存在该属性对应的Dep中。

修改对象的值的时候，会触发对应的setter， 在setter内部通知之前依赖收集到的Dep中的每一个Watcher，这些 Watcher 就会开始调用update来更新视图，从而重新渲染视图。

具体过程为
* vue将data初始化为一个Observer并对对象中的每个值，重写了其中的get、set，data中的每个key，都有一个独立的依赖收集器。
* 在get中（模板渲染或其他使用到该属性值的地方），向依赖收集器添加了监听
* 在mount时，实例了一个Wathcer，将收集器的目标指向了当前Watcher
* 在data值发生变更时，触发set，触发了依赖收集器中的所有监听的更新，来触发Watcher.update
