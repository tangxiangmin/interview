

参考
* [immutable-js 项目源码](https://github.com/immutable-js/immutable-js)

* [immer-tutorial](https://github.com/ronffy/immer-tutorial)

* [在react/redux中使用Immutable](https://www.cnblogs.com/greatluoluo/p/8469224.html)


## 为什么使用Immutable

React.js 是一个 UI = f(states) 的框架，为了解决更新的问题， React.js 使用了 virtual dom ， virtual dom 通过 diff 修改 dom ，来实现高效的 dom 更新。

但是有一个问题。当 state 更新时，如果数据没变，你也会去做 virtual dom 的 diff ，这就产生了浪费。这种情况其实很常见

可以使用PureComponent来避免不必要的更新，但其只是浅比较，无法判断组件的修改？自己去做复杂比较的话，性能又会非常差

在react中为了保证纯函数和state的变化，需要写大量的{...state}之类的代码，可以使用Immutable 来处理。

方案就是使用 immutable.js 可以解决这个问题。因为每一次 state 更新只要有数据改变，那么 PureRenderMixin 可以立刻判断出数据改变，可以大大提升性能

Immutable.js 需要使用其内置的api来操作数据，比较繁琐，且需要区分是 Immutable 对象还是原生对象，容易混淆操作。对现有代码的迁移成本也很高，可以使用immer.js

### 优点
* 降低 Mutable 数据变化带来的复杂度
* 节省内存空间
* Undo/Redo，Copy/Paste，随意穿越！
* 拥抱函数式编程

### 缺点
* 容易与原生对象混用
* 对已有代码侵入性较强，迁移成本较高
* 开发效率和应用项目之前需要平衡