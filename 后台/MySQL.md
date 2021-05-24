

## 相关概念

数据库最主要的用途就是用来存储数据和使用(读取)数据。如何用正确的姿势使用数据库呢？

Mysql是一种关系型数据库，以及所支持的存储引擎。
* InnoDB是一个可靠的事物处理引擎，但是不支持全文本搜索
* MyISAM是一个性能极高的引擎，他支持全文不搜索但是不支持事物

这里有两个概念：
* 事物：用来保证批处理的数据要么全部成功执行，要么全部不成功（即在操作中出现错误时，会回复到没有进行操作之前的状态），保证表中数据的完整性
* 全文本搜索：主要用来解决LIKE搜索的限制

以及服务器，数据库和数据表之间所使用的字符集，编码以及校对：
* 字符：字母和符号的集合
* 编码：某个字符集成员的内部表示
* 校对：为规定字符如何进行比较的指令（排序）

### 创建流程

首先需要创建一个数据库，然后再数据库中创建需要的表。一般情况下会统一同一个数据库中的表前缀（便于识别且防止不同数据库下的表名重复导致混淆）。

创建表是非常重要的起点，应当尽力避免在后续的操作中重新更改表的结构，明智地规划不同表的用途和一张表的字段是一件十分困难的事情。

### 数据类型
选择合适的数据类型，最主要的目的是为了用较小的存储代价换来较高的数据库性能。此外，临时更改字段的数据类型可能会造成数据的丢失。MySQL主要支持的数据类型包括：
* 串
* 数值
* 日期
* 二进制

### 主键/空/默认值
NULL表示没有值或者缺值，实际上为了性能一般都会为字段定义NOT NULL。

主键是用来区别表中每个行的字段，这就要求主键的值必须惟一（多个主键则要求他们的组合值必须惟一），一般使用自增来保证主键的值AUTO_INCREMENT。注意主键只能为NOT NULL的字段。

如果为字段定义了非空，则在更新或者插入数据时就必须为该字段传值，为了解决这个问题，可以在定义字段时设置默认值，__MySQL不支持使用函数作为默认值__，（注意空字符串和NULL是完全不同的概念，''是一个有效的值）。

## CRUD
使用数据库主要就是围绕增删查改而来的。

### 查询

SELECT 是数据库中最重要的操作！我们将数据放在数据库中，并在需要的时候通过某种方式查询得到正确的数据.

* 普通查询
* 整理结果
* 子查询
* 联结
* 组合

详情语法如下：  

```sql
select 字段列表 from 表名 [where 条件] [order by 字段 asc|desc] [limit 起始位置，长度] [group by 字段名称（分组）] 
```       

* 查询部分字段
```
# 多个字段使用逗号分隔
select id,stuName from stu;
# 使用as为字段新增别名
select stuName as name from txm_test;
```
* order by 排序 ：asc升序，desc降序
```
select * from stu order by id desc;
```
* 截取
```
# 索引值是从0开始的
select * from stu limit 1,3;
```
* 分组
```
# 显示的是每个组的一条数据记录
select * from stu group by stuSex;
```
* where条件
    * 比较符号 > < >= <= = <>（不等于） 
    ```
    select * from stu where stuSex = 1;
    ```
    * 逻辑运算 and or 
    ```
    select * from stu where id > 1 and id < 3;
    ```
    * 模糊搜索：字符串中含有某个关键词，就能找到
    ```
    # %占位符表示0个或多个字符，_表示1个字符
    select * from stu where stuName like '%ta%';
    # between ... and ...连续区间
    # in 不连续范围，相当于连续使用or
    
    ```


### 增加
```sql
insert [into] 表名 [(列名...)] values (值...);
```

### 删除 
```sql
delete from 表名称 [where 删除条件];
```

### 修改
```sql
update 表名称 set 列名称=新值 [where 更新条件];
```

## 常见情形与对应语句



### 分组
可以使用聚合函数返回某个供应商提供的产品数目，如果需要返回每个供应商的产品数目，则需要使用分组。
```sql
SELECT vend_id, COUNT(*) AS num FROM products GROUP BY vend_id
```

但是：分组并不是用来返回二维数组的，mysql也并不能实现这样的功能。换个角度看，某个分组内部各行应该具有某些共同点才行，这个共同点就是有GROUP BY指定的，如果group子句的字段都不相同，则肯定会划分到不同的分组中去，造成一些困惑。

针对分组一个常见的需求是：返回每个分组包含的行， 有一个折中的办法就是使用`GROUP_CONCAT`函数。
```sql
SELECT GROUP_CONCAT(prod_id), GROUP_CONCAT(prod_name) FROM products GROUP BY vend_id;
```

使用分组的一个明显标志就是：如果与聚集函数一起使用列或表达式，则必须使用分组

### 子查询
如果某次查询的条件依赖于另外的查询结果，则可以使用子查询，如：筛选购买了某件商品的所有顾客
```sql
SELECT cust_id FROM orders WHERE order_num IN (
    SELECT order_num FROM orderitems WHERE prod_id = 'TNT2'); 
```
子查询的嵌套并没有限制，如果还需要根据cust_id查询对应顾客的详细信息，则可以将上面这条语句的查询结果再次作为从customer表中查询的筛选条件。

