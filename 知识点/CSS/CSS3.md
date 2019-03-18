## CSS3

### CSS3动画

### 形变
`transform`

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


### CSS中的事件属性
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
```