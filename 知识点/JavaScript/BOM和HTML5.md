
BOM
===

BOM（浏览器对象模型）是浏览器本身的一些信息的设置和获取，一般常用的是
* navigator，用于获取浏览器特征，比如判断平台等
* screen，获取屏幕宽高
* location，获取网址、协议、path、参数、hash 
* history，访问浏览器的历史记录栈


### cookies，sessionStorage 和 localStorage
相同：都是保存在浏览器，且同源的。
区别：
* cookies 和 ＊Storage 的区别：
    * cookies会在服务器端和客户端间传递的；
    * sessionStorage 和 localStorage存放在客户端的，不会发送至服务器端，仅在本地保存。
    * cookies的兼容主流浏览器,包括IE6+;IE6，IE7不支持sessionStorage 和 localStorage
    * sessionStorage 和 localStorage中能存的数据比cookie大（cookie不能超过4k）
* sessionStorage 和 localStorage的区别：
    * sessionStorage存的数据在每次关闭浏览器后被删除，localStorage不会。
    * 作用域不同，sessionStorage不在不同的浏览器窗口中共享，即使是同一个页面（刷新页面可以继续存在）；
    * localStorage 在所有同源窗口中都是共享的；cookie也是在所有同源窗口中都是共享的
