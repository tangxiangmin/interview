BFC
===

## BFC管理
参考之前的整理：
* [BFC及其应用](http://www.shymean.com/article/BFC%E5%8F%8A%E5%85%B6%E5%BA%94%E7%94%A8)

盒子模型，是CSS布局的对象和基本单位，元素的类型与display的属性，决定了这个盒子的类型。不同的盒子，其渲染方式（`Formatting Context`）是不一样的，display属性为block的盒子，就会参与`block fomatting context`，也就是上面所说的BFC。

常见的外边距折叠、清浮动等问题都可以归根到BFC处理。

### 触发场景
满足下面任意一个条件的块级元素都会触发BFC
* 根元素，是指文档树中没有父元素的元素，也就是最顶层结构的元素，一般情况下是html元素；
* float属性不为none，即float为left||right；
* position不为relative，即position为absolute||fixed；
* display为inline-block, table-cell, table-caption, flex, inline-flex，这里特别需要注意的是inline-block。
* overflow不为visible，即overflow为hidden||auto||scroll，这里特别需要注意的是hidden;

### 布局规则
* 内部的Box会在垂直方向，一个接一个地放置。
* Box垂直方向的距离由margin决定。属于同一个BFC的两个相邻Box的margin会发生重叠，准确的说只有在同一个BFC内的元素才会发生外边距折叠。
* 每个元素的margin box的左边， 与包含块border box的左边相接触(对于从左往右的格式化，否则相反)。即使存在浮动也是如此。
* BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之也如此，这就是BFC所具有的大名鼎鼎的独立区域属性，躲进小楼成一统，管它春夏与秋冬。
* BFC的区域不会与float box重叠,即旁边的浮动元素是无法遮挡住BFC元素的。
* BFC可以包含浮动元素，意思就是BFC的高度计算是包括其浮动的子元素的，浮动元素的高度也参与BFC高度计算（重要的事情说两遍！），这下即使子元素全部都是浮动元素，BFC也可以知道它自己的高度了。


## 外边距折叠
> collapsing-margin，两个或多个毗邻的普通流中的块元素垂直方向上的 margin 会重叠

参考之前的[整理](http://www.shymean.com/article/%E5%A4%96%E8%BE%B9%E8%B7%9D%E9%87%8D%E5%8F%A0)

## 浮动与清浮动
参考
* [浮动与清浮动](http://www.shymean.com/article/%E6%B5%AE%E5%8A%A8%E4%B8%8E%E6%B8%85%E6%B5%AE%E5%8A%A8)
* [MDN文档](https://developer.mozilla.org/zh-CN/docs/CSS/float)

> `float` CSS属性指定一个元素应沿其容器的左侧或右侧放置，允许文本和内联元素环绕它。该元素从网页的正常流动(文档流)中移除，尽管仍然保持部分的流动性（与绝对定位相反）。

### 浮动

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
使用clear进行清浮动，可以指定该元素的对应方向上不存在浮动元素。

在CSS2.1中，使用clear的本质是引入了一个“清除区域”，清除区域是在元素上外边距之上额外增加了一个间距，且不允许任何浮动元素进入这个范围。这样造成的结果是设置了清浮动的元素的上边框边界推到了刚好越过浮动元素下边界的情况，出现“设置了上边距却没有出现间隔”的情况，解决这种情况的一个办法是设置浮动元素的下边距，相当于延长了浮动元素的下边界，从而达到预期的效果，具体的原理只有一句话：浮动元素的外边距边界定义了浮动框的边界（参考《CSS权威指南》）

**bfc**
让父元素触发BFC有多种方式，如果不是特定的布局，`overflow:hidden`就够用了。
```
.parent {
    overflow: hidden
}
```