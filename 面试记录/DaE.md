

## 2017.05.12
HR直接通知面试，没有电面...

## 2017.05.15

### 笔试

__`CSS Modules`可以解决前端开发中的哪些问题__

> CSS Modules：所有的类名和动画名称默认都有各自的作用域的CSS文件。

在使用CSS模块时，类名是动态生成的，唯一的，并准确对应到源文件中的各个类的样式，这样可以保证单个组件的所有样式：

* 集中在同一个地方
* 只应用于该组件




PS：我个人不喜欢所有的代码都放在JavaScript中，所以下面这种代码还是不想写了

    <h1 className={style.title}>
      Hello World
    </h1>


__谈谈对于闭包的理解__

* 在函数内部定义的变量，在函数的外部无法访问到，因此就说函数构成了一个闭包
* 函数内部的自由变量，在其定义的时候（而不是调用的时候）就已经决定了

综合上面两点，将函数通过传参或者返回值的形式在另外某个地方调用时，也可以访问其父函数作用域内的变量。可以通过闭包防止变量污染，以及封装模块。



__解释同源策略和跨站请求方案__

这个就略了~~注意预防面试官扩展到`CORS`的服务器配置



__前端性能优化__

这个也略了~~



__React中的Virtual DOM的优点__

响应式数据就是数据发生变化之后，不再需要刷新页面就能看到页面上的内容随之更新了，随着而来的一个问题是：如果只是部分数据发生了变化，就要把页面整体或一大块区域重新渲染就有点浪费了，因此出现了`Virtual Dom`技术。

`Virtual DOM `概况来讲，就是在数据和真实 DOM 之间建立了一层缓冲。对于开发者而言，数据变化了就调用 React 的渲染方法，而 React 并不是直接得到新的 DOM 进行替换，而是先生成 Virtual DOM，与上一次渲染得到的 Virtual DOM 进行比对，在渲染得到的 Virtual DOM 上发现变化，然后将变化的地方更新到真实 DOM 上。



__ES6中的模块和CommonJs中的模块有什么区别__
这个单独整理了一篇博文，并增加了`AMD`。

__SPA应用是如何管理数据状态的__
* `Redux`：View调用store.dispatch发起Action->store接受Action(action传入reducer函数,reducer函数返回一个新的state)->通知store.subscribe订阅的重新渲染函数
* `Vuex`：View调用store.commit提交对应的请求到Store中对应的mutation函数->store改变(vue检测到数据变化自动渲染)

__封装一个类似于`$.ajax()`的方法__
手写代码真是蛋疼啊，最后写了200多行，没法调试，总体来说：**手写代码就是有病**。
```javascript
var xhr = new XMLHTTPRequest();

// get和post的参数处理单独处理吧...
xhr.open("GET", "1.php", true);
xhr.setRequestHeader("Content-type", "application/x-www-formurlencoded");
xhr.send(null);

xhr.onreadystatechange = function(){
  	if (xhr.readySate === 4){
      	if(xhr.status === 200){
          	success(xhr.responseText);
      	}else {
          	error().
      	}
  	}
}

```




### 面试

#### 第一轮
主要根据面试题来进行提问
* `CORS`中服务器需要配置什么，然后根据首部行进行拓展，这里没答好
* `CSS Modules`是如何解决上面的问题的，这里感觉也没有答好
* `PostCSS`你是怎么使用的，样式重用的问题，怎么处理
* `angularJs`和`Vue`数据的双向绑定，各自的优缺点
* `HTTP`报文缓存中`Expries`和`CaChe-Control`的区别

#### 第二轮
另外一个面试官根据简历提问
* 接触过图表类的插件
* 有没有做过Chrome扩展程序
* HTTP报文中常见的首部行，`Etag`的作用
* 跨域的方案及JSONP的原理
* 网站项目中有很多表单验证和提交，怎么处理
* 前端上传一个很大的文件（几百M），怎么处理
* `React`使用情况
* 之前项目的内容和主要职责，以及离职原理，说说上一个公司的缺点

## 总结
感觉这次面试揭露了自己很多地方的不足，回答的不好，加之公司的技术栈跟自己的不是很相符，因此估计是没戏了，还得好好准备啊