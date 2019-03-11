

## 100 * 100 的 Canvas 占内存多大？
imageData = ctx.getImageData(sx, sy, sw, sh)这个 API回的是一个 ImageData 数组，这个数组是 Uint8 类型的，且四位表示一个像素

因此占用的内存是 
100 * 100 * 4 bytes = 40,000 bytes。

结果不一定准确，后面再补充。

参考[头条面试题：100 * 100 的 Canvas 占内存多大](https://juejin.im/post/5bdeb357e51d4536140fc7df)

## 如何解决在移动端利用canvas生成图片时，图片清晰度不够的问题

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

## canvas中保存图片的跨域问题

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