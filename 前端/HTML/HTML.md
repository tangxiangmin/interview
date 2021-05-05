
## W3C标准
万维网联盟（外语缩写：W3C）标准不是某一个标准，而是一系列标准的集合。网页主要由三部分组成：结构（Structure）、表现（Presentation）和行为（Behavior）
* 结构标准语言
    * 可扩展标记语言XML
    * 可扩展超文本标记语言XHTML
* 表现标准语言
    * 层叠样式表CSS
* 行为标准语言
    * 文档对象模型DOM
    * ECMAScript


### doctype有什么作用？怎么写
DOCTYPE是document type的简写，它是一种标记语言的文档类型声明，即告诉浏览器当前 HTML 是用什么版本编写的，决定了浏览器最终如何显示你的 Web文档。在遵循标准的任何Web文档中，它都是一项必需的元素。

标准模式和怪异模式
* `Standards`：标准模式，浏览器使用W3C的标准解析渲染页面。在标准模式中，浏览器以其支持的最高标准呈现页面。
* `Limited Quirks`：几乎标准模式，和标准模式之间的唯一差异在于是否对元素给定行高（line-height）和基线
* `Quirks`：怪异模式，浏览器使用自己的怪异模式解析渲染页面。在怪异模式中，页面以一种比较宽松的向后兼容的方式显示。



### 标签语义化
所谓“语义”就是为了更易读懂，用正确的标签做正确的事情，这要分两部分：
* 让人（写程序、读程序）更易读懂， 即使在没有样式CSS情况下也以一种文档格式显示，使阅读源代码的人对网站更容易将网站分块，便于阅读维护理解。
* 让机器（浏览器、搜索引擎，盲人阅读器等）更易读懂，让页面的内容结构化，结构更清晰，爬虫也依赖于HTML标记来确定上下文和各个关键字的权重，利于SEO

