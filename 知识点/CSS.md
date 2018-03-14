CSS
=== 


## 样式重置
CSS reset的作用是让各个浏览器的CSS样式有一个统一的基准。在项目中可以根据自己的需求选择性地进行样式重置。

以前看过张鑫旭大神的一篇博客:[CSS reset的重新审视 – 避免样式重置](http://www.zhangxinxu.com/wordpress/2010/04/css-reset%E7%9A%84%E9%87%8D%E6%96%B0%E5%AE%A1%E8%A7%86-%E9%81%BF%E5%85%8D%E6%A0%B7%E5%BC%8F%E9%87%8D%E7%BD%AE/)，感觉很有道理，不妨移步阅读一下。

## 选择器
参考之前的整理：
* [CSS权威指南》读书笔记之选择器](http://www.shymean.com/article/%E3%80%8ACSS%E6%9D%83%E5%A8%81%E6%8C%87%E5%8D%97%E3%80%8B%E8%AF%BB%E4%B9%A6%E7%AC%94%E8%AE%B0#2. %E9%80%89%E6%8B%A9%E5%99%A8)

选择器指定浏览器对不同的选择器应用不同的样式规则
* 语义选择器
    * 元素
        * 标签选择器
        * 伪元素选择器，`:after`、`:before`
        * 通配选择器，`*`
    * 类
        * 类选择器
        * 伪类选择器，`:link`,`:visited`,`:hover`,`:active`
    * ID选择器
* 属性选择器
    * 简单属性，如`a[title]`
    * 简单属性，如`a[href="http:www.google.com"]`
    * 部分属性，部分属性选择器类似于正则语法，通过属性值的某部分来筛选元素
* 结构选择器
    * 分组选择器，多个选择器之间使用`,`进行分隔
    * 多类选择器，限定只有同时包含这些类名的元素（与类名顺序无关）才能应用对应的声明规则
* 后代选择器
    * 空格结合符，包含所有后代子元素
    * 子结合符，`>`
    * 相邻兄弟结合符，`+`

此外还可以了解CSS3新增的一些选择器，如`:not`、`nth-of-type`等

问题：nth-of-type(n)和nth-child(n)
**nth-of-type**
参考[MDN文档](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:nth-of-type)
> 这个 CSS 伪类 匹配那些在它之前有 an+b-1 个相同类型兄弟节点的元素，其中 n 为正值或零值。

匹配同类型的兄弟元素中对应索引的元素，索引从1开始

**nth-child**
参考[MDN文档](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:nth-child)
> 这个 CSS 伪类匹配文档树中在其之前具有 an+b-1 个兄弟节点的元素，其中 n 为正值或零值。

简单点说就是，这个选择器匹配那些在同系列兄弟节点中的位置与模式 an+b 匹配的元素，其索引从1开始·

## 样式继承和权重值
参考之前的整理:
* [CSS继承与权重值](http://www.shymean.com/article/CSS%E7%BB%A7%E6%89%BF%E4%B8%8E%E6%9D%83%E9%87%8D%E5%80%BC)

> 如果有多条规则应用在同一元素上，则使用层叠解决

**继承**
子元素可以从父元素继承属性，样式继承机制是基于元素的，因此不同的元素可继承的样式可能不同，此外也包含一些通用的可继承与不可继承的属性

**权重值计算**
样式表中权重值ABCD的比较:
* 如果是内联样式，千位+1；
* 如果有id选择器，百位+1；
* 如果有类、伪类或者属性选择器，十位+1；
* 如果有标签名或伪元素选择器，个位+1； 

最后依次比较对应位置上的数字大小，需要注意的是并不会十进制进位（不是单纯的比较最后总数大小，虽然书上是这么说的，但是貌似不是完全正确。），也就是说0，0，1，0与0，0，0，11比较的话，前者的权重值仍然比后面高（但是一般应该没有连续嵌套11个标签名的做法吧，大概会被打死的...） 
* 对于`!important`，其权重值非常高，但是只当其是唯一存在的时候才有效果，当多次指定时将会抵消，仍按照上述计算公式计算比较。一般不使用`!important`，前辈的经验。
* 当多个规则应用在同一个元素上时，权重越高的样式将被优先采用；
* 当权重值相同的时候，在样式表中后定义的样式将覆盖先前定义的样式；

**注意**
需要理解的是，**继承而来的属性值权重值是非常低的，权重值永远低于明确指定到元素的定义，甚至低于通配符**。

只有当一个元素的某个属性没有被直接指定时，才会继承父级元素的值，也就是说可以使用一个更“具体的”选择符属性覆盖继承自祖先的属性而忽略权重值的问题。
```html
<style>
    #r { color：red }
    span { color:blue }
</style>

<p id="r"><span> hello</span></p>
```
尽管前者的权重值远大于后者，但是span里面的字体颜色仍然是蓝色。

## 盒子模型
> 在CSS中，使用标准盒模型描述这些矩形盒子中的每一个。这个模型描述了元素所占空间的内容。每个盒子有四个边：外边距边, 边框边, 内填充边 与 内容边。 
* 在标准模式下，一个块的总宽度=width+margin(左右)+padding(左右)+border(左右)
* 在怪异(ie)模式下，一个块的总宽度=width+margin（左右）（既width已经包含了padding和border值）

**box-sizing**
> 更改用于计算元素宽度和高度的默认的 CSS 盒子模型

* content-box  是默认值。如果你设置一个元素的宽为100px，那么这个元素的内容区会有100px宽，并且任何边框和内边距的宽度都会被**增加**到最后绘制出来的元素宽度中。
* border-box 告诉浏览器去理解你设置的边框和内边距的值是包含在width内的。也就是说，如果你将一个元素的width设为100px,那么这100px会包含其它的border和padding，内容区的实际宽度会是width减去border + padding的计算值。大多数情况下这使得我们更容易的去设定一个元素的宽高

## 外边距折叠
> collapsing-margin，两个或多个毗邻的普通流中的块元素垂直方向上的 margin 会重叠

参考之前的[整理](http://www.shymean.com/article/%E5%A4%96%E8%BE%B9%E8%B7%9D%E9%87%8D%E5%8F%A0)

## BFC
参考之前的整理：
* [BFC及其应用](http://www.shymean.com/article/BFC%E5%8F%8A%E5%85%B6%E5%BA%94%E7%94%A8)

盒子模型，这是CSS布局的对象和基本单位，不同的盒子，其渲染方式（`Formatting Context`）是不一样的，display属性为block的盒子，就会参与block fomatting context，也就是上面所说的BFC。

需要了解BFC的布局规则、触发条件和应用场景这三个点。

## 浮动与清浮动
参考之前的整理
* [浮动与清浮动](http://www.shymean.com/article/%E6%B5%AE%E5%8A%A8%E4%B8%8E%E6%B8%85%E6%B5%AE%E5%8A%A8)

> 不管多么复杂的布局，其最终目标是都为了在同一行排列多个块级元素，可以通过让块级元素脱离文档流实现

### 浮动
浮动元素有以下特性
* 浮动的元素会以某种形式从文档的正常流中移除，但还是会影响布局：
* 浮动元素在竖直方向上的外边距并不会合并（触发了BFC）；
* 浮动元素的包含块是距离其最近的块级祖先元素；
* 浮动元素都会产生一个块级浮动框，而不论该元素本身是什么类型（要记住，所有元素都可以浮动），因此对浮动的元素显式声明display:block是多此一举；
* 有一系列的规则控制着浮动元素的摆放，比如：
    * 浮动元素彼此无法覆盖；
    * 浮动元素的外边界无法超过其包含块的内边界（当然使用负边界可以达到这样的效果）；
    * 浮动元素在竖直方向上会尽可能高地摆放，但是其顶端不能比之前的浮动元素或者块级元素的顶端更高；
    * 浮动元素在水平方向上会尽可能向左或者向右摆放，且位置越高，漂浮的更远；
* 行内框与一个浮动元素重叠时，其边框，背景和内容都在该浮动元素之上显示（只有在浮动元素具有负边框的情况下才会看见这个情况）；
* 块级元素与一个浮动元素重叠时，其边框和背景都在该浮动元素之下显示，而内容在浮动元素之上显示；


### 清浮动
在实际的布局中，经常不设置父级盒子的高度，而是由内容自动决定的。浮动使元素脱离文档流，可能导致父级元素高度塌陷甚至消失的情况。
清除浮动主要有两种做法，一种是采用clear属性，这是真正意义上的清除；而另一种是使父元素正确计算其高度，也就是使父元素触发BFC。

**clear**
clear属性指定一个元素是否可以在它之前的浮动元素旁边，或者必须向下移动(清除浮动) 在它的下面。clear 属性适用于浮动和非浮动元素
为了减少标签数量，一般的清浮动类使用伪类实现
```css
.clearfix { *zoom: 1; } /* 兼容 IE 低版本 */
.clearfix:after { content: "";display: table; clear: both; }；
```
使用clear进行清浮动，可以指定该元素的对应方向上不存在浮动元素，在CSS2.1中，使用clear的本质是引入了一个“清除区域”，清除区域是在元素上外边距之上额外增加了一个间距，且不允许任何浮动元素进入这个范围。这样造成的结果是设置了清浮动的元素的上边框边界推到了刚好越过浮动元素下边界的情况，出现“设置了上边距却没有出现间隔”的情况，解决这种情况的一个办法是设置浮动元素的下边距，相当于延长了浮动元素的下边界，从而达到预期的效果，具体的原理只有一句话：浮动元素的外边距边界定义了浮动框的边界（参考《CSS权威指南》）

**bfc**
让父元素触发BFC有多种方式，如果不是特定的布局，`overflow:hidden`就够用了。
```
.parent {
    overflow: hidden
}
```

## 定位
参考之前的整理
* [CSS权威指南读书笔记之定位](http://www.shymean.com/article/%E3%80%8ACSS%E6%9D%83%E5%A8%81%E6%8C%87%E5%8D%97%E3%80%8B%E8%AF%BB%E4%B9%A6%E7%AC%94%E8%AE%B0#8. %E6%B5%AE%E5%8A%A8%E5%92%8C%E5%AE%9A%E4%BD%8D)

不同类型的定位会影响对应元素框的生成：
* static，块级元素生成矩形元素框，并作为文档流的一部分，内联元素生成行内框，置于其父元素中；
* relative，元素偏移某个距离，其原本所占据的文档流位置仍然保留，其包含块由最近的块级框，表格单元格或者行内块祖先框的内容边界构成，
* absolute，元素框从文档流中完全删除，并相当于其包含块定位，其包含块由最近的position属性值不为static的祖先元素的内容边界构成
* fixed，根据浏览器视窗确定位置

不同的定位形式会影响`top`、`bottom`、`left`、`right`等属性的计算。

这里需要了解元素定位时**过分受限**（margin:auto）的情形，浏览器会忽略对应方向上的偏移并重新计算其偏移，甚至是竖直范行方向上的外边距，因此可以使用margin: auto 0达到竖直居中

## 包含块
参考
* [MDN文档](https://developer.mozilla.org/zh-CN/docs/Web/CSS/All_About_The_Containing_Block)

如果元素某些属性被赋予一个**百分值**的话，它的计算值是由这个元素的包含块计算而来的。这些属性包括盒模型属性和偏移属性：
* height, top, bottom 这些属性由包含块的 height 属性的值来计算它的百分值。如果包含块的 height 值依赖于它的内容，且包含块的 position 属性的值被赋予 relative 或 static的话，这些值的计算值为0。
* width, left, right, padding, margin这些属性由包含块的 width 属性的值来计算它的百分值。

确定包含块的过程完全依赖于这个包含块的`position`属性
* position为relative或者static的元素，它的包含块由最近的块级（display为block,list-item, table）祖先元素的内容框组成
* 如果元素position为fixed，包含块就是由 viewport 组成的
* 如果元素position为absolute，它的包含块就是由它的最近的 position 的值不是 static （fixed, absolute, relative, or sticky）的祖先元素的内边距区的边缘组成的

## flex
参考之前的整理
* [flex布局](http://www.shymean.com/article/flex%E5%B8%83%E5%B1%80)

flex现在在移动端的兼容性已经非常好了，目前基本可以应用在生产项目中。
需要理解**容器**（父元素）和**项目**（子元素）这两个概念，然后学习和理解其语法就容易得多了。

## CSS3动画系统
这里等我单独整理一篇博客先...
### 形变
`transform`

### 渐变动画
`transiton`

### 逐帧动画
`@keyframes`、`animation`

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

## 栅格系统响应式原理
这里有一个简单的[实现](https://github.com/tangxiangmin/cssMagic/blob/master/src/scss/layout/_grid.scss)

```
<div class="xs-6 sm-4 md-3 lg-2"></div>
```
利用媒介查询，在相关的break-points点，划分`xs`、`sm`、`md`和`lg`等不同尺寸的样式类，用于指定在对应分辨率下的网格大小。
首先实现`xs`，然后依次实现后面的样式类，这样在大分辨率下的样式类会覆盖小分辨率的样式类，达到响应式的布局。



## Rem实现及注意事项
* [使用Flexible实现手淘H5页面的终端适配](https://github.com/amfe/article/issues/17)
* 基于calc和vw实现的rem布局

## ViewPort
```
<meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" />
// width    设置viewport宽度，为一个正整数，或字符串‘device-width’
// device-width  设备宽度
// initial-scale    默认缩放比例（初始缩放比例），为一个数字，可以带小数
// minimum-scale    允许用户最小缩放比例，为一个数字，可以带小数
// maximum-scale    允许用户最大缩放比例，为一个数字，可以带小数
// user-scalable    是否允许手动缩放
```

## CSS开启硬件加速
[参考](https://www.cnblogs.com/PeunZhang/p/3510083.html)

**优点**
现在大多数电脑的显卡都支持硬件加速。鉴于此，我们可以发挥GPU的力量，从而使我们的网站或应用表现的更为流畅

**触发条件**
* 3D变换会触发, `translate3d`、`rotate3d`和`scale3d`
* translateZ(0)

当使用CSS transforms 或者 animations时可能会有页面闪烁的效果，可以使用`transform: translate3d(0, 0, 0)`修复


**缺点**
使用GPU可能会导致严重的性能问题，因为它增加了内存的使用，而且它会减少移动端设备的电池寿命。

## SCSS、LESS

提供更有效的编写CSS样式表的工具
以SCSS为例，需要理解常用特性如：变量、混合、继承、函数、循环、分支、导入组件等

## CSS Module
[github地址](https://github.com/css-modules/css-modules)

**作用**
modular and reusable CSS!
* No more conflicts.
* Explicit dependencies.
* No global scope.

**使用方法**
编写样式表
```css
/* style.css */
.className {
  color: green;
}
```
在引入一个css模块时，会将其导出一个JS对象，并将局部类名映射为全局类名。
```js
import styles from "./style.css";
// import { className } from "./style.css";

element.innerHTML = '<div class="' + styles.className + '">';
```

## BEM
参考之前的整理
* [使用BEM声明CSS样式名](http://www.shymean.com/article/%E4%BD%BF%E7%94%A8BEM%E5%A3%B0%E6%98%8ECSS%E6%A0%B7%E5%BC%8F%E5%90%8D)

其核心思想是理解块、元素和修饰符的关系

## 精灵图
> 将多个小图片拼接到一个图片中。通过background-position和元素尺寸调节需要显示的背景图案。

优点：
* 减少HTTP请求数，极大地提高页面加载速度
* 增加图片信息重复度，提高压缩比，减少图片大小

缺点：
* 图片合并麻烦
* 维护麻烦，修改一个图片可能需要从新布局整个图片，样式
* 缩放调整图标大小比较麻烦

## FOUC
Flash Of Unstyled Content：用户定义样式表加载之前浏览器使用默认样式显示文档，用户样式加载渲染之后再从新显示文档，造成页面闪烁。

解决方法：把样式表放到文档的head
