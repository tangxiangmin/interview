Java
===


## Java项目结构与分层
参考
* [DAO层，Service层，Controller层、View层](https://blog.csdn.net/zdwzzu2006/article/details/6053006)，2010年的文章，貌似仍不过时


### Bean
JavaBean可以理解为某段JSON的Java类，主要包括字段定义、

### DAO层

DAO层主要是做数据持久层的工作，数据库设计的表与DAO层之间一一对应，DAO类需要实现增删查改等库的通用方法

### Service层

Service层主要负责业务模块的逻辑设计，需要操作已定义的单个或多个DAO类来封装业务逻辑

比如生成订单，需要在Service提供的接口中检查库存、检查用户、插入订单记录等逻辑


### Controller层

Controller层负责业务模块流程，对外主要表现为暴露页面URL或HTTP接口，其中调用Service层来处理特定URL的业务逻辑，然后返回JSON数据或View视图