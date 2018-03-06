CSS
=== 
* 常见布局
* 垂直居中
* 移动端适配rem布局
* CSS实现单行、多行文本溢出
* CSS Module
* BEM命名
* bfc
* SCSS、LESS
* nth-of-type(n)和nth-of-child(n)
* 样式继承

参考：
* [使用Flexible实现手淘H5页面的终端适配](https://github.com/amfe/article/issues/17)

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

## 栅格系统响应式原理

## Rem实现及注意事项

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