

* DOM操作、节点常用属性
* 事件的执行阶段，事件委托
* 节流函数
* [前端HTML5几种存储方式的总结](https://mp.weixin.qq.com/s?__biz=MzIzNTU2ODM4Mw==&mid=2247485935&idx=1&sn=b3faae7b8e21c4ff296d64b4dfaaeb58&chksm=e8e4647fdf93ed696db04e9b0dbd4fe1a06df6221ea1c2ede19ce1baf91d911be14110516d3b&mpshare=1&scene=1&srcid=02242xNs4l2IA16v4qOcJPA6#rd)
* requestAnimFrame ，传入的函数在重绘之前调用

## DOM操作
参考
* [DOM编程之节点（一）](http://www.shymean.com/article/DOM%E7%BC%96%E7%A8%8B%E4%B9%8B%E8%8A%82%E7%82%B9%EF%BC%88%E4%B8%80%EF%BC%89)

### 获取DOM节点
```js
// 根据id返回单个元素节点
document.getElementById("id");

// 根据标签名或类名返回全部的元素节点列表（是一个HTMLCollection类数组对象，犀牛书上说的是返回Nodelist）
// 即使只有一个元素节点也必须通过下标访问
document.getElementsByTagName("ul");
document.getElementsByClassName("head");

// 根据标签name属性选择元素
document.getElementsByName("tel");

// 在CSS3标准化同时新增了一组“选择器API”，用于增强筛选节点的能力
document.querySelector(selector);
document.querySelectorAll(selector);
```
需要注意的是
* `HTMLCollection`返回的是动态的节点引用，这意味着如果节点发生了改变，不需要通过`getElementsByTagName`等方式从新获取
* `querySelectorAll`返回的是静态的节点列表，返回的只是调用该方法时页面节点的一个静态副本，不会随着页面节点的改变而变化

```html
 <ul id="myUl">
    <li>3</li>
</ul>
<script>
    var t1 = document.getElementsByTagName("li")
    var t2 = document.querySelectorAll("li")
    console.log(t1)
    console.log(t2)

    myUl.innerHTML = `<li>1</li><li>2</li>`

    console.log(t1)
    console.log(t2)
</script>
```

### 操作节点
**属性节点**
```js
var oTest = document.querySelector("#test");
oTest.getAttribute("title"); //获取title属性的值，若无返回null
//为titile属性设置hello的值
oTest.setAttribute("title","hello") // titile属性设置hello的值
oTest.removeAttribute("title")
// HTML5新增了自定义属性，使用data-*进行作为属性名，用于保存我们自定义的属性，同时提供了一个dataset属性用于访问自定义属性
oTest.dataset.demo
```
**文本节点**
```js
// 获取文本节点
var htm = oTest.innerHTML; // Haha <a href="#">link</a>
// 设置文本节点
oTest.innerHTML = "Hello World";
oTest.innerText; // Haha link
```
### 遍历节点
```js
parentNode // 返回当前结点的父节点
offsetParent // 返回的是离当前结点最近的有定位的父节点
childNodes // 返回当前结点的全部子节点
firstElementChild // 元素的第一个子元素节点
lastElementChild // 表示元素的最后一个子元素节点

// 访问相邻的兄弟节点
nextSibling
previousSibling

nextElementSibling
previousSibling
```
### 操作CSS样式
查询元素的style属性返回的是一个叫做`CSSStyleDeclaration`对象而不是简单的字符串，该对象包含了元素的样式
需要注意的是：通过这种方式只能获得元素的行内样式
```
// 由于-是JavaScript的元素符，因此，如果所需的CSS属性中包含-连字符，比如font-size等，需要转换成fontSize驼峰形式的才行
test.style.color; // green
test.style.color = "red";
```

如果是需要获取元素的渲染样式
```js
function getStyle(obj, attr) {
    return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj)[attr];
}
```

在开发中更常用的做法是切换样式类来修改元素的样式
```js
test.className = "text-green";
```
HTML5为元素节点提供了一个classList的属性，该属性是一个只读的类数组对象（无法被覆盖），包含了该元素节点的单独类名，并提供了相关的接口用于操作，`add`、`remove`、`toggle`和`contains`
### 构造元素节点
我们可以直接向文档中添加标记，让浏览器重新解析文档并生成节点。可以使用的是`document.write()`方法和`node.innerHTML`属性。

此外DOM也提供了相关的接口
```js
// 创建对应标签的元素节点并返回一个ElementNode对象
document.createElement(tagname);

// 创建内容为text的文本节点
document.createTextNode(text);

// 创建评论节点
document.createComment(text);

// 克隆节点,传入true则会递归复制该节点的所有子节点
test.cloneNode()    
```
### 插入节点
```js
// 将动态创建的节点插入到父节点中
parent.appendChild(node);
// 将动态创建的节点插入到兄弟节点前，注意这个方法也是在父节点上进行的
parentUl.insertBefore(oLi, siblingLi);

// 并没有insertAfter方法，因此可以自己实现一个
function insertAfter(parent, sibling, node){
    var children = parent.children;

    if (children[children.length - 1] == sibling){
        parent.appendChild(node);
    }else {
        var next = sibling.nextElementSibling;
        console.log(next);
        parent.insertBefore(node, next);
    }
}
```
HTML5引进了一个十分强大的插入节点的API，叫做`innerAdjacentHTML`，用于插入文档节点，这里是[文档传送门](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/insertAdjacentHTML)
### 删除和替换子节点
```js
// 移除子节点
parentUl.removeChild(siblingLi)
// 使用oLi新节点替换子节点
 parentUl.replaceChild(oLi, siblingLi)
```
此外还可以通过`innerHTML`进行覆盖，移除相关的节点。


### 获取DOM尺寸的各种API

- window.innerWidth, window.innerHeight 获取浏览器整体窗口的宽高
- client系列
  - **clientTop:** 获取元素border-top的宽度
  - **clientLeft:**获取元素border-left的宽度
  - **clientWidth:** 获取元素的宽度，不包含**border**
  - **clientHeight:**获取元素的高度，不包含**border**
  - **getBoundingClientRect**， 获取与元素尺寸信息有关的对象
    - top bottom: 获取元素上下边(不考虑margin)到浏览器窗口上边的距离数值
    - left right: 获取元素左右边(不考虑margin)到浏览器窗口左边的距离数值
    - width height: 元素的宽度和高度(包含border)
    - x y : 或元素左顶点到窗口左边和上边的距离(不考虑margin) **这个属性兼容性不好，不用**
- offset系列
  - **offsetParent:**获取元素的最近position不是static的祖先元素
  - **offsetLeft:** 获取元素（包含border）相对于最近position不是static的祖先元素的左边距离（不包含border，包含padding）
  - **offsetTop:** 获取元素（包含border）相对于最近position不是static的祖先元素的上边距离（不包含border，包含padding）
  - **offsetWidth:** 获取元素的宽度，包含border
  - **offsetHeight:** 获取元素的高度，包含border
- scroll系列
  - **scrollLeft:** 获取左侧卷入不可见区域的宽度
  - **scrollTop:** 获取上侧卷入不可见的区域
  - **scrollWidth:** 获取的宽度为（内容实际宽度包括卷入的区域+padding部分）与（元素宽度+padding部分）
  - **scrollHeight:** 获取的宽度为（内容实际高度包括卷入的区域+padding部分）与（元素高度+padding部分）
  - **window.scrollBy(x,y):** 窗口相对滚动函数
  - **window.scrollTo(x,y):** 窗口绝对滚动函数


## 事件
参考：[浏览器事件](./事件机制.md)

## JS动画

### requestAnimationFrame
参考：
* [MDN文档](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame)

```
window.requestAnimationFrame(callback);
```
* 在大多数浏览器里，当运行在后台标签页或者隐藏的`iframe` 里时，requestAnimationFrame() 会暂停调用以提升性能和电池寿命。
* callback会被传入一个参数，DOMHighResTimeStamp，指示当前被 requestAnimationFrame() 排序的回调函数被触发的时间。即使每个回调函数的工作量的计算都花了时间，单个帧中的多个回调也都将被传入相同的时间戳

### JS动画性能优化
JS实现动画性能优化，参考[流畅JS动画的7个性能优化建议](https://www.jianshu.com/p/fc0b79018a84)
* 避免针对复杂css属性执行动画，提升web动画性能简单而有效的方式是改变那些只触发复合操作的css属性，如使用`transform`代替`left`等属性
* 使用`requestAnimationFrame`代替`setTimeout/setInterval`，避免动画丢帧
* 如果fps是60，则每一帧只有16.67毫秒，避免执行复杂的计算，可以适当做缓存处理，增加动画的流畅性
* 某些DOM属性如`offsetTop`等会导致浏览器的重绘，可以使用变量将其缓存起来

## BOM

BOM（浏览器对象模型）是浏览器本身的一些信息的设置和获取，一般常用的是
* navigator，用于获取浏览器特征，比如判断平台等
* screen，获取屏幕宽高
* location，获取网址、协议、path、参数、hash 
* history，访问浏览器的历史记录栈

## Web Storage API
HTML5新增了sessionStorage和localStorage用于本地存储，专门为了浏览器端缓存而设计的，优点有：
* 存储量增大到 5MB
* 不会带到 HTTP 请求中

注意
* 与之前cookie保存数据的区别
* `localStorage`和`sessionStorage`的区别
* 在使用`localStorage`和`sessionStorage`时尽量加入到try-catch中，某些浏览器是禁用这个 API 的（如在无痕模式下访问）。

> 常见问题 cookies，sessionStorage 和 localStorage的区别？

相同：都是保存在浏览器，且同源的。
区别：
* cookies 和 ＊Storage 的区别：
    * cookies会在服务器端和客户端间传递的；
    * sessionStorage 和 localStorage存放在客户端的，不会发送至服务器端，仅在本地保存。
    * cookies的兼容主流浏览器,包括IE6+;IE6，IE7不支持sessionStorage 和 localStorage
    * sessionStorage 和 localStorage中能存的数据比cookie大（cookie不能超过4k）
* sessionStorage 和 localStorage的区别：
    * sessionStorage存的数据在每次关闭浏览器后被删除，localStorage不会。
    * 作用域不同，sessionStorage不能在浏览器的不同标签页中共享，即使是同一个页面（刷新页面可以继续存在）；
    * localStorage 在所有同源窗口中都是共享的；cookie也是在所有同源窗口中都是共享的




## Web Worder
参考
* [Web Worker MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API)
* [Web Worker 使用教程](http://www.ruanyifeng.com/blog/2018/07/web-worker.html)

JavaScript 语言采用的是单线程模型。Web Worker 的作用，就是为 JavaScript 创造多线程环境，允许主线程创建 Worker 线程，将一些任务分配给后者运行，这样做的好处是可以在独立线程中执行费时的处理任务，从而允许主线程（通常是UI线程）不会因此被阻塞/放慢。

在主线程中
```js
// 创建worker
var worker = new Worker('work.js');
// 向worker发送消息
worker.postMessage('Hello World');
// 注意传输的数据是值的拷贝，worker无法修改主线程中的变量
worker.postMessage({method: 'echo', args: ['Work']});

// 主线程通过事件，接收子线程发回来的消息
worker.onmessage = function (event) {
  console.log('Received message ' + event.data);
  doSomething();
}
// 监听worker的错误
worker.onerror(function (event) {});


// 主线程关闭worker
worker.terminate();
```

在worker中，通过`self`代表子线程自身，即子线程的全局对象
```js
// 监听message事件，接收主线程发送的消息
self.addEventListener('message', function (e) {
  // 通过postMessage向主线程发送消息
  self.postMessage('You said: ' + e.data);
}, false);

// 主动关闭
self.close();
```

## Service Worker

参考：
* [Service Worker API](https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API)
* [Service Worker：简介](https://developers.google.com/web/fundamentals/primers/service-workers/)

可以用来作为web应用程序、浏览器和网络（如果可用）之间的代理服务，常见的如控制缓存等，可以用来实现PWA

