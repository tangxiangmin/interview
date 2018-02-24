HTTP
===
参考：
* [前端必备HTTP技能之HTTP请求头响应头中常用字段详解](http://www.jianshu.com/p/6e86903d74f7)


## 常见的通用头

* __`Cache-Control`设置请求响应链上所有的缓存机制必须遵守的指令__
* `Date`用来说明构建报文的时间和日期

## 常见的请求头
### Accept头部
* __`Accept`设置接受的内容类型__ 
* `Accept-Charset` 设置接受的字符编码
* `Accept-Encoding`设置接受的编码格式
* `Accept-Datetime`设置接受的版本时间
* `Accept-Language`设置接受的语言

### 请求实体首部行
* __`Content-Type`设置请求体的MIME类型（适用POST和PUT请求）__
* `Content-Length`设置请求体的字节长度
* `Content-MD5`设置基于MD5算法对请求体内容进行Base64二进制编码

### 资源请求头部
* __`Origin`标识跨域资源请求（请求服务端设置Access-Control-Allow-Origin响应字段）__
* `Range` 请求部分实体，设置请求实体的字节数范围，具体可以参见HTTP/1.1中的Byte serving

### 条件请求头部
* __`if-Modified-Since` 设置更新时间，从更新时间到服务端接受请求这段时间内如果资源没有改变，允许服务端返回304 Not Modified__
* __`If-None-Match`设置客户端ETag，如果和服务端接受请求生成的ETage相同，允许服务端返回304 Not Modified__
* `If-Match`设置客户端的ETag,当时客户端ETag和服务器生成的ETag一致才执行，适用于更新自从上次更新之后没有改变的资源
* `If-Range`设置客户端ETag，如果和服务端接受请求生成的ETage相同，返回缺失的实体部分；否则返回整个新的实体
* `If-Unmodified-Since` 设置更新时间，只有从更新时间到服务端接受请求这段时间内实体没有改变，服务端才会发送响应

### 用户识别头部
* __`Cookie`设置服务器使用Set-Cookie发送的http cookie__
* __`Authorization`设置HTTP身份验证的凭证__
* `From`设置发送请求的用户的email地址
* `Host`设置服务器域名和TCP端口号，如果使用的是服务请求标准端口号，端口号可以省略
* `Referer 设置前一个页面的地址，并且前一个页面中的连接指向当前请求，意思就是如果当前请求是在A页面中发送的，那么referer就是A页面的url地址`
* `User-Agent`用户代理的字符串值

## 常见的响应头
* `Set-Cookie`设置cookie