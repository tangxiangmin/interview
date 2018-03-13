HTML
===

## 语义化
所谓“语义”就是为了更易读懂，这要分两部分：
* 让人（写程序、读程序）更易读懂
* 让机器（浏览器、搜索引擎）更易读懂

此外注意HTML5 标准中增加了`header`，`section`，`artical`等标签


## 浏览器解析流程
* [浏览器解析HTML的流程](http://www.shymean.com/article/%E6%B5%8F%E8%A7%88%E5%99%A8%E8%A7%A3%E6%9E%90HTML%E7%9A%84%E6%B5%81%E7%A8%8B)

* CSS文档的加载和解析，阻塞的是脚本的执行而不是脚本的加载。
* 而同步JS脚本的加载解析和执行，是会影响HTML解析器的工作，导致后面的所有资源都无法被加载。

## 浏览器渲染流程
参考：
* [浏览器的渲染原理简介](https://coolshell.cn/articles/9666.html)
* [浏览器渲染流程](http://www.shymean.com/article/%E6%B5%8F%E8%A7%88%E5%99%A8%E6%B8%B2%E6%9F%93%E6%B5%81%E7%A8%8B)

### 流程
* 浏览器会解析三个东西：
    * 一个是HTML/SVG/XHTML，事实上，Webkit有三个C++的类对应这三类文档。解析这三种文件会产生一个DOM Tree。
    * CSS，解析CSS会产生CSS规则树。
    * Javascript，脚本，主要是通过DOM API和CSSOM API来操作DOM Tree和CSS Rule Tree.
* 解析完成后，浏览器引擎会通过DOM Tree 和 CSS Rule Tree 来构造 Rendering Tree。注意：
    * Rendering Tree 渲染树并不等同于DOM树，因为一些像Header或display:none的东西就没必要放在渲染树中了。
    * CSS 的 Rule Tree主要是为了完成匹配并把CSS Rule附加上Rendering Tree上的每个Element。也就是DOM结点。也就是所谓的Frame。
    * 然后，计算每个Frame（也就是每个Element）的位置，这又叫layout和reflow过程。
* 最后通过调用操作系统Native GUI的API绘制。

### Repaint 和Refollow
需要注意他们带来的性能影响

**概念**
* 部分渲染树（或者整个渲染树）需要重新分析并且节点尺寸需要重新计算。这被称为**重排**。注意这里至少会有一次重排-初始化页面布局。
* 由于节点的几何属性发生改变或者由于样式发生改变，例如改变元素背景色时，屏幕上的部分内容需要更新。这样的更新被称为**重绘**。

**何时触发**
* 添加、删除、更新 DOM 节点
* 通过 display: none 隐藏一个 DOM 节点-触发重排和重绘
* 通过 visibility: hidden 隐藏一个 DOM 节点-只触发重绘，因为没有几何变化
* 移动或者给页面中的 DOM 节点添加动画
* 添加一个样式表，调整样式属性
* 用户行为，例如调整窗口大小，改变字号，或者滚动。
