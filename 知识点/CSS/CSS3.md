CSS3
===

## 属性前缀

> 浏览器前缀和无浏览器前缀的属性摆放的顺序？

参考[ordering-css3-properties](https://css-tricks.com/ordering-css3-properties/)
。

应该是带前缀的属性在前面，无浏览器前缀的属性在后面。这是因为在对于带前缀的属性而言，每个浏览器实现的效果可能不一致，而对于不带前缀的样式而言，每个浏览器都遵循规范实现

```css
/* 对于border-radius带多个值而言，下面两种样式的展示效果是不一样的 */
.box1 {
    border-radius: 30px 10px; 
    -webkit-border-radius: 30px 10px;
}
.box2 {
    -webkit-border-radius: 30px 10px;
    border-radius: 30px 10px;
}
```

## CSS3动画

### 形变
`transform`

该属性是对元素进行变操作的，比如位移，旋转，缩放，变形等，由于是瞬间完成，并不能单独完成动画效果
```
transform:属性值（具体数值量）
```

位移:translate（x,y）
注意：
* 1.参数单位为px，以原始位置左上角为原点，根据参数偏移量重新定位到指定位置。
* 2.可以将X轴和Y轴单独写成translateX和translateY；
* 3.只有一个参数的时候默认向X轴偏移，等同于translateX；
* 4.translate3d...

缩放：scale(x);
注意：
* 1.参数无单位，以元素的中心为原点向四周进行扩大(x>1)或缩小(x<1)至指定倍数;
* 2.可以传入两个参数，第一个参数表示x方向上扩大的倍数，第二个参数表示y方向上扩大的倍数；
* 3.若将参数设置为0则元素会缩小至不可见
* 4.scale3d

旋转：rotate(degree)  
* 1.参数单位为deg，正数表示顺时针旋转，负数表示逆时针旋转；
* 2.默认的rotate只能传入一个参数值，以屏幕为基准面，以元素中心为基准点进行旋转；
* 3.rotate3d(X?,X?,Z?,degree)，先选择进行旋转的轴，如果是则设置为1，否则设置为0,在设置旋转的角度。

变形：skew（x,y）
* 两个参数值，分别表示相对于X轴和Y轴的倾斜度， X值为正表示将元素左上角原点向左拉扯，Y值为正表示将元素左上角原点向上拉扯，若为负值则相反。

### 渐变动画
`transiton`

### 逐帧动画
`@keyframes`、`animation`
* animation-name	规定需要绑定到选择器的 keyframe 名称。
* animation-duration	规定完成动画所花费的时间，以秒或毫秒计。
* nimation-timing-function	规定动画的速度曲线。
* animation-delay	规定在动画开始之前的延迟。
* animation-iteration-count	规定动画应该播放的次数。
* animation-direction	规定是否应该轮流反向播放动画。

### css 动画和 js 动画有什么区别?

* 代码复杂度方面，简单动画，css 代码实现会简单一些，js 复杂一些。复杂动画的话，css 代码就会变得冗长，js实现起来更优。
* 动画运行时，对动画的控制程度上，js 比较灵活，能控制动画暂停，取消，终止等，css动画不能添加事件，只能设置固定节点进行什么样的过渡动画。
* 兼容方面，css 有浏览器兼容问题，js 大多情况下是没有的。
* 性能方面，css动画相对于优一些，css 动画通过GUI解析，js 动画需要经过j s 引擎代码解析，然后再进行 GUI 解析渲染。


## CSS中的事件属性
**user-select**

选中事件，下面代码可以禁止复制
```
* {
-webkit-user-select: none;
   -moz-user-select: none;
    -ms-user-select: none;
        user-select: none;
}
```
在IOS下会影响输入框的输入，需要
```
input,textarea {
    user-select: auto;
}
```

**pointer-events**

点击事件，可以禁止长按保存图片的功能
```
img { 
    pointer-events: none; 
}
```

**-webkit-tap-highlight-color**

移动端链接等可点击的元素，激活时有默认的背景色，可通过该属性设置。
```
a {
    -webkit-tap-highlight-color: rgba(0,0,0,0);
}
```

### 利用css3实现瀑布流

```css
.waterfall {
    column-width: 200px;
    column-gap: 5px
}
.waterfall_item {
    break-inside: avoid;
}
```

## CSS开启硬件加速
* [用CSS开启硬件加速来提高网站性能](https://www.cnblogs.com/PeunZhang/p/3510083.html)
* [GPU硬件加速](https://www.cnblogs.com/chenlogin/p/5834593.html)

**优点**
现在大多数电脑的显卡都支持硬件加速。鉴于此，我们可以发挥GPU的力量，从而使我们的网站或应用表现的更为流畅

**触发条件**
* 3D变换会触发, `translate3d`、`rotate3d`和`scale3d`
* translateZ(0)

当使用CSS transforms 或者 animations时可能会有页面闪烁的效果，可以使用`transform: translate3d(0, 0, 0)`修复

**缺点**
使用GPU可能会导致严重的性能问题，因为它增加了内存的使用，而且它会减少移动端设备的电池寿命。

## 一些BUG

### CSS3 transform对普通元素的N多渲染影响

参考
* https://www.zhangxinxu.com/wordpress/2015/05/css3-transform-affect/

### CSS动画影响fixed属性
当为元素设置缓动动画（或其他动画？）时，其子元素如果设置了fixed，则改fixed属性会失效

问题：
* http://www.cnblogs.com/skyweaver/p/4369276.html
* http://meyerweb.com/eric/thoughts/2011/09/12/un-fixing-fixed-elements-with-css-transforms/

解答：

父类元素 含有 transform,或者 will-chanage之类，会单独建立 gpu层，导致 子元素fixed，或者zIndex 之类失效，

###  iOS fixed定位抖动
在一个`overflow:auto`的容器中包含了fixed元素，在滑动时对应的固定定位的元素出现抖动

解决方案:修改布局，fixed元素移动到外部容器

参考
* [iOS中position:fixed吸底时的滑动出现抖动的解决方案](https://blog.csdn.net/sinat_22209293/article/details/80854509)，貌似添加`translateZ(0)`不生效。

## 扩展阅读
* [CSS3 transform对普通元素的N多渲染影响](https://www.zhangxinxu.com/wordpress/2015/05/css3-transform-affect/)

## 常见问题
Q:css 动画和 js 动画的差异

1. 代码复杂度，js 动画代码相对复杂一些
2. 动画运行时，对动画的控制程度上，js 能够让动画，暂停，取消，终止，css动画不能添加事件
3. 动画性能看，js 动画多了一个js 解析的过程，性能不如 css 动画好

