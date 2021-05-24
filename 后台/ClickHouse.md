搭建ClickHouse数据收集查询系统
===

在开发过程中，偶尔会遇见运营或者产品需要帮忙查数据的情况，本文将从产品规划、前端埋点、数据查询等方面整理相关流程

<!--more-->
参考
* [ClickHouse 中文文档](https://clickhouse.tech/docs/zh/)

## 数据统计开发流程
一般的数据统计流程如下
* 产品提出产品需求，并确定哪些地方需要进行埋点，提供对应的埋点参数字段
* 前端进行业务开发，并在对应逻辑处增加数据埋点上传
* 业务上线后，根据对应的参数字段查询相关数据

如果能实现让运营同学自己能够查询数据的话，整个效率应该会得到很大提升

## 数据收集埋点规范

埋点一般需要统计的字段

## 使用clickhouse

### Docker安装clickhouse
首先使用`Docker`安装`clickhouse`
```
docker pull yandex/clickhouse-client
docker pull yandex/clickhouse-server

# 启动服务端，暴露端口号
docker run -d --name clickhouse-test-server --ulimit nofile=262144:262144 -p 8123:8123 -p 9000:9000 -p 9009:9009 yandex/clickhouse-server

# 启动客户端
docker run -it --rm --link clickhouse-test-server:clickhouse-server yandex/clickhouse-client --host clickhouse-server
```
使用client连接服务器后，就可以进行数据库操作了
```
# 查看所有数据库
show databases;

# 创建数据库
create database shymean;

# 切换到数据库
use shymean;

# 创建表
CREATE TABLE test( id UInt16,col1 String,col2 String,create_date date ) ENGINE = MergeTree(create_date, (id), 8192);

# 向表中插入数据
INSERT INTO shymean.test (col1, col2) VALUES ('hello', 'test insert');
```

### NodeJS连接clickhouse
使用[clickhouse](https://www.npmjs.com/package/clickhouse)这个npm包
```js
const { ClickHouse } = require('clickhouse');
 
const clickhouse = new ClickHouse({
    url: 'http://localhost',
    port: 8123, // 使用前面暴露的端口号
    debug: false,
    basicAuth: null,
    isUseGzip: false,
    format: "json", // "json" || "csv" || "tsv"
    config: {
        session_id                              : 'session_id if neeed',
        session_timeout                         : 60,
        output_format_json_quote_64bit_integers : 0,
        enable_http_compression                 : 0,
        database                                : 'shymean',
    },
});
clickhouse.query(`SELECT * FROM shymean.test LIMIT 10`).exec(function (err, rows) {
    console.log(rows) // 查看到对应数据
});

```

这样就可以起一个服务用于收集前端提交的打点数据等

### clickhouse网页客户端

参考：[第三方开发的可视化界面](https://clickhouse.tech/docs/zh/interfaces/third-party/gui/)

尝试了一下[tabix](https://github.com/tabixio/tabix)，使用起来比较方便

![](http://img.shymean.com/oPic/1595856506953_475.png)

这种可视化的客户端可以方便运营和数据分析等同事自己查询数据，不再需要开发介入（或者是开发直接写好SQL语句）；对于复杂查询或者需要同时查询业务数据库的情况，可以封装成接口调用。

