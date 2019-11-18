
## CSS概念

> 常见的块级元素和行内元素有哪些？块级元素有哪些特性

```
常用的块状元素有：
<div>、<p>、<h1>...<h6>、<ol>、<ul>、<dl>、<table>、<address>、<blockquote> 、<form>
常用的内联元素有：
<a>、<span>、<br>、<i>、<em>、<strong>、<label>、<q>、<var>、<cite>、<code>
常用的内联块状元素有：
<img>、<input>
```

块级元素特点：
* 每个块级元素都从新的一行开始，并且其后的元素也另起一行。（真霸道，一个块级元素独占一行）
* 元素的高度、宽度、行高以及顶和底边距都可设置。
* 元素宽度在不设置的情况下，是它本身父容器的100%（和父元素的宽度一致），除非设定一个宽度。

内联元素特点：
* 和其他元素都在一行上；
* 元素的高度、宽度及顶部和底部边距不可设置；
* 元素的宽度就是它包含的文字或图片的宽度，不可改变。

inline-block 元素特点：
* 和其他元素都在一行上；
* 元素的高度、宽度、行高以及顶和底边距都可设置。

> BFC是啥

参考[BFC](../知识点/CSS/BFC.md)

> 物理像素和逻辑像素有什么区别？

参考：[CSS像素、物理像素、逻辑像素、设备像素比、PPI、Viewpor](https://github.com/jawil/blog/issues/21)

PX(CSS pixels)实际是pixel（像素）的缩写，它是图像显示的基本单元，既不是一个确定的物理量，也不是一个点或者小方块，而是一个抽象概念。所以在谈论像素时一定要清楚它的上下文

设备像素(device pixels)，也称物理像素，顾名思义，显示屏是由一个个物理像素点组成的，通过控制每个像素点的颜色，使屏幕显示出不同的图像，屏幕从工厂出来那天起，它上面的物理像素点就固定不变了，单位pt。

设备独立像素(Device independent Pixel)，也称为逻辑像素，简称dip。我们可以简单理解为`CSS像素 =设备独立像素 = 逻辑像素`。window对象有一个devicePixelRatio属性，它的官方的定义为：设备物理像素和设备独立像素的比例，也就是 devicePixelRatio = 物理像素 / 独立像素

> 制作动画，频率多少合适

人眼最多看见每秒60帧，因此最小间隔为`1000ms/60`即`16.7ms`

> 什么是浮动？在什么场景下需要清浮动？清浮动有哪些方式？

[浮动](https://developer.mozilla.org/zh-CN/docs/CSS/float)定义：CSS属性`float`指定一个元素应沿其容器的左侧或右侧放置，允许文本和内联元素环绕它，该元素从网页的正常流动(文档流)中移除。

浮动会导致父元素高度塌陷，如不能正确展示父元素的背景颜色等问题

清除浮动有两种方式：
* 父元素触发BFC，浮动元素的高度也参与BFC高度计算，因此可以让父元素正确计算其高度
* 后面的相邻兄弟元素使用`clear`属性，使用clear的本质是引入了一个“清除区域”，清除区域是在元素上外边距之上额外增加了一个间距，且不允许任何浮动元素进入这个范围

> 什么是盒子模型？box-sizing各个取值的含义是什么？

盒模型又称框模型（Box Model）,包含了元素内容（content）、内边距（padding）、边框（border）、外边距（margin）几个要素。盒子模型分为两类：W3C标准盒子模型和IE盒子模型 ：
* W3C盒子模型——属性高（height）和属性宽（width）这两个值不包含 填充（padding）和边框（border）
* IE盒子模型——属性高（height）和属性宽（width）这两个值包含 填充（padding）和边框（border）

[box-sizing](https://developer.mozilla.org/zh-CN/docs/Web/CSS/box-sizing)属性定义了 user agent 应该如何计算一个元素的总宽度和总高度。
* `content-box`是默认值，表示使用W3C盒子模型计算，width表示元素内容宽度
* `border-box `表示使用IE模型计算，width表示元素内容+padding+border宽度之和

> float和position一起使用有什么效果？

* 当positon取值为`relative`时，二者可同时生效
* 当`position`取值为`absolute`或`fixed`时，只有`postion`定位属性会生效，float不会生效

> rem的原理？如何实现？有什么优缺点？

rem是CSS3新增的一个计量单位，是指相对于根元素的字体大小的单位。在移动端开发中，根据屏幕宽度动态设定根节点字体的大小，再将页面中所有的布局尺寸单位都使用rem进行换算，从而达到适配各种屏幕的效果

可以通过calc属性实现
```css
html {
    font-size: -webkit-calc((100vw / 750) * 100);
    font-size: calc((100vw / 750) * 100);
}
```
也可以通过JS动态计算实现
```js
(function() {
    var newRem = function() {
        var html = document.documentElement;
        html.style.fontSize = html.getBoundingClientRect().width / 10 + 'px';
    };
    window.addEventListener('resize', newRem, false);
    newRem();
})();
```

rem 布局的本质是等比缩放，一般是基于宽度，因此其
* 优点，宽度自适应，可以完美适配不同宽度的屏幕
* 缺点，高度不固定，如果遇到高度要求很严格的就实现不了

> CSS3特性了解多少？

新增了选择器、属性、CSS3动画、flex布局等

> 响应式布局实现原理？为何通过col-md可以在宽屏下覆盖col-sm的宽度？

利用媒介查询，在相关的 break-points 点，划分`xs`、`sm`、`md`和`lg`等不同尺寸的样式类，用于指定在对应分辨率下的网格大小。

在样式表中首先实现`xs`，然后根据媒介查询，依次实现后面的样式类，这样在大分辨率下的样式类会覆盖小分辨率的样式类，达到响应式的布局。

> 选择器的解析顺序是从左到右还是从右到左?

从右到左，因此选择器嵌套不宜过深。

> 隐藏一个元素有哪些方法，有什么区别？重绘和回流的区别？如何避免回流？

可以使用下面两种方式隐藏元素
* `display:none`，从文档流移除，会导致回流，此外也可以使用`height:0`等方式
* `visibility: hidden;`，仅仅是视觉上的隐藏，导致重绘

回流和重绘的定义
* 当Render Tree中部分或全部元素的尺寸、结构、或某些属性发生改变时，浏览器重新渲染部分或全部文档的过程称为回流
* 当页面中元素样式的改变并不影响它在文档流中的位置时（例如：color、background-color、visibility等），浏览器会将新样式赋予给元素并重新绘制它，这个过程称为重绘。
* 回流比重绘的代价要更高，有时即使仅仅回流一个单一的元素，它的父元素以及任何跟随它的元素也会产生回流。

可以从下面两个方面避免回流
* CSS方面
    * 避免使用table布局。
    * 尽可能在DOM树的最末端改变class。
    * 避免设置多层内联样式。
    * 将动画效果应用到position属性为absolute或fixed的元素上。
    * 避免使用CSS表达式（例如：calc()）。
* JavaScript方面
    * 避免频繁操作样式，最好一次性重写style属性
    * 避免频繁操作DOM，创建一个documentFragment
    * 也可以先为元素设置display: none，操作结束后再把它显示出来，此时操作不会依法回流和重绘
    * 避免频繁读取会引发回流/重绘的属性，如果确实需要多次使用，就用一个变量缓存起来
    * 对具有复杂动画的元素使用绝对定位，使它脱离文档流

> 你写的页面在哪些浏览器内核中测试过

目前主流的四大浏览器内核
* Trident，对应IE
* Gecko，对应firefox
* WebKit，对应chrome,safiri
* Presto，对应Opera前内核

> meta标签在移动开发中有什么用

可以实现下面功能
* 页面窗口自动调整到设备宽度，并禁止用户及缩放页面。
* 忽略将页面中的数字识别为电话号码
* 忽略Android平台中对邮箱地址的识别
* 当网站添加到主屏幕快速启动方式，可隐藏地址栏，仅针对iOS的safari
* 将网站添加到主屏幕快速启动方式，仅针对ios的safari顶端状态条的样式
* 需要在网站的根目录下存放favicon图标，防止404请求(使用fiddler可以监听到)


> 列举一些不可被继承的样式？

如：display，margin，border，padding，background，height，width，position等


## 代码编写

> SCSS除了变量定义、选择器嵌套之外有哪些功能？

SCSS很多特性都可以帮助我们快速高效地编写CSS代码
* 混合`@mixin`、`@include`和继承`%`、`@extend`
* 占位符`#{}`，可以用来拼接相应的属性，属性值甚至是选择器名称，构建可重用的样式
* 数组列表等数据结构
* 条件判断`@if`、`@else`和循环`@each`、`$for`等
* 功能函数、自定义函数`@function`

> 如何为class命名的？了解BEM吗？

[BEM](https://en.bem.info/methodology/key-concepts/)将样式类分成了块、元素和修饰符三个概念
* Block：逻辑和页面功能都独立的页面组件，是一个可复用单元，特点如下：
    * 可以随意嵌套组合
    * 可以放在任意页面的任何位置，不影响功能和外观
    * 可复用，界面可以有任意多个相同Block的实例
* Element：Block的组成部分，依赖Block存在（出了Block就不能用）
* Modify：[可选]定义Block和Element的外观及行为，就像HTML属性一样，能让同一种Block看起来不一样

BEM解决了模块复用、全局命名冲突等问题，但也带来了类名过长的问题，多人协作下需要增加学习成本。

> CSS Scoped和CSS Module了解吗？

CSS Scoped作用域是`Vue-loader`中的一个概念，当 `<style>` 标签有 scoped 属性时，它的 CSS 只作用于当前组件中的元素，其实现是编译时在标签上添加唯一的hash，然后通过结合属性选择器实现样式仅在当前有hash的标签上生效的
```css
.btn-red[sy8xaqwe] {}
```

CSS Module是通过构建工具（webpack or Browserify）来使所有的class达到scope的一个功能，且实现是在编译的时候替换对应的类名为一个唯一的值

```js
import type from "./type.css";

`<h1 class="${type.display}">This is a heading</h1>`;
// 输入如下结果
`<h1 class="Type__display__0980340 Type__serif__404840">Heading title</h1>`
```

## 代码实现

> 实现高度与宽度成比例的效果

主要原理是：一个元素的 `padding`  ，如果值是一个百分比，那这个百分比时相对于其父元素的宽度而言的
```html
 <div class="box">
    <div class="box_inner">content in here</div>
</div>
```
```css
.box {
    background-color: red;
    position: relative;
    width: 100px;
}
/* 由after撑开父元素 */
.box::after {
    content: '';
    display: block;
    width: 100%;
    padding-top: 50%;
}
/* 具体的内容在box_inner编写 */
.box_inner {
    position: absolute;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
}
```

> 实现圣杯布局

```html
<div class="bd">
    <div class="main text">
        main
    </div>
    <div class="left text">
        left
    </div>
    <div class="right text">
        right
    </div>
</div>
```

利用bfc实现
```css
.left {
    float: left;
    height: 100px;
    width: 100px;
}
.main {
    overflow: hidden;
    height: 100px;
}
.right {
    float: right;
    height: 100px;
    width: 100px;
}
```

利用flex实现
```css
.bd {
    display: flex;
}
.left {
    height: 100px;
    width: 100px;
    order: 1;
}
.main {
    order: 2;
    flex: 1;
    overflow: hidden;
    height: 100px;
}
.right {
    order: 3;
    height: 100px;
    width: 100px;
}
```

> 实现垂直居中

```html
<div class="wrap">
    <div class="box"></div>
</div>
```
采用绝对定位+位置偏移
```css
.box {
    position: absolute;
    top: 50%;
    /* margin-top: -50px; */ /* 适合高度已知的元素 */
    transform: translateY(-50%); /* 适合高度未知的元素 */
}
```
绝对定位+margin过分受限
```css
.box {
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto 0;
}
```
flex布局
```css
.wrap {
    display: flex;
    align-items: center;
}
```
表格布局
```css
.wrap {
    display: table-cell; 
    vertical-align: middle; 
}
```
还有比如line-height等hack方法就不提了



> CSS实现单行、多行文本溢出

```scss
// 单行
@mixin text-overflow {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

// 多行
@mixin text-overflow-line($i:2) {
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: $i;
}
```

> 修改placeholder文本样式

参考：[::placeholder](https://developer.mozilla.org/en-US/docs/Web/CSS/::placeholder)

```css
input::-webkit-input-placeholder {
    font-size: 14px;
    color: red;
}
```

> 修改chrome记住密码后自动填充表单的黄色背景 ？

```css
input:-webkit-autofill, textarea:-webkit-autofill, select:-webkit-autofill {
    background-color: #FAFFBD; 
    background-image: none;
    color: rgb(0, 0, 0);
}
```

> iOS下滚动容器不顺畅如何解决

添加`-webkit-overflow-scrolling:touch`解决，不过该属性在safari下会导致下滑时底部栏不收起

> 下面这道关于font-size和line-height的题如何理解

下面s1、s2、s5、s6的font-size和line-height分别是多少px，这里考察line-height的计算值
```css
.p1 {font-size: 16px; line-height: 32px;}
.s1 {font-size: 2em;}
.s2 {font-size: 2em; line-height: 2em;}

.p2 {font-size: 16px; line-height: 2;}
.s5 {font-size: 2em;}
.s6 {font-size: 2em; line-height: 2em;}
```
```html
<div class="p1">
    <div class="s1">1</div> <!--32px 32px-->
    <div class="s2">1</div> <!--32px 64px-->
</div>
<div class="p2">
    <div class="s5">1</div> <!--32px 64px-->
    <div class="s6">1</div> <!--32px 64px-->
</div>
```
知识点[传送门](../../知识点/CSS/基础知识.md#行高)
* 如果使用 em,ex 和百分数指定行高，都是相对于元素的 font-size 进行计算
* 如果使用百分数来设置行高，浏览器会首先计算其父元素的字体大小与对应百分数的乘积，得到对应的结果再传递给对应元素
* 如果使用乘积因子来指定行高，浏览器会计算该元素的字体大小，然后乘以对应的乘积因子，并将结果应用在行高之上

> border:none以及border:0的区别

从展示效果上来看，前者展示无边框，后者仅表示边框宽度为0

这二者还存在性能差异
* border:0;浏览器对border-width、border-color进行渲染，占用内存。
* border:none;浏览器不进行渲染，不占用内存。

此外还存在浏览器兼容问题
* IE7-不支持border:none;
* W3C提示：请始终把border-style属性声明到border-color属性之前，元素必须在改变颜色之前获得边框。

> flex-shrink计算规则

```html
 <style>
    div {
        height: 200px
    }
    .f {
        display: flex;
        width: 600px
    }
    .c1 {
        width: 500px;
        flex-shrink: 1;
        background-color: red
    }
    .c2 {
        width: 400px;
        flex-shrink: 2;
        background-color: blue
    }
</style>

<div class="f">
    <!--500 -  300 * 1 * 500 / (1*500+2*400) = 384.61 -->
    <div class="c1"></div>  
    <!--400 -  300 * 2 * 400 / (1*500+2*400) = 215.39 -->
    <div class="c2"></div>
</div>
```