子查询的另外一个用处是计算字段，如：查询customers表中每个顾客的订单，订单保存在ordesr表中（尽管这种情况更合适的做法是使用联结）
```sql
SELECT 
    cust_id, 
    (SELECT COUNT(*) FROM orders WHERE customers.`cust_id` = orders.`cust_id`) AS orders FROM customers;
```

### 联表
把数据拆分在不同的表中很有必要，表之间通过外键相连。比如要查询供应商和供应商对应的产品
```
SELECT	vend_name, prod_name, prod_price FROM vendors, products WHERE vendors.`vend_id` = products.`vend_id`;
```
实际上联结更标准的写法是
```
SELECT	vend_name, prod_name, prod_price FROM vendors INNER JOIN  products ON vendors.`vend_id` = products.`vend_id`;
```

## 选择合适的数据类型
参考: [MySql 数据类型](http://jingyan.baidu.com/article/f0062228d2e4a8fbd3f0c8a6.html)

主要目的：用较小的存储代价换来较高的数据库性能。

* 整形
    * tinyint 1字节
    * smallint 2字节
    * int 4字节
    * BIGINT 8字节
* 浮点型
    * float 4字节
    * double 4字节
    * DECIMA[m,d] 精度小数 m 总位数 d 小数点右边的位数
* 字符串
    * char(位数) 定常字符
    * varchar(位数) 变长字符
    * text 65532个字符
    * MEDIUMBLOB 2^24个字符
    * enum('1'[,'2']) 枚举
* 日期
    * date 日期
    * time 时间
    * datetime 日期时间

```
create table stu(
    id int(6) auto_increment primary key,
    stuNUm varchar(6),
    stuName varchar(20),
    stuAge tinyint(2),
    stuSex enum("1","2"),
    stuTel varchar(20)
)

desc stu;
```

### 数字类型
数字类型分为三类：整数类、小数类和数字类

数字类

所谓的“数字类”，就是指 DECIMAL 和 NUMERIC，它们是同一种类型。它严格的说不是一种数字类型，因为他们实际上是将数字以字符串形式保存的;他的值的每一位 (包括小数点) 占一个字节的存储空间，因此这种类型耗费空间比较大。 
但是它的一个突出的优点是小数的位数固定，在运算中不会“失真”，所以比较适合用于“价格”、“金额”这样对精度要求不高但准确度要求非常高的字段。

小数类

小数类，即浮点数类型，根据精度的不同，有 FLOAT 和 DOUBLE 两种。它们的优势是精确度，FLOAT 可以表示绝对值非常小、小到约 1.17E-38 (0.000...0117，小数点后面有 37 个零) 的小数，而 DOUBLE 更是可以表示绝对值小到约 2.22E-308 (0.000...0222，小数点后面有 307 个零) 的小数。FLOAT 类型和 DOUBLE 类型占用存储空间分别是 4 字节和 8 字节。如果需要用到小数的字段，精度要求不高的，当然用 FLOAT 了。可是说句实在话，我们“民用”的数据，哪有要求精度那么高的

整数类

用的最多的，最值得精打细算的，是整数类型。从只占一个字节存储空间的 TINYINT 到占 8 个字节的 BIGINT，挑选一个“够用”并且占用存储空间最小的类型是设计数据库时应该考虑的。TINYINT、SMALLINT、MEDIUMINT、INT 和 BIGINT 占用存储空间分别为 1 字节、2 字节、3 字节、4 字节和 8 字节，就无符号的整数而言，这些类型能表示的最大整数分别为 255、65535、16777215、4294967295 和 18446744073709551615。如果用来保存用户的年龄 (举例来说，数据库中保存年龄是不可取的)，用 TINYINT 就够了

### 日期时间类型
日期和时间类型比较简单，无非是 DATE、TIME、DATETIME、TIMESTAMP 和 YEAR 等几个类型。只对日期敏感，而对时间没有要求的字段，就用 DATE 而不用 DATETIME 是不用说的了;单独使用时间的情况也时有发生――使用 TIME;但最多用到的还是用 DATETIME。在日期时间类型上没有什么文章可做，这里就不再详述。

### 字符 (串) 类型
不要以为字符类型就是 CHAR，CHAR 和 VARCHAR 的区别在于 CHAR 是固定长度，只要你定义一个字段是 CHAR(10)，那么不论你存储的数据是否达到了 10 个字节，它都要占去 10 个字节的空间;而 VARCHAR 则是可变长度的，如果一个字段可能的值是不固定长度的，我们只知道它不可能超过 10 个字符，把它定义为 VARCHAR(10) 是最合算的，VARCHAR 类型的占用空间是它的值的实际长度 +1。为什么要 +1 呢?这一个字节用于保存实际使用了多大的长度。从这个 +1 中也应该看到，如果一个字段，它的可能值最长是 10 个字符，而多数情况下也就是用到了 10 个字符时，用 VARCHAR 就不合算了：因为在多数情况下，实际占用空间是 11 个字节，比用 CHAR(10) 还多占用一个字节。

　　举个例子，就是一个存储股票名称和代码的表，股票名称绝大部分是四个字的，即 8 个字节;股票代码，上海的是六位数字，深圳的是四位数字。这些都是固定长度的，股票名称当然要用 CHAR(8);股票代码虽然是不固定长度，但如果使用 VARCHAR(6)，一个深圳的股票代码实际占用空间是 5 个字节，而一个上海的股票代码要占用 7 个字节!考虑到上海的股票数目比深圳的多，那么用 VARCHAR(6) 就不如 CHAR(6) 合算了。

　　虽然一个 CHAR 或 VARCHAR 的最大长度可以到 255，我认为大于 20 的 CHAR 是几乎用不到的――很少有大于 20 个字节长度的固定长度的东东吧?不是固定长度的就用 VARCHAR。大于 100 的 VARCHAR 也是几乎用不到的――比这更大的用 TEXT 就好了。TINYTEXT，最大长度为 255，占用空间也是实际长度 +1;TEXT，最大长度 65535，占用空间是实际长度 +2;MEDIUMTEXT，最大长度 16777215，占用空间是实际长度 +3;LONGTEXT，最大长度 4294967295，占用空间是实际长度 +4。为什么 +1、+2、+3、+4?你要是还不知道就该打 PP 了。这些可以用在论坛啊、新闻啊，什么的，用来保存文章的正文。根据实际情况的不同，选择从小到大的不同类型。
　　
### 枚举和集合类型
枚举 (ENUM) 类型，最多可以定义 65535 种不同的字符串从中做出选择，只能并且必须选择其中一种，占用存储空间是一个或两个字节，由枚举值的数目决定;集合 (SET) 类型，最多可以有 64 个成员，可以选择其中的零个到不限定的多个，占用存储空间是一个到八个字节，由集合可能的成员数目决定。

举个例子来说，在 SQLServer 中，你可以节约到用一个 BIT 类型来表示性别 (男/女)，但 MySQL 没有 BIT，用 TINTINT 吗?不，可以用 ENUM('帅哥','美眉')，只有两种选择，所以只需一个字节――跟 TINYINT 一样大，但却可以直接用字符串 '帅哥' 和 '美眉' 来存取。真是太方便啦!


## 预处理语句

预处理语句（Prepared Statements),是一种编译过的要执行的SQL语句模板，可以使用不同的变量参数定制它。

