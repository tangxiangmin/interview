canvas
===

### 常见问题

### 如何解决在移动端利用canvas生成图片时，图片清晰度不够的问题

这个是因为高清屏像素密度的问题，可以通过调整整个图片的分辨率（canvas画布的宽度和高度），从而生成较大的图片，图片的分辨率越大，保存的图片清晰度越高，下面是简单实现
```js
let scale = window.devicePixelRatio; //定义任意放大倍数 支持小数

let rem = (s) => {
    return window.screen.width / 750 * s * scale
}

let canvas = document.getElementById("stage")
let context = canvas.getContext("2d")

let cntElem = document.body

let width = cntElem.offsetWidth; //获取dom 宽度
let height = cntElem.offsetHeight; //获取dom 高度

// 画布的实际分辨率
canvas.width = width * scale; //定义canvas 宽度 * 缩放
canvas.height = height * scale; //定义canvas高度 *缩放

// 画布在文档流中展示的分辨率
canvas.style.width = width + "px";
canvas.style.height = height + "px";
```

### canvas中保存图片的跨域问题

如果绘制了跨域的图片，则会导致画布被无法，调用`ctx.getImageData`、`canvas.toDataURL`等方法会抛出异常，
解决canvas图片跨域一般有
* 如果是固定的静态资源图片，如cdn图片域名与页面url域名不一致造成的跨域，且图片数量与体积不多，可以使用base64形式的内联图片
* 如果图片数量较多，且图片资源服务器可控，可以配置CORS进行跨域操作
```js
let scaleImg = new Image()
scaleImg.crossOrigin = 'Anonymous' // 后台配置CORS，前端声明图片为CORS
scaleImg.src = __uri('../img/xx.png')
```
* 对于不可控的第三方图片，如微信头像等，一般需要先让服务端将图片下载到自己的服务器上，然后再进行处理

```php
// php下载远程图片  
$pic = 'http://avatar.csdn.net/7/5/0/1_molaifeng.jpg';
$arr = getimagesize($pic);
$pic = "data:{$arr['mime']};base64," . base64_encode(file_get_contents($pic));
?>

var src = "<?php echo $pic ?>"
```

### 100 * 100 的 Canvas 占内存多大？
imageData = ctx.getImageData(sx, sy, sw, sh)这个 API回的是一个 ImageData 数组，这个数组是 Uint8 类型的，且四位表示一个像素

因此占用的内存是 
100 * 100 * 4 bytes = 40,000 bytes。

结果不一定准确，后面再补充。

参考[头条面试题：100 * 100 的 Canvas 占内存多大](https://juejin.im/post/5bdeb357e51d4536140fc7df)

### 粒子效果大致的实现原理，最佳fps

粒子实际上就是画布上一个比较小的绘制单位，包含`speed`、`size`、`x`、`y`、`rgb`等属性。在画布中创造多个粒子，然后在画布的每一帧中，增量改变粒子的相关属性并重新绘制，就可以形成视觉上的粒子效果。

1秒60帧的流畅度，每一帧的时间可控制为`1000/60`ms

### canvas和svg有什么区别
参考：[Canvas和SVG的区别](https://www.cnblogs.com/liyuspace/p/7746853.html)
Canvas和SVG是html5支持的两种可视化技术，都允许您在浏览器中创建图形，但是它们在根本上是不同的。它们很不相同
* Canvas 是基于像素的即时模式图形系统，最适合较小的表面或较大数量的对象，Canvas不支持鼠标键盘等事件。
* SVG 是基于形状的保留模式图形系统，更加适合较大的表面或较小数量的对象。

## canvas引入自定义字体

通过css定义字体名
```css
@font-face {
  font-family: "_________";  //下划线填字体名称
  src: url("_________");  //下划线填字体文件
}
```
然后在canvas中使用对应的字体名即可，需注意
* 必须再等到字体下载完成之后再去渲染canvas,字体才能有作用
* canvas中所引用的字体必须在文档流中有标签(span,p等)引用改字体!!!这就是最大的坑了!!!

上面问题待验证，参考
* [利用font-face定义的字体怎么在canvas里应用](https://segmentfault.com/q/1010000008146516)

## canvas图像处理
* [利用canvas实现一个抠图小工具](http://imweb.io/topic/59f5c4c0b72024f03c7f49bd)
* [試試看Canvas (2)，調整Canvas圖片色調](https://wcc723.github.io/canvas/2014/12/08/html5-canvas-02/)，可以将图片替换成其他颜色



## 性能优化
需要遵循的「最佳实践」。

* 将渲染阶段的开销转嫁到计算阶段之上。
* 使用多个分层的 Canvas 绘制复杂场景。
* 不要频繁设置绘图上下文的 font 属性。
* 不在动画中使用 putImageData 方法。
* 通过计算和判断，避免无谓的绘制操作。
* 将固定的内容预先绘制在离屏 Canvas 上以提高性能。
* 使用 Worker 和拆分任务的方法避免复杂算法阻塞动画运行。

http://taobaofed.org/blog/2016/02/22/canvas-performance/

## 扩展阅读

### PNG压缩原理
参考
* [PNG压缩原理](https://segmentfault.com/a/1190000018557449)

PNG图片的数据结构其实跟http请求的结构很像，都是一个数据头，后面跟着很多的数据块。
![](https://segmentfault.com/img/bVbp1Nj?w=1000&h=360)

使用编码模式打开png图片，得到的是一串十六进制编码，编码头部的`8950 4e47 0d0a 1a0a`代表该文件就是PNG图片，后续跟着图片的基础信息，然后是图片的颜色等信息

PNG压缩的基本思路是:将编码中大量重复的表示颜色的数字去掉，在解析时再还原回去，保证图片以较小的体积进行传输。颜色越单一，颜色值越少，颜色差异越小的png图片，压缩率就越大，体积就越小。

压缩主要分为两个过程
* 预解析（Prediction），png图片用差分编码（Delta encoding）对图片进行预处理，处理每一个的像素点中每条通道的值，差分编码的目的是：尽可能的将png图片数据值转换成一组重复的、低的值，这样的值更容易被压缩
* 压缩（Compression）：执行Deflate压缩，移除重复的数据和无用的信息
