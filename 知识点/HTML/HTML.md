HTML
===
整理HTML文档中一些常见的问题。

## 语义化
所谓“语义”就是为了更易读懂，用正确的标签做正确的事情，这要分两部分：
* 让人（写程序、读程序）更易读懂， 即使在没有样式CSS情况下也以一种文档格式显示，使阅读源代码的人对网站更容易将网站分块，便于阅读维护理解。
* 让机器（浏览器、搜索引擎）更易读懂，让页面的内容结构化，结构更清晰，爬虫也依赖于HTML标记来确定上下文和各个关键字的权重，利于SEO

## 浏览器加载HTML文档
此处需要对网络有个大概的认识
* DNS服务器解析域名
* HTTP报文
* TCP连接三次握手、四次挥手
* IP地址
* 广播MAC寻址
* 服务器CGI程序

## 浏览器解析流程
* [浏览器解析HTML的流程](http://www.shymean.com/article/%E6%B5%8F%E8%A7%88%E5%99%A8%E8%A7%A3%E6%9E%90HTML%E7%9A%84%E6%B5%81%E7%A8%8B)

* CSS文档的加载和解析，阻塞的是脚本的执行而不是脚本的加载。
* 而同步JS脚本的加载解析和执行，是会影响HTML解析器的工作，导致后面的所有资源都无法被加载。

## 浏览器渲染流程
参考：
* [浏览器的渲染原理简介](https://coolshell.cn/articles/9666.html)
* [浏览器渲染流程](http://www.shymean.com/article/%E6%B5%8F%E8%A7%88%E5%99%A8%E6%B8%B2%E6%9F%93%E6%B5%81%E7%A8%8B)

下面展示了大概的渲染过程
* 浏览器会解析三个东西：
    * 一个是HTML/SVG/XHTML，事实上，Webkit有三个C++的类对应这三类文档。解析这三种文件会产生一个DOM Tree。
    * CSS，解析CSS会产生CSS规则树。
    * Javascript，脚本，主要是通过DOM API和CSSOM API来操作DOM Tree和CSS Rule Tree.
* 解析完成后，浏览器引擎会通过DOM Tree 和 CSS Rule Tree 来构造 Rendering Tree。注意：
    * Rendering Tree 渲染树并不等同于DOM树，因为一些像Header或display:none的东西就没必要放在渲染树中了。
    * CSS 的 Rule Tree主要是为了完成匹配并把CSS Rule附加上Rendering Tree上的每个Element。也就是DOM结点。也就是所谓的Frame。
    * 然后，计算每个Frame（也就是每个Element）的位置，这又叫layout和reflow过程。
* 最后通过调用操作系统Native GUI的API绘制。


### 浏览器内核
* Trident内核：IE,MaxThon,TT,The World,360,搜狗浏览器等。[又称MSHTML]
* Gecko内核：Netscape6及以上版本，firefox, MozillaSuite/SeaMonkey等
* Presto内核：Opera7及以上。      [Opera内核原为：Presto，现为：Blink;]
* Webkit内核：Safari,Chrome等。   [ Chrome的：Blink（WebKit的分支）]

### HTML5新增功能
* 绘画 canvas;
* 用于媒介回放的 video 和 audio 元素;
* 本地离线存储localStorage和sessionStorage
* 语义化标签
* webworker、websocket、Geolocation

### cookies，sessionStorage 和 localStorage
相同：都是保存在浏览器，且同源的。
区别：
* cookies 和 ＊Storage 的区别：
    * cookies会在服务器端和客户端间传递的；
    * sessionStorage 和 localStorage存放在客户端的，不会发送至服务器端，仅在本地保存。
    * cookies的兼容主流浏览器,包括IE6+;IE6，IE7不支持sessionStorage 和 localStorage
    * sessionStorage 和 localStorage中能存的数据比cookie大（cookie不能超过4k）
* sessionStorage 和 localStorage的区别：
    * sessionStorage存的数据在每次关闭浏览器后被删除，localStorage不会。
    * 作用域不同，sessionStorage不在不同的浏览器窗口中共享，即使是同一个页面（刷新页面可以继续存在）；
    * localStorage 在所有同源窗口中都是共享的；cookie也是在所有同源窗口中都是共享的

### script标签的加载，async和defer
决定了脚本加载时采用同步方式还是异步方式。
* 如果不加上这两个属性，默认为同步加载脚本，加载和执行时会阻塞页面的渲染，即浏览器按顺序解析DOM树及脚本，遇见脚本会阻塞DOM树生成并执行脚本。
* async 和 defer 方式是用异步的方式加载脚本，不会阻塞页面渲染，它们之间的不同在于何时执，async 方式是加载后马上执行，defer 方式是加载后等所有 DOM 都渲染好触发 DOMContentLoaded 事件之前执行，所以 async 方式里面的脚本都是乱序执行，defer 方式加载的代码都是按序执行的，按序执行对有依赖的代码非常重要。
* 若两个属性同在，会忽略defer而遵从async

### 移动开发中meta知识点
* 页面窗口自动调整到设备宽度，并禁止用户及缩放页面。
* 忽略将页面中的数字识别为电话号码
* 忽略Android平台中对邮箱地址的识别
* 当网站添加到主屏幕快速启动方式，可隐藏地址栏，仅针对iOS的safari
* 将网站添加到主屏幕快速启动方式，仅针对ios的safari顶端状态条的样式
* 需要在网站的根目录下存放favicon图标，防止404请求(使用fiddler可以监听到)


## webp
WebP具有更优的图像数据压缩算法，能带来更小的图片体积，而且拥有肉眼识别无差异的图像质量；同时具备了无损和有损的压缩模式、Alpha 透明以及动画的特性，在 JPEG 和 PNG 上的转化效果都相当优秀、稳定和统一。
不过在IE和和safari，以及部分移动端浏览器上不兼容，会导致图片加载失败