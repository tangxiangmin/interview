常见BUG
===

## 音频文件不自动播放
audio元素和video元素在ios和andriod中无法自动播放。这是因为因为各大浏览器都为了节省流量，做出了优化，在用户没有行为动作时（交互）不予许自动播放；
解决办法：在用户首次点击页面时触发播放
```js
$(window).one('touchstart', function(){
    music.play();
})
```

## 1px像素
[7种方法解决移动端Retina屏幕1px边框问题](https://www.jianshu.com/p/7e63f5a32636)
* border-image
* tarnsform

## iOS fixed定位BUG
[ios下fixed回复框bug的解决方案](https://www.cnblogs.com/shenyu1995/p/5049629.html)

## canvas保存图片模糊
在高清屏下存在这个问题，放大canvas画布的尺寸，保持canvas.stytle.width和height的尺寸，按比例绘制图片，最后使用scale进行缩放，保存图片即可。