```php
// 占位符 :name
$sql = 'SELECT * FROM shop_admin WHERE id < :id';
$sth->bindParam(':id',$id); // 绑定数据
$sth->execute();

// 占位符 ?
$sql = 'INSERT INTO shop_admin (username, password) VALUES (?, ?)';
$sth->bindParam(1,$username); // 1 表示第一个问号占位符
$sth->bindParam(2,$password); // 2 表示第二个问号占位符
$sth->execute();

// 如果不想挨个绑定数据，也可以在执行时传入数组
$sth->execute(array('xxx','ooo'))
```
预处理语句的主要优点有：
* 查询语句只需要被解析一次，就可以使用不同的参数执行多次。如果要重复执行许多次仅仅是参数不同（但结构相同）的查询，会浪费很多时间。庆幸的是在使用支持预处理语句的数据库时，在当查询准备好（Prepared）之后，数据库就会分析，编译并优化它要执行查询的计划。通过使用预处理语句可以避免重复分析、编译、优化的环节，也就是说使用预处理语句可以让数据库服务器的效率提升。
* 预处理语句的中的参数不需要使用引号，相应地会减少SQL注入情形的发生。

## 远程连接MySQL

### mysql8及之前的版本

参考：
* [MySql创建本地用户和远程用户 并赋予权限](http://blog.csdn.net/chr23899/article/details/40401089)
* https://www.cnblogs.com/cnblogsfans/archive/2009/09/21/1570942.html

```
# vim /etc/mysql/my.cnf
vim /etc/mysql/mysql.conf.d/mysqld.cnf
```
注释掉绑定的本地地址
```
bind-address=127.0.0.1 ==> #bind-address=127.0.0.1
```
开放远程用户的访问权限
```
GRANT ALL PRIVILEGES ON *.* TO root@"%" IDENTIFIED BY "123456";
```
其中%代表任意ip，也可以指定其他ip地址，IDENTIFIED后面接登录密码，这里不需要跟本地的密码一样，注意密码强度。

刷新缓冲，重启mysql
```
flush privileges;
service mysql restart
```

现在就可以在本地使用`SQLyog`来访问外部数据库了
```
mysql -h IPaddress -uROOT -pPASSWARD
```

### mysql8之后的版本

参考： https://blog.csdn.net/skyejy/article/details/80645981

mysql8之后，需要先创建账号，再赋予权限

```
# 先创建
create user 'remote_admin'@'%' identified by '123456';

# 再赋予权限
GRANT ALL PRIVILEGES ON *.* TO remote_admin@"%" WITH GRANT OPTION;
```

如果是想要创建原始的账号密码，可以使用
```
create user 'native_root'@'127.0.0.1' IDENTIFIED WITH mysql_native_password BY '123456';
```