CSS
=== 
* 常见布局
* SCSS、LESS
* nth-of-type(n)和nth-of-child(n)
* 样式继承

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

## BFC
参考之前的整理：
* [BFC及其应用](http://www.shymean.com/article/BFC%E5%8F%8A%E5%85%B6%E5%BA%94%E7%94%A8)

盒子模型，这是CSS布局的对象和基本单位，不同的盒子，其渲染方式（`Formatting Context`）是不一样的，display属性为block的盒子，就会参与block fomatting context，也就是上面所说的BFC。

需要了解BFC的布局规则、触发条件和应用场景这三个点。

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

## 盒子模型
> 在CSS中，使用标准盒模型描述这些矩形盒子中的每一个。这个模型描述了元素所占空间的内容。每个盒子有四个边：外边距边, 边框边, 内填充边 与 内容边。 
* 在标准模式下，一个块的总宽度=width+margin(左右)+padding(左右)+border(左右)
* 在怪异(ie)模式下，一个块的总宽度=width+margin（左右）（既width已经包含了padding和border值）

## box-sizing
> 更改用于计算元素宽度和高度的默认的 CSS 盒子模型

* content-box  是默认值。如果你设置一个元素的宽为100px，那么这个元素的内容区会有100px宽，并且任何边框和内边距的宽度都会被**增加**到最后绘制出来的元素宽度中。
* border-box 告诉浏览器去理解你设置的边框和内边距的值是包含在width内的。也就是说，如果你将一个元素的width设为100px,那么这100px会包含其它的border和padding，内容区的实际宽度会是width减去border + padding的计算值。大多数情况下这使得我们更容易的去设定一个元素的宽高

## 清浮动
**使用clear属性**
clear属性指定一个元素是否可以在它之前的浮动元素旁边，或者必须向下移动(清除浮动) 在它的下面。clear 属性适用于浮动和非浮动元素
```css
.clearfix:after {
    visibility: hidden;
    display: block;
    font-size: 0;
    content: " ";
    clear: both;
    height: 0;
}
```

**触发BFC**
BFC可以包含浮动元素，并正确显示自己的高度

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


## 垂直居中
```
<div class="wrap">
    <div class="box"></div>
</div>
```
采用绝对定位+位置偏移
```
.box {
    position: absolute;
    top: 50%;
    /* margin-top: -50px; */ /* 适合高度已知的元素 */
    transform: translateY(-50%); /* 适合高度未知的元素 */
}
```
绝对定位+margin过分受限
```
.box {
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto 0;
}
```
flex布局
```
.wrap {
    display: flex;
    align-items: center;
}
```
表格布局
```
.wrap {
    display: table-cell; 
    vertical-align: middle; 
}
```
还有比如line-height等hack方法就不提了

## CSS实现单行、多行文本溢出
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

## nth-of-type(n)和nth-child(n)
**nth-of-type**
参考[MDN文档](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:nth-of-type)
> 这个 CSS 伪类 匹配那些在它之前有 an+b-1 个相同类型兄弟节点的元素，其中 n 为正值或零值。
匹配同类型的兄弟元素中对应索引的元素，索引从1开始

**nth-child**
参考[MDN文档](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:nth-child)
> 这个 CSS 伪类匹配文档树中在其之前具有 an+b-1 个兄弟节点的元素，其中 n 为正值或零值。
简单点说就是，这个选择器匹配那些在同系列兄弟节点中的位置与模式 an+b 匹配的元素，其索引从1开始