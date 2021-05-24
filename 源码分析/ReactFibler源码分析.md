

* [这可能是最通俗的 React Fiber 打开方式](https://bobi.ink/2019/10/18/react-fiber/)，这篇文章写得太稳了
* [React Fiber架构](https://zhuanlan.zhihu.com/p/37095662)


递归的缺点、链表循环的优势

如和在循环到某个节点时暂停，让出时间片段去处理其他高优先级

如何从上次暂停的节点恢复循环任务？

在浏览器空闲的时候做点事情
```js
window.requestIdleCallback(() => {
    console.log("做点啥");
});
```
在浏览器每次空闲的时候做点事情
```js
const performWork = () => {
    window.requestIdleCallback(() => {
        console.log("做点啥");
        // 时间不够了，下次有空了继续来
        performWork()
    });
};
performWork()
```

基于这个思路，我们可以实现一个简版的调度器
```js
function createScheduler() {
    const frame = 1000 / 60;
    const queue = []

    let deadline = 0;

    const shouldYield = () => getTime() >= deadline;
    const schedule = (cb) => window.requestIdleCallback(cb);

    // 按顺序执行queue
    const flushWork = ()=>{
        deadline = getTime() + frame
        const callback = queue.shift()
        while(callback && !shouldYield()){
            callback()
        }
        // 还有任务未执行完，则等待下一次的调度
        if(queue.length){
            schedule(flushWork)
        }
    }

    const sheculeWork = (callback) => {
        queue.push(callback)
        schedule(flushWork)
    };

    return sheculeWork
}

// 调度器，插入新的任务
const sheculeWork = createScheduler()
```


双缓冲技术：图形绘制引擎一般会使用双缓冲技术，先将图片绘制到一个缓冲区，再一次性传递给屏幕进行显示，这样可以防止屏幕抖动，优化渲染性能。

![](http://img.shymean.com/oPic/1620740677909_166.png)

可以理解为git的分支功能，我们从master切出一个分支，然后执行添加、删除或修改的特性。当这个分支开发测试完成之后，就可以合并到master分支，将master分支更新，这大概是为啥之后的阶段叫做`commit`

## 之前的整理

[React16源码解析(一)- 图解Fiber架构](https://segmentfault.com/a/1190000020736966?utm_source=sf-similar-article)

[https://react.jokcy.me/](https://react.jokcy.me/)

[http://www.ayqy.net/blog/dive-into-react-fiber/](http://www.ayqy.net/blog/dive-into-react-fiber/)

[https://www.youtube.com/watch?v=ZCuYPiUIONs](https://www.youtube.com/watch?v=ZCuYPiUIONs)  视频 A Cartoon Intro to Fiber – React Conf 2017 强烈推荐

[https://www.zoo.team/article/about-react-fiber](https://www.zoo.team/article/about-react-fiber) 写的好像也可以

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/d53ced00-f70e-4cd1-9605-dcb6a7668ff1/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/d53ced00-f70e-4cd1-9605-dcb6a7668ff1/Untitled.png)

### 主要的思路

[https://www.kancloud.cn/kancloud/react-in-depth/47779](https://www.kancloud.cn/kancloud/react-in-depth/47779) 这篇文章写得很好，但是好像没有更新了

几个核心的点

createElement：通过JSX编写富有表达力的声明式UI代码，JSX只是一种用于创组件的XML语法

整体刷新：如果由每个组件自己去维护自己的数据状态和UI更新，工作量无疑是很庞大的，不如每次都从整体来刷新UI。这听上去可能有性能问题，但我们有虚拟DOM，可以通过diff算法来极大地提高性能

Fiber：整体刷新时的diff操作如果运行时间，会导致浏览器无法响应用户的交互，因此需要时间切片

### JSX

component、props、children，onEvent

### diff算法：利用VNode优化DOM操作

snabbdom、inferno


### fiber调和：递归转循环

递归没法中断，所以把他搞成线性循环的，这需要使用fiber，将整棵树转成链表

线性循环可以暂停或中断了，这样就可以利用浏览器每一帧渲染完的空闲时间来执行循环任务

怎么开始任务、怎么暂停任务呢？在浏览器有空闲的时候开始任务，在执行完每一个任务之后，就检测有没有剩余的时间，如果没有就暂停了嘛

任务是干嘛的？根据数据的变化更新UI。整个循环就是在收集需要变更任务。

循环结束，变更任务收集完毕，然后统一更新UI即可

存在的第一个问题：循环肯定不可能是 开始-暂停-继续-暂停-完成 这么简单：循环到某个点的时候，怎么确保已经遍历的节点没有继续变化？进行检测

在完成单个节点的循环任务之后，都会去判断是否有更高优先级的任务插进来，如果有，不好意思，打断循环，重新开始

任务的优先级怎么定义呢？

存在的第二个问题：重新循环会不会造成性能浪费，之前遍历的那一部分都白费了？？

所以每个节点需要保存变化前的数据，还需要保存上一次循环时已经处理好的即将变化之后的数据，这样可以保证重新循环时原始的数据不会被污染，也可以在复用上次循环时已经执行的任务

由于每个节点默认都有其变化前的数据，再创建一个备份节点用于保存变化后的数据，最后将旧节点替换成备份节点就可以了吧，这里用到了双缓冲。当然也不是每个备份节点都可以被重复使用。

什么时候继续循环，什么时候中断循环 这些都是由调度器控制的

更新原因的不同，导致他们的优先级不同， [https://segmentfault.com/a/1190000038947307](https://segmentfault.com/a/1190000038947307)

事件优先级，不同的事件对应不同优先级

更新优先级，根据事件优先级计算更新优先级

任务优先级，上面提到的循环任务，存在前比后低，直接取消前；前等于后，复用前者；前比后高，先执行前，再对后重新执行一次调度

调度优先级