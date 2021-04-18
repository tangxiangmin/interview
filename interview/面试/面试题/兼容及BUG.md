前端开发常见问题
===


## 兼容问题

### 不支持新的JS语法

babel+polyfill编译

### 不支持的CSS语法
添加浏览器前缀，注意带前缀的属性值在前。可以使用`autoprefixer`的工具

### iOS日期格式
在iOS中，日期格式如果为`new Date(xxxx-xx-xx)`的形式会出现`NaN-NaN-NaN NaN:NaN`，需要将日期字符串修改为`xxxx/xx/xx`的形式

### canvas 中getImageData 获取数据的兼容问题

[getImageData](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/getImageData) 获取到的data值是一个Uint8ClampedArray ，在低版本的手机上，如iOS8.2等，没有slice方法，需要兼容处理

```js
let colorData = ctx.getImageData(this.x, this.y, width, height).data
let rgbaColorArr = Array.prototype.slice.call(colorData, index, index + 4)
```

### 不同浏览器的标签默认样式的差别

使用样式重置

### IE9一下浏览器不能使用opacity

```css
.example {
    opacity: 0.5;
    filter: alpha(opacity = 50);
}
```
### iOS上滑动卡顿
增加`-webkit-overflow-scrolling`

```css
-webkit-overflow-scrolling: touch;
```
如果未某个全屏的容器添加该属性，在safari下会带来新的问题：底部栏不会隐藏。

我们知道在IOS上使用safari时，当页面下滑，浏览器会自动隐藏底部导航栏。但是添加了上述属性之后，浏览器并不会隐藏底部导航栏，这会导致某些固定在页面底部组件被遮盖。

### CSS Hack
参考：[CSS Hack是什么意思](https://blog.csdn.net/qq_31635733/article/details/81660897)

CSS hack是通过在CSS样式中加入一些特殊的符号，让不同的浏览器识别不同的符号（什么样的浏览器识别什么样的符号是有标准的，CSS hack就是让你记住这个标准），以达到应用不同的CSS样式的目的。

CSS属性Hack、CSS选择符Hack以及IE条件注释Hack， Hack主要针对IE浏览器。
* 属性级Hack：比如IE6能识别下划线“_”和星号“*”，IE7能识别星号“*”，但不能识别下划线”_ ”，而firefox两个都不能认识。
* 选择符级Hack：比如IE6能识别*html .class{}，IE7能识别*+html .class{}或者*:first-child+html .class{}。
* IE条件注释Hack：IE条件注释是微软IE5开始就提供的一种非标准逻辑语句。比如针对所有IE：&lt;!-[if IE]&gt;&lt;!-您的代码-&gt;&lt;![endif]&gt;，针对IE6及以下版本：&lt;!-[if it IE 7]&gt;&lt;!-您的代码-&gt;&lt;![endif]-&gt;，这类Hack不仅对CSS生效，对写在判断语句里面的所有代码都会生效。

PS：条件注释只有在IE浏览器下才能执行，这个代码在非IE浏览下被当做注释视而不见。可以通过IE条件注释载入不同的CSS、JS、HTML和服务器代码等。

### emoj表情

> 如何判断当前浏览器是否支持某一个emoji

参考：[判断浏览器是否支持某个emoj](https://www.jianshu.com/p/52fe1ff46f93)

综上，主要利用了在大部分系统下emoji不能被上色的原理，对于那些 emoji 可以被上色的平台做降级处理，在2*2的 canvas 上做像素比对。

想了一下，还是使用切图或者字体图标来统一图标，避免兼容emoj更加合适一点。

> 在数据库中支持存储emoji

如果是MySQL，需要将版本升级到5.5以上，并设置字符集为utf8mb4，这是一个支持存储emoji字节的字符集。

参考：[在数据库中支持存储emoji，并在前端页面中显示

coder_Simon
](https://www.jianshu.com/p/58982e332e5e)，附emoj正则表达式
```
/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/
```

### ie和safari浏览器无法识别webp图片

需要判断浏览器是否支持webp，如果不支持，则去除图片路径中的webp后缀
```js
function checkSupportWebp(fn) {
    let isSupportWebp = false;
    let webpTestsUri = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=';
    let image = new Image();

    function addResult(event) {
        isSupportWebp = event && event.type === 'load' ? image.width == 1 : false;

        // 增加全局属性
        window.isSupportWebp = isSupportWebp;
        fn(isSupportWebp);
    }

    image.onerror = addResult;
    image.onload = addResult;
    image.src = webpTestsUri;
}
```
### iOS手指按住屏幕滑动时，UI如定时器和CSS动画不会执行

我们知道浏览器内部至少会有这么两个线程：解析js的线程和渲染界面的线程。这里我们暂且称它们为JS线程和UI线程。

由于js是可操纵DOM的，如果在修改这些元素属性同时渲染界面（即JS线程和UI线程同时运行），那么渲染线程前后获得的元素数据就可能不一致了。因此为了防止渲染出现不可预期的结果，浏览器控制JS线程和UI线程以列队的形式同步执行。

在滑动过程中UI线程执行，则会阻塞JS线程的运行。

## 常见bug

### 音频文件不自动播放
audio元素和video元素在ios和andriod中无法自动播放。这是因为因为各大浏览器都为了节省流量，做出了优化，在用户没有行为动作时（交互）不予许自动播放；
解决办法：在用户首次点击页面时触发播放
```js
$(window).one('touchstart', function(){
    music.play();
})
```

### 1px像素
[7种方法解决移动端Retina屏幕1px边框问题](https://www.jianshu.com/p/7e63f5a32636)
* border-image
* tarnsform

### iOS fixed定位BUG
[ios下fixed回复框bug的解决方案](https://www.cnblogs.com/shenyu1995/p/5049629.html)

### canvas保存图片模糊
在高清屏下存在这个问题，放大canvas画布的尺寸，保持canvas.stytle.width和height的尺寸，按比例绘制图片，最后使用scale进行缩放，保存图片即可。

### iOS图片上传旋转90度
使用`exif-js`这个库
```js
let file = e.target.files[0]
let Orientation
EXIF.getData(file, function () {
    EXIF.getAllTags(this);
    Orientation = EXIF.getTag(this, 'Orientation');
    if (navigator.userAgent.match(/iphone/i)) {
        // 获取图片Orientation参数，=6是正常竖向拍摄，=3是横线拍摄-180度，=8是竖向-180度拍摄
    }
    // 绘制的时候将图片旋转rotate度
});
```
### 键盘弹起收缩后区域留白

在`input`的`blur`事件后触发一次滚动，或者使用[focusout](https://developer.mozilla.org/zh-CN/docs/Web/Events/focusout)事件
```js
document.body.addEventListener("focusout", () => { //解决键盘弹起收缩后页面留白问题
  var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
  window.scrollTo(0, Math.max(scrollHeight - 1, 0));
})
```

### 点击穿透
移动端提供了一个双击放大的功能，因此当`click`事件触发后，有大约300ms的延迟判断是否是双击，而不会直接触发click事件。移动端提供了touchstart、touchmove、touchend等事件，不会有300ms的延迟

事件触发顺序: touchstart > touchmove > touchend > click

场景：页面上有一个遮罩关闭按钮，点击关闭通过`touchstart`蒙层后发现触发了关闭按钮下面同位置的按钮的click事件。在跳转到新页面时如果加载很快也可能出现这种问题

解决方案：
* 不混合touch和click
* 触发touch后的短暂时间内禁用click，如`pointer-event`等
