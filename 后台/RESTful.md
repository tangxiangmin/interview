参考：
* [RESTful API 设计指南](http://www.ruanyifeng.com/blog/2014/05/restful_api.html)

## 原则
在RESTful架构中，每个网址代表一种资源（resource），所以网址中不能有动词，只能有名词，而且所用的名词往往与数据库的表格名对应。一般来说，数据库中的表都是同种记录的"集合"（collection），所以API中的名词也应该使用复数。

## 思考
也就是说，针对某个资源（具体来说是某张表），访问的资源路径（URL）是一样的，通过HTTP请求方式的不同，来达到对应的操作，比如一个`admin`管理员表
* GET admin 表示获取管理员列表
* POST admin 表示添加管理员
* DELETE admin 表示删除管理员

比如在前端，可以使用`axios`发送不同的的HTTP请求方法；在后端，使用`Laravel`针对具体的URL和不同的请求方法来绑定对应的控制器方法。这需要前后端按照对应的约定来编写请求方式

## 例子
```
GET /zoos：列出所有动物园
POST /zoos：新建一个动物园
GET /zoos/ID：获取某个指定动物园的信息
PUT /zoos/ID：更新某个指定动物园的信息（提供该动物园的全部信息）
PATCH /zoos/ID：更新某个指定动物园的信息（提供该动物园的部分信息）
DELETE /zoos/ID：删除某个动物园
GET /zoos/ID/animals：列出某个指定动物园的所有动物
DELETE /zoos/ID/animals/ID：删除某个指定动物园的指定动物

?limit=10：指定返回记录的数量
?offset=10：指定返回记录的开始位置。
?page=2&per_page=100：指定第几页，以及每页的记录数。
?sortby=name&order=asc：指定返回结果按照哪个属性排序，以及排序顺序。
?animal_type_id=1：指定筛选条件
```

## 常见误区

RESTful架构有一些典型的设计误区。

最常见的一种设计错误，就是URI包含动词。因为"资源"表示一种实体，所以应该是名词，URI不应该有动词，动词应该放在HTTP协议中。

举例来说，某个URI是/posts/show/1，其中show是动词，这个URI就设计错了，正确的写法应该是/posts/1，然后用GET方法表示show。