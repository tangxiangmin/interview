
BOM
===
BOM（浏览器对象模型）是浏览器本身的一些信息的设置和获取，一般常用的是
* navigator，用于获取浏览器特征，比如判断平台等
* screen，获取屏幕宽高
* location，获取网址、协议、path、参数、hash 
* history，访问浏览器的历史记录栈

------
DOM
===
* DOM操作、节点常用属性
* 事件的执行阶段，事件委托
* 节流函数
* [前端HTML5几种存储方式的总结](https://mp.weixin.qq.com/s?__biz=MzIzNTU2ODM4Mw==&mid=2247485935&idx=1&sn=b3faae7b8e21c4ff296d64b4dfaaeb58&chksm=e8e4647fdf93ed696db04e9b0dbd4fe1a06df6221ea1c2ede19ce1baf91d911be14110516d3b&mpshare=1&scene=1&srcid=02242xNs4l2IA16v4qOcJPA6#rd)
* requestAnimFrame ，传入的函数在重绘之前调用

## DOM操作
参考之前的整理:[DOM编程之节点（一）](http://www.shymean.com/article/DOM%E7%BC%96%E7%A8%8B%E4%B9%8B%E8%8A%82%E7%82%B9%EF%BC%88%E4%B8%80%EF%BC%89)

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

## 事件
参考之前的整理:[DOM编程之事件（二）](http://www.shymean.com/article/DOM%E7%BC%96%E7%A8%8B%E4%B9%8B%E4%BA%8B%E4%BB%B6%EF%BC%88%E4%BA%8C%EF%BC%89)

当文档、浏览器、元素或与之相关的对象发生某些有趣的事情时，浏览器就会产生事件（也可以说成是浏览器通知应用程序发生了什么事情）

关于事件，需要理解的包括
* 事件类型
* 事件对象
* 事件目标
* 事件处理函数
* 事件传播
* 默认事件取消等

### 事件委托
事件冒泡模型在为大量单独元素上注册处理程序提供了解决方案（在其公有祖先元素上注册事件,即**事件委托**）。

事件委托就是事件目标不直接处理事件，而是委托其父元素或者祖先元素甚至根元素（document）的事件处理函数进行处理。可以通过事件对象的target属性获得真正触发事件的引用。

事件委托是建立在冒泡模型之上的。

## 网络请求
### Ajax
之前遇见的一个面试题目是手写代码，封装ajax~

```js
var xhr = new XMLHttpRequest()
var url = '/api'
xhr.open("GET", url, false)
xhr.onreadystatechange = function () {
    // 这里的函数异步执行，可参考之前 JS 基础中的异步模块
    if (xhr.readyState == 4) {
        if (xhr.status == 200) {
            alert(xhr.responseText)
        }
    }
}
xhr.send(null)...
```
需要掌握`readyState`和`status`状态码的含义

### Fetch
现在有一个更简单的发起HTTP请求的接口：`Fetch`
参考[文档传送门](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API/Using_Fetch)

```js
fetch('url', {
    method:'POST', //请求类型 GET、POST
    headers:{}, // 请求的头信息，形式为 Headers 对象或 ByteString
}).then(function(response) { ... });
```

## Web Storage API
HTML5新增了sessionStorage和localStorage用于本地存储，专门为了浏览器端缓存而设计的，优点有：
* 存储量增大到 5MB
* 不会带到 HTTP 请求中

相关接口`setItem`、`getItem`、`removeItem`

### 注意事项
针对localStorage.setItem，使用时尽量加入到try-catch中，某些浏览器是禁用这个 API 的，要注意。

## 跨域
这里单独整理，请移步[浏览器跨域](./跨域.md)
