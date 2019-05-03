CSS相关面试题
===


## 物理像素和逻辑像素有什么区别


## 圣杯布局

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

## 修改placeholder文本样式
参考：[::placeholder](https://developer.mozilla.org/en-US/docs/Web/CSS/::placeholder)
```css
input::-webkit-input-placeholder {
    font-size: 14px;
    color: red;
}
```

## 如何修改chrome记住密码后自动填充表单的黄色背景 ？
```
input:-webkit-autofill, textarea:-webkit-autofill, select:-webkit-autofill {
    background-color: #FAFFBD; 
    background-image: none;
    color: rgb(0, 0, 0);
}
```
## 制作动画，频率多少合适
人眼最多看见每秒60帧，因此最小间隔为`1000ms/60`即`16.7ms`

## iOS下滚动容器不顺畅如何解决
添加`-webkit-overflow-scrolling:touch`解决，不过该属性在safari下会导致下滑时底部栏不收起

## 一道关于em的题
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

