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

<img src="<?php echo $pic ?>" />
```

### 100 * 100 的 Canvas 占内存多大？
imageData = ctx.getImageData(sx, sy, sw, sh)这个 API回的是一个 ImageData 数组，这个数组是 Uint8 类型的，且四位表示一个像素

因此占用的内存是 
100 * 100 * 4 bytes = 40,000 bytes。

结果不一定准确，后面再补充。

参考[头条面试题：100 * 100 的 Canvas 占内存多大](https://juejin.im/post/5bdeb357e51d4536140fc7df)

### 粒子效果大致的实现原理，最佳fps

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
