

## 文档乱码如何处理

一般是文档编辑保存时编码格式没有选择`utf-8`导致的

```html
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
```

## 描述浏览器解析HTML文档的过程
这里主要是理解CSS 与 JS 是如何阻塞 DOM 解析和渲染的。
当浏览器从上到下解析整个HTML文档时，
* 如果遇见内联的样式表，就会立即解析（但不一定会立即渲染出样式）；如果遇见内联的脚本，就会立即解析和执行；
* 如果遇见外部URL资源，就会发送请求加载对应文件，如果是普通的script，则会等待脚本加载完成后解析和执行JS代码，然后在继续HTML的解析。
* CSS无法阻塞DOM的解析，但会阻止页面的渲染，样式表会阻塞JS的解析和执行，这是因为脚本内部可能依赖于最新的计算属性
* JS会阻塞DOM的解析，这是因为JS可以操作DOM(比如document.write等丧心病狂的功能)，因此浏览器需要等待JS执行完成
* 遇见带async的script标签，浏览器会继续下载解析并执行JS，但此时的script不会阻塞浏览器解析HTML文档
* 遇见带defer的script标签，浏览器会继续下载，但此时的script不会阻塞浏览器解析HTML文档，直到HTML解析完成后才开始执行脚本内容

## 描述浏览器渲染HTML文档的过程
首先浏览器会分别解析下面HTML（生成DOM树）和CSS（生成CSS规则树），然后根据DOM树和CSS规则树来生成渲染树，最后调用系统的渲染API进行绘制。
这里需要注意Reflow和Repaint的区别。