此外HTML 5 提供了一些新的语义化元素标签和属性，如`article`、`nav`、`header`等，参考：
* [Html5新标签解释及用法](http://www.daqianduan.com/2857.html)。
* [大多数前端工程师了解但并不擅长的HTML语义化](https://juejin.im/post/5de090ae6fb9a0718d4cb039)



## 浏览器

### 浏览器内核
* Trident内核：IE,MaxThon,TT,The World,360,搜狗浏览器等。[又称MSHTML]
* Gecko内核：Netscape6及以上版本，firefox, MozillaSuite/SeaMonkey等
* Presto内核：Opera7及以上。[Opera内核原为：Presto，现为：Blink;]
* Webkit内核：Safari,Chrome等。   [ Chrome的：Blink（WebKit的分支）]

### 浏览器解析流程
参考
* [浏览器解析HTML的流程](http://www.shymean.com/article/%E6%B5%8F%E8%A7%88%E5%99%A8%E8%A7%A3%E6%9E%90HTML%E7%9A%84%E6%B5%81%E7%A8%8B)

当浏览器**从上到下**解析整个HTML文档时，

如果遇见外部URL资源，就会发送请求加载对应文件（现代浏览器可能会同时发送多个请求加载文件）。

如果遇见内联的样式表，就会立即解析（但不一定会立即渲染出样式）；如果遇见内联的脚本，就会立即解析和执行；

**样式表阻塞**

当HTML解析器遇见一个style标签时，会按顺序解析里面的样式；当HTML解析器遇见一个link标签，会发送一个外部样式表的请求。这样的后果是到导致后面的后面的JS代码
* 如果是内联脚本，则必须等待前面的样式表加载和解析完成才会执行
* 如果是外部脚本，浏览器会发送下载外部脚本文件的请求（CSS文件和JS文件可能同步下载），即使文件已经返回，也必须等待前面的样式表加载和解析完成

这是因为JS执行依赖最新的CSS渲染（或者说最精确的样式信息）。

**脚本阻塞**

如果遇见普通的script（无async或defer）时，不论他是内联脚本还是外部脚本，都会阻塞浏览器进一步解析HTML文档（即暂时无法处理这个脚本后面其他需要加载的URL），而必须等待该标签代表的脚本文件执行完毕（如果是外联的脚本，甚至需要等到这个js文件加载成功并执行完毕。

这是因为：JS可能影响后续的文档，可能向文档流中插入信息，也可能改变后续script脚本的全局变量，因此浏览器干脆在解析和执行script标签的时候，阻塞后续文档的解析

整理上面可以得到下面结论
* CSS文档的加载和解析，阻塞的是脚本的执行而不是脚本的加载。
* 同步JS脚本的加载解析和执行，是会影响HTML解析器的工作，导致后面的所有资源都无法被加载。



### DOMContentLoaded与load

当文档中没有脚本时，浏览器解析完文档便能触发 DOMContentLoaded 事件；如果文档中包含脚本，则脚本会阻塞文档的解析，而脚本需要等位于脚本前面的css加载完才能执行。在任何情况下，DOMContentLoaded 的触发不需要等待图片等其他资源加载完成。

页面上所有的资源（图片，音频，视频等）被加载以后才会触发load事件，简单来说，页面的load事件会在DOMContentLoaded被触发之后才触发。

参考
* [DOMContentLoaded](https://developer.mozilla.org/zh-CN/docs/Web/Events/DOMContentLoaded)
* [DOMContentLoaded与load的区别](https://www.cnblogs.com/caizhenbo/p/6679478.html)

`script`标签上的`async`和`defer`的区别，参考[Script - MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/script)

script标签上的`async`和`defer`属性，决定了脚本加载时采用同步方式还是异步方式。

* 如果不加上这两个属性，默认为同步加载脚本，加载和执行时会阻塞页面的渲染，即浏览器按顺序解析DOM树及脚本，遇见脚本会阻塞DOM树生成并执行脚本。
* async 和 defer 方式是用异步的方式加载脚本，不会阻塞页面渲染，它们之间的不同在于何时执，
    * async 方式是加载后马上执行，
    * defer 方式是加载后等所有 DOM 都渲染好触发 DOMContentLoaded 事件之前执行，
    * 所以 async 方式里面的脚本都是乱序执行，defer 方式加载的代码都是按序执行的，按序执行对有依赖的代码非常重要。
    * 若两个属性同在，会忽略defer而遵从async

通过动态生成script的方法，可以实现`JSONP`等功能

### 浏览器渲染流程
参考：
* [浏览器的渲染原理简介](https://coolshell.cn/articles/9666.html)
* [浏览器渲染流程](http://www.shymean.com/article/%E6%B5%8F%E8%A7%88%E5%99%A8%E6%B8%B2%E6%9F%93%E6%B5%81%E7%A8%8B)

下面展示了大概的渲染过程

![](https://coolshell.cn/wp-content/uploads/2013/05/Render-Process.jpg)

* 浏览器首先解析三个东西：
    * HTML/SVG/XHTML，产生一个DOM Tree。
    * CSS，产生CSS Rule Tree。
    * Javascript，主要是通过DOM API和CSSOM API来操作DOM Tree和CSS Rule Tree.
* 解析完成后，浏览器引擎会通过DOM Tree 和 CSS Rule Tree 来构造 Rendering Tree。注意：
    * Rendering Tree 渲染树并不等同于DOM树，因为一些像Head或display:none的东西就没必要放在渲染树中了。
    * CSS 的 Rule Tree主要是为了完成匹配并把CSS Rule附加上Rendering Tree上的每个DOM结点。
    * 然后计算DOM结点的位置，这又叫layout和reflow过程。
* 最后通过调用操作系统Native GUI的API绘制。

**Repaint重绘**

Repaint表示页面上某个元素的的非定位样式需要重新绘制（比如利用JS改变了元素节点的背景颜色，此时不需要重新布局）

**Reflow回流**

Reflow表示元素节点的几何尺寸发生了变化，此时需要重新计算并构建渲染树（即此时需要重新布局），成本比Repaint的成本高得多的多

下面是几条减少Repaint和Reflow的原则
* 不要一条一条地修改DOM的样式，如果修改的样式过多可以将样式统一在某个类中，然后直接更改元素节点的className；
* 使用临时变量保存DOM节点，而不是每次都直接对DOM节点进行操作（减少元素节点的读写），在JS性能与浏览器性能方面都能得到一些优化；
* 尽可能修改层级比较低的DOM，缩小操作的影响范围；
* 放弃使用table进行布局，因为一个很小的改动都会造成整个table的重新布局


## HTML5
新增功能
* 绘画 canvas;
* 用于媒介回放的 video 和 audio 元素;
* 本地离线存储localStorage和sessionStorage
* 语义化标签
* webworker、websocket、Geolocation

## 移动开发
参考：
* [你还会再爱一次的H5移动端开发技巧](https://mp.weixin.qq.com/s/CfEHh4DLDDk4hOv075q3Lg)

通过HTML可以实现移动开发的一些功能，如移动端开发如通过input pattern控制键盘类型，schema跳转APP等技巧

### 移动开发中meta知识点
* 页面窗口自动调整到设备宽度，并禁止用户及缩放页面。
* 忽略将页面中的数字识别为电话号码
* 忽略Android平台中对邮箱地址的识别
* 当网站添加到主屏幕快速启动方式，可隐藏地址栏，仅针对iOS的safari
* 将网站添加到主屏幕快速启动方式，仅针对ios的safari顶端状态条的样式

### webp
WebP具有更优的图像数据压缩算法，能带来更小的图片体积，而且拥有肉眼识别无差异的图像质量；同时具备了无损和有损的压缩模式、Alpha 透明以及动画的特性，在 JPEG 和 PNG 上的转化效果都相当优秀、稳定和统一。
不过在IE和和safari，以及部分移动端浏览器上不兼容，会导致图片加载失败

## 图片

参考: [png、jpg、gif三种图片格式的区别](https://blog.csdn.net/minggeqingchun/article/details/78748550)

矢量图和位图
* 矢量图是 通过组成图形的一些基本元素，如点、线、面，边框，填充色等信息通过计算的方式来显示图形的
* 位图又叫像素图或栅格图，它是通过记录图像中每一个点的颜色、深度、透明度等信息来存储和显示图像

web页面中所使用的JPG、PNG、GIF格式的图像都是位图，

JPG是我们最常见的采用有损压缩对图像信息进行处理的图片格式。JPG在存储图像时会把图像分解成8*8像素的栅格，这些8*8栅格中很多细节信息被去除，而通过一些特殊算法用附近的颜色进行填充然后对每个栅格的数据进 行压缩处理

无损压缩则会真实的记录图像上每个像素点的数据信息，但为了压缩图像文件的大小会采取一些特殊的算法。无损压缩的压缩原理是先判断图像上哪些区域的颜色是相同的，哪 些是不同的，然后把这些相同的数据信息进行压缩记录

* JPG更适合用来存储摄影或写实图像，但不适用于所含颜色很少、具有大块颜色相近的区域或亮度差异十分明显的较简单的图片
* PNG能在保证最不失真的情况下尽可能压缩图像文件的大小，但是体积可能会比较大

## 无头浏览器
参考
* [初识puppeteer](https://www.shymean.com/article/%E5%88%9D%E8%AF%86puppeteer)