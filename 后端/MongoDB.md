

## mongobd
mongodb安装及启动
* brew安装
* 新建`/data/db`,修改相关权限
* 先mongod启动数据库
* 然后新启窗口，mongo链接数据库

相关概念：
* 表->集合
* 行->文档
* 列->字段

当第一个文档插入时，集合就会被创建。

常用命令
```
# 查看数据库
show dbs

# 进入某个数据库
use dbname

# 查看当前数据库所有集合
show collections

# 创建集合
db.createCollection(collname)
# 查询集合内容
db.collname.find()
# 删除集合
db.collname.drop()

# 插入文档
db.collname.insert({"name":"txm", age:24})
# 查询文档
db.collname.find()
# 条件查询
db.test.find({"age": 24})
# 更新文档，第一个参数是条件查询，第二个参数是更新值
db.test.update({"age":24}, {$set: {"name":"another name"}})
# 删除文档
db.test.remove({age:1})
```


参考文档
* http://mongodb.github.io/node-mongodb-native/3.0/reference/ecmascriptnext/crud/
* http://www.runoob.com/mongodb/mongodb-databases-documents-collections.html
* http://www.yiibai.com/mongodb/mongodb_quick_guide.html


## 数据备份

参考
* https://www.runoob.com/mongodb/mongodb-mongodump-mongorestore.html
* 

```
# 语法
mongorestore -h <hostname><:port> -d dbname <path>

# 实例
mongodump -d school -o ~/Desktop 
```

## mongodb分页效率低

参考
* https://mafgwo.cn/2019/01/16/1101_MongoDB%E5%A4%A7%E6%95%B0%E6%8D%AE%E5%88%86%E9%A1%B5%E6%9F%A5%E8%AF%A2%E7%9A%84%E9%97%AE%E9%A2%98/

为什么呢？

* 根据查询条件count总数的时候，索引根本无用。
* 使用skip+limit方式，页数越大查询性能约会越来越低。

分页查询性能瓶颈大概在什么数量级就能体现出来？
* 数据量不需要很大，达到几十万就开始凸显查询慢的问题了，当达到百万级别时，甚至要3s左右的时间响应了。
* 针对几十万、几百万、上千万的数据表，mysql的分页查询性能都比mongodb好了n倍。

要用MongoDB并且还要分页怎么办
* 加建有索引的时间范围过滤，控制最大时间范围，确保该时间范围到数据量不会太大。
* 不使用正常的分页，即返回没有总数和总页数的信息，每次拿都是下一页下一页拿，拿到没有为止。（因为大数据量count查询超级慢）
* 如果查询条件复杂，查询的数据量很大的，就强烈建议不要用mongodb了，用ElasticSearch吧。

