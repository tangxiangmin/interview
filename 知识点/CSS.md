CSS
=== 
* 垂直居中
* 移动端适配rem布局
* CSS实现单行、多行文本溢出
* CSS Module
* BEM命名

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