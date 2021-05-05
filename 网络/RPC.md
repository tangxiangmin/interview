RPC
===

## thrift

参考
* https://segmentfault.com/a/1190000012612473
* https://juejin.im/post/5be058ee6fb9a049f153a845
* https://www.cnblogs.com/cyfonly/p/6059374.html
* [基于 Thrift 的 Node.js 微服务](https://segmentfault.com/a/1190000004610166)

`Thrift`是一个轻量级、跨语言的RPC框架，包含如下特性

- 基于IDL（接口描述语言）生成跨语言的RPC clients and servers，支持超过20种语言
- 支持二进制的高性能的编解码框架
- 支持NIO的底层通信
- 相对简单的服务调用模型

传输数据采用二进制格式，相对 XML 和 JSON 体积更小，对于高并发、大数据量和多语言的环境更有优势。

关键字

* `namespace`　定义包名
* `struct`　定义服务接口的参数，返回值使用到的类结构。如果接口的参数都是基本类型，则不需要定义struct
* `service`　定义接口

数据类型

```
bool 布尔型
byte ８位整数
i16  16位整数
i32  32位整数
i64  64位整数
double 双精度浮点数
string 字符串
binary 字节数组
list<i16> List集合，必须指明泛型
map<string, string> Map类型，必须指明泛型
set<i32> Set集合，必须指明泛型
```

## GRPC



## 集中配置管理

参考
* [ 集中配置管理](https://www.jianshu.com/p/67d0f5081e57)

常规项目会有很多配置文件,比如数据库链接信息, 缓存信息；为了减少手动修改配置文件带来的工作繁琐及容易出错等问题，可以使用集中配置管理系统

## GraphQL

## Serverless