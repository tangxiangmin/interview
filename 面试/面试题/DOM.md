
## 请描述`Cookie`，`sessionStorage`，`localStorage`的区别
相同：
都是保存在浏览器，且同源的。

区别：
* cookies 和 Storage 的区别：
  * cookies会在服务器端和客户端间传递的；sessionStorage 和 localStorage存放在客户端的，不会发送至服务器端，仅在本地保存。
  * cookies的兼容主流浏览器,包括IE6+;IE6，IE7不支持sessionStorage 和 localStorage
    sessionStorage 和 localStorage中能存的数据比cookie大（cookie不能超过4k）

* sessionStorage 和 localStorage的区别：
  * sessionStorage存的数据在每次关闭浏览器后被删除，localStorage不会。
  * 作用域不同，sessionStorage不在不同的浏览器窗口中共享，即使是同一个页面；localStorage 在所有同源窗口中都是共享的；cookie也是在所有同源窗口中都是共享的


## 事件委托
一个定时器，定时向容器插入`a`标签，要求任何时刻点击`a`标签都弹出对应数据，复习事件委托
```
t.onclick = function(e){
    var target = e.target
    if (target.tagName.toUpperCase() == "A"){
    	alert(target.innerHTML);
    }
}
```


## 常见的Web安全问题
XSS是跨站脚本攻击，指的是在用户浏览器渲染整个HTML文档过程中出现了不被预期的脚本指令。常见的处理措施有
* 过滤用户的输入，对输出到页面的文档进行转义，可有效防止反射XSS和存储XSS
* 要尽力避免代码中比较常规的一些安全漏洞，比如eval等。

* 输入校验，包括长度限制、值类型是否正确，是否包含特殊字符
* 输出编码，根据输出位置进行相应的编码，遵守该数据不要超出自己所在的区域，也不要被当作指令执行

CSRF是跨站请求伪造，攻击的发生是由各种请求造成的，对于CSRF来说，它的请求有两个关键点，跨站点和请求伪造。诱导用户访问恶意网站，并构造一个正常请求，由于正常请求会携带用户身份信息，就可以发生攻击了。常见的处理措施有
* 检验referrer
* 使用随机生成的一次性token，然后对提交的请求进行校验

扩展：
* 在项目中有没有遇到什么安全漏洞的问题
