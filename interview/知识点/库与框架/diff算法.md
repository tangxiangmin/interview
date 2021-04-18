理解diff算法
===

本文将从React和Vue源码中，理解diff算法的工作原理和实现方式。

参考:

- [让虚拟DOM和DOM-diff不再成为你的绊脚石](https://juejin.im/post/5c8e5e4951882545c109ae9c)
- [React 源码深度解读（十）：Diff 算法详解](https://segmentfault.com/a/1190000017039293)
- [React 源码剖析系列 － 不可思议的 react diff](https://zhuanlan.zhihu.com/p/20346379)
- [彻底理解React如何重新处理DOM(Diffing算法)](https://blog.csdn.net/baiyu753159/article/details/71545762)

## diff算法概述

开门见山，定义diff算法：

> 在初始化或更新时，组件树从旧状态更新为新状态，使用**先序遍历**，找到将旧树转换为新树所需的最少的转换步骤

diff的任务就是收集新组件树中每个节点的变动，在diff完成后将整个改动更新到页面真实DOM上。为了性能考虑，实现的diff算法需要满足下面条件

- 尽量复用DOM节点，减少创建或删除DOM的次数
- 时间复杂度要低，diff操作要足够快

将新组件树和旧组件树上同一个位置的节点进行对比，可能存在以下几种情况

- 旧节点存在，新节点为null，表示旧节点被移除
- 新节点存在，旧节点为null，表示新节点为新插入
- 新旧节点都存在
  - 类型不同，表示旧节点被移除，同时将新节点插入该位置占位
  - 类型相同，表示新节点**可复用**旧节点的实例，检测新旧节点属性是否变化
    - 属性未变化，新旧节点完全相同，无需改动
    - 属性变化，需使用新节点相关属性替换旧节点属性

如果仅仅是满足diff算法条件一，考虑下面节点变化

![](http://ww3.sinaimg.cn/large/006tNc79gy1g609096qeoj30es08lweh.jpg)

理想q情况下最优的处理方式是：将A移动到D节点下方，完全复用节点。但是这样处理会导致时间复杂度陡升，因为我们在遍历新组件树，遇见D节点时

- 首先需要知道其子树A是一个新插入的子树
- 然后需要遍历旧组件树，找到一颗与A相同的子树，且其状态为删除，
- 最后我们将旧组件树的A子树移动到新组件的的D节点下，继续比那里其余节点并进行diff操作

整个算法实现的时间复杂度非常高`O(n^3)` ，无法满足第二个条件。因此React在DOM性能和算法效率之间进行了取舍，使用下述策略进行新旧组件树的diff操作

React 通过制定大胆的策略，将 O(n^3) 复杂度的问题转换成 O(n) 复杂度的问题。

- Web UI 中 DOM 节点跨层级的移动操作特别少，可以忽略不计。
  - 当跨级移动时，对应的处理时删除之前的节点，然后在移动位置新建节点
  - 在上述提到的问题中，React首先会删除掉A节点，然后在D节点下重新创建A节点及其子节点，重新插入，因此建议不要做这种跨级的移动操作，对DOM性能消耗是比较明显的。
- 拥有相同类的两个组件将会生成相似的树形结构，拥有不同类的两个组件将会生成不同的树形结构。
  - 如果是同一类型的组件，按照原策略继续比较 `virtual DOM tree`
  - 如果不是，则将该组件判断为 dirty component，从而直接替换整个组件下的所有子节点。
- 对于同一层级的一组子节点，
  - 对于相同位置（索引值）的节点，会产生上面提到的几种情况：删除、插入、替换、更新
  - 可以根据唯一id快速找到旧节点中的某个节点，此时只需要移动节点即可，无需重新创建后面的节点

通过上述策略 ，整个diff操作的复杂度从 `O(n^3)`转换成了`O(n) `。此外React还提供了`shouldComponentUpdate`、`PureComponent`等方案减少diff操作，进一步节省性能。了解了diff算法的基本任务和策略之后，我们来尝试实现diff算法。

## 递归实现diff

遍历树最常用的操作就是递归，这Vue和React16前版本使用的`Statck Reconciler`所采用的方案。

### Vue diff

Preact与vue实现基本相同

参考：[解析vue2.0的diff算法](https://github.com/aooy/blog/issues/2) 

### 简单实现

具体思路为，从组件树根节点开始，对比新旧组件树的两个节点，然后收集更新，递归对比子节点列表中的每一个节点，直至遍历完成

```js
// 定义节点可能发生的变化
const [REMOVE, REPLACE, INSERT, UPDATE] = [0, 1, 2, 3];

function diff(oldNode, newNode) {
    let patch;
    if (!newNode) {
        // 旧节点及其子节点都将移除
        patch = { type: REMOVE, oldNode };
    } else if (!oldNode) {
        // 当前节点与其子节点都将插入
        patch = { type: INSERT, newNode };
        // 将所有子节点也标记为INSERT，这一步可以进行优化，
      	// 即当父节点为INSERT时，所有子节点均自动标记为INSERT，此处为了便于理解，暂不处理
        diffChildren(null, newNode.children);
    } else if (oldNode.type !== newNode.type) {
        // 使用新节点替换旧节点
        patch = { type: REPLACE, oldNode, newNode };
    } else {
        // 检测如果存在有变化的属性，则需要将新节点的属性更新到旧节点
        if (diffAttr(oldNode.props, newNode.props)) {
            patch = { type: UPDATE, oldNode, newNode };
        }
        // 继续比较子节点
        diffChildren(oldNode.children, newNode.children);
    }
    // 将更新保存在节点的patches属性上，旧节点的删除需要保存在新旧节点公共父节点上
    let node = newNode || oldNode.parent;
    if (!node.patches) {
        node.patches = [];
    }
    patch && node.patches.push(patch);
}

function diffChildren(oldChildren, newChildren) {
    let count;
    // 依次比较旧的子节点列表和新的子节点列表
    if (oldChildren && oldChildren.length) {
        oldChildren.forEach((child, index) => {
            count++;
            diff(child, (newChildren && newChildren[index]) || null);
        });
    }
    // 如果还有未比较的新节点，继续进行diff将其标记为INSERT
    if (newChildren && newChildren.length) {
        for (; count < newChildren; count++) {
            diff(null, newChildren[index]);
        }
    }
}
```

这样，就可以完成新旧组件树的diff操作，并将需要处理的更新挂载到`node.patches`属性上，在后续的patch阶段，会根据diff时收集的`type`做对应的处理。

为了进一步理解diff的作用，下面实现了一个简单的`patch`方法，用于查看diff过程中收集到的变化是如何更新到页面上的。

```js
function patch(node) {
    if (!node) return;
		// 从根节点开始执行patch操作
    doPatch(node);

    node.children.forEach(child => {
        patch(child);
    });
}
function doPatch(node) {
    let patches = node.patches;
    if (!patches || !patches.length) return;

    const handlers = {
        [REMOVE]: function removeChild(parent, oldNode, newNode) {
            parent.$el.removeChild(oldNode.$el);
        },
        [REPLACE]: function replaceChild(parent, oldNode, newNode) {
            let parent = oldNode.parent.$el;
            let target = oldNode.$el;

            newNode.$el = createDOM(node);

            parent.insertBefore(newNode.$el, target);
            parent.removeChild(target);
        },
        [UPDATE]: function updateNode(parent, oldNode, newNode) {
            const props = newNode.props;
            // todo 这里应该只处理需要更新的属性
            Object.keys(props).forEach(key => {
                newNode.$el.setAttribute(key, props[key]);
            });
        },
        [INSERT]: function insertNode(parent, oldNode, newNode) {
            newNode.$el = createDOM(newNode);

            newNode.parent.$el.appendChild(newNode.$el);
        }
    };
    patches.forEach(patch => {
        const {type, oldNode, newNode} = patch
        let handler = handlers[type];
        // 根节点的父节点其$el就是页面挂载容器
        handler && handler(newNode.parent, oldNode, newNode);
    });

    function createDOM(node) {
        return document.createElement(node.type);
    }
}
```

通过`patch`方法的实现，我们可以进一步了解diff的作用：对比新旧节点，收集节点变化的类型是删除、插入、替换、更新中的某一种，然后调用DOM方法完成页面视图的更新。

上面的diff和patch中，并没有展示变化类型为**移动**的节点，我将其放在了后文的"key在diff中的作用"这一小节了。

## 循环实现diff

### React Fiber Reconciler

递归实现diff的一个问题是：递归很难被临时中断，在某个时刻又恢复至原来调用的地方。因此，递归diff必然是同步进行的，如果组件树十分庞大，需要进行的diff操作太多，就会导致浏览器处于卡死的状态。

基于这个问题，React将整个diff过程重构为`Fiber Reconciler`，通过fiber将组件树从树的结构调整为链表结构，利用链表的循环和`workInProgress`游标实现异步的diff操作。

### 简单实现

`Fiber Reconciler`引入了`Fiber`数据结构，用于将整个应用从树结构修改为链表结构，对于单个fiber节点而言，有下面几个比较重要的属性

* `return`父节点
* `child`第一个子节点
* `sibling`下一个兄弟节点

根据上面这三个属性，就可以从根节点通过循环的方式完成整个组件树的遍历。下面的代码大致展示了如何通过循环链表实现diff算法

```js
let workInProgress, currentWorkRoot
function scheduleWork(fiberRoot){
    workInProgress = fiberRoot;
    currentWorkRoot = fiberRoot;

    // 浏览器在空闲期间会持续调用workLoop，从workInProgress开始继续diff
    requestHostCallback(workLoop);
}

function workLoop(){
    while (workInProgress) {
        // 判断当前帧是否完成，每完成一个节点的diff，就将控制权交给浏览器，检测
        if (shouldYield()) {
             // 当前时间切片已用光，但diff流程未结束，浏览器会在合适的实际继续调用workInProgress
            return true;
        } else {
            // 可以继续进行下一个节点的diff
            workInProgress = performUnitWork(workInProgress);
        }
    }
}

function performUnitWork(fiber) {
    let newChildren = getFiberNewChildren(fiber);   // 获得更新后的newChildren
    diff(fiber, newChildren, oldChildren);  // 如果存在子节点，则更新workInProgress
   
  	// 返回workLoop，继续遍历
    if(fiber.child){
        return fiber.child
    }
    while (fiber) {
        // 然后遍历兄弟节点，完成兄弟节点的diff操作
        if (fiber.sibling) {
            return fiber.sibling;
        }
        // 回到父节点
        fiber = fiber.return;
        if (currentWorkRoot === fiber) {
            return null;
        }
    }
}
// 找到旧节点
function getFiberChildren(fiber){
    let child = fiber.child
    let children = []
    while (child) {
        children.push(child)
        child = child.sibling
    }
    return children
}
function diff(parentFiber, newChildren) {
    let prevFiber = null;
	  let oldChildren = getFiberChildren(fiber); // 获取旧的子节点列表
    let i;
    // 新节点与旧节点对比
    for (i = 0; i < newChildren.length; ++i) {
        let newNode = newChildren[i];
        let oldFiber = oldChildren[i];
        let newFiber;
      	// 此处与前面递归实现的比较逻辑基本相同
        if (oldFiber) {
            // 类型相同，表示节点实例可复用
            if (isSameVnode(newNode, oldFiber)) {
                if(diffAttr(newNode, oldFiber)){
                    // 属性不同，标记为更新
                    newFiber = createFiber(newNode, UPDATE);
                    newFiber.alternate = oldFiber;
                }else {
                    // 属性相同，可以完全复用
                    newFiber = oldFiber
                }
            } else {
                // 类型不同，标记为替换
                newFiber = createFiber(newNode, REPLACE);
            }
            newFiber.alternate = oldFiber;
        } else {
            // 当前位置不存在旧节点，表示新增
            newFiber = createFiber(newNode, INSERT);
        }

        // 调整fiber之间的引用，构建新的fiber树
        newFiber.return = parentFiber;
        if (prevFiber) {
            prevFiber.sibling = newFiber;
        } else {
            // 更新父元素的子节点
            parentFiber.child = newFiber;
        }
        prevFiber = newFiber;
    }

    // 移除剩余未被比较的旧节点
    for (; i < oldChildren.length; ++i) {
        let oldFiber = oldChildren[i];
        oldFiber.patchTag = REMOVE;
        enqueueUpdate(parentFiber, oldFiber); // 由于被删除的节点不存在fiber树中，因此交给父节点托管
    }
}
```

同样地，这里将节点的变化收集在`patchTag`上，在diff流程结束以后，会统一提交变化，完成视图的更新。

## key在diff中的作用

> 在渲染列表节点中， 通过key可以在后续diff时移动节点，而不是更新节点，

参考

- [为什么使用v-for时必须添加唯一的key?](https://juejin.im/post/5aae19aa6fb9a028d4445d1a)
- [写 React / Vue 项目时为什么要在列表组件中写 key，其作用是什么](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/1)

### 无key与有key的区别

当旧组件的渲染列表为`[1,2,3]`时，考虑以下场景

列表元素顺序发生变化，更新后列表为`[2,1,3]`

- 不带key,新旧节点对比 2->1 , 1->2 ，3->3，需要更新两个节点，不需要调换位置
- 带key，key值为item，新旧节点对比,1->1，2->2，3->3 不需要更新DOM节点，需要调换位置1和2节点的位置

列表进行增加操作，更新后列表为`[1,4,2,3]`

- 不带key，1->1,2->4,3->2，null->3，第二、三个节点需要更新，第四个节点需要插入
- 带key，1->1，2->2，3->3,null->4，只需要将节点插入到第二个节点的前方

列表进行删除操作，更新后列表为`[1,3]`

* 不带key，1->1,2->3,3->null，需要更新第二个节点，同时将第三个节点删除
* 带key，1->1,2->null,3->3，需要将第二个节点移除

因此在渲染列表时，利用key可以diff过程中快速找到同key的旧节点，尽可能地复用之前的DOM节点，而不是”就地复用“去更新旧节点的内容。

需要注意的是，使用key并不一定能带来DOM性能上的优化，比如列表渲染简单的文本节点，直接更新文本节点的内容，比交换DOM位置的性能应该更优。

综上理解，key的作用在于：**在数据变化时强制更新组件，避免就地复用带来的副作用**。

### 实现key

在前面未带key的diff实现里面，按照数组索引值查找旧节点，然后进行对比；再添加了key之后，则应该按照key查找旧节点，然后进行对比。因此我们需要修改`getFiberChildren`方法的实现

```js
// 找到之前的旧节点，以 key=>fiber 形式返回
export function getExistingChildren(fiber): Map<string | number, Fiber> {
    const existingChildren: Map<string | number, Fiber> = new Map();
    let child: Fiber = fiber.child
    let count: number = 0
    while (child) {
        let vnode = child.vnode
        let key = vnode.key === undefined ? count : vnode.key
        if (!existingChildren.has(key)) {
            existingChildren.set(key, child)
        } else {
            console.error(`列表节点中key必须是唯一的`)
        }
        child = child.sibling
        count++
    }
    return existingChildren
}
// 比较新旧fiber的子节点，并将可用的fiber节点转换为fiber
export function diff(parentFiber: Fiber, newChildren: Array<VNode>) {
    let prevFiber = null
    let i = 0
    let current = parentFiber.alternate
    // 由key属性组成的节点映射，通过移动直接复用
    const existingChildren = getExistingChildren(current)
    let insertCount = 0
    // 新旧节点逐个diff
    for (; i < newChildren.length; ++i) {
        let newNode = newChildren[i]
        let newFiber: Fiber
        let oldFiber: Fiber
        
        // 根据key找到旧节点
        let key = newNode.key === undefined ? i : newNode.key
        oldFiber = existingChildren.get(key)

        if (oldFiber) {
            if (isSameVnode(newNode, oldFiber)) {
                // 判断位置是否相同，需要排除新插入的节点
                if (oldFiber.index === (i - insertCount)) {
                  	// 判断props属性是否变化决定是否标记为UPDATE
                } else {
                  	// 与之前的索引值不一致，标记为MOVE
                }
            } else {
                // 如果类型不同，则需要删除对应位置的旧节点，然后插入新的节点，标记为REPLACE
            }
            existingChildren.delete(key)
        } else {
            insertCount++
            // 当前位置不存在旧节点，表示新增ADD
            newFiber = createFiber(newNode, PatchTag.ADD)
        }

        newFiber.index = i
      	// 省略:调整newFiber.return 、 prevFiber.sibling 、 parentFiber.child的更新
    }
    // 省略:移除剩余未被比较的旧节点
}
```

然后在patch的时候，检测到`PatchTag.MOVE`的变动，就会将旧节点移动到新节点的指定位置。

从上面的实现可以看出，如果在渲染列表时用index作为key值，实际上并不是一个很好的选择，因为index作为key值与前面无key值查找旧节点的方式就是一样的了，无法避免就地复用的问题。

此外，`key`属性应该是稳定，可预测和唯一的。 不稳定的key(如使用`Math.random()`生的`key`)将导致许多组件实例和DOM节点进行不必要地重复创建，这可能导致子组件中的性能降低和`state`丢失

## 小结

本文整理了下面几个方面的内容

* 首先从diff算法的概念入手，整理了diff算法原理：即依次对比新旧节点，并收集节点的变化。
* 然后给出了递归和循环两种diff算法的实现。
* 最后讨论了key在diff算法中的作用：将按照索引值查找旧节点的方式，修改为按照key查找旧节点

通过手动编写代码，可以进一步了解diff算法的原理和使用。