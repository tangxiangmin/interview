PHP
===

> php是世界上最好的语言


## 包管理工具composer

[Composer](https://getcomposer.org/)是PHP的软件包管理系统，它提供用于管理PHP软件和依赖库关系的标准格式

## Nginx代理php服务器

除了使用wamp、mamp等集成工具搭建php开发环境之外，还使用nginx 搭建php运行环境

参考
* [Nginx和PHP的配置](https://segmentfault.com/a/1190000014610688)
* [php-fpm安装、配置与优化](https://blog.csdn.net/ivan820819/article/details/54970330)


PHP在 5.3.3 之后已经将`php-fpm`写入php源码核心，在安装php的时候，通过`–enable-fpm`自动进行编译。其实质是一个 PHP FastCGI管理器，会启动一个本地服务器

### 启动php-fpm

首先启动php-fpm
```
sudo php-fpm
```
php-fpm的默认启动端口号为9000,可以在`/etc/php-fpm.conf`中修改
```
listen = 127.0.0.1:9000
```

### 修改nginx配置

接下来修改nginx的配置

```
server {
    listen 80;
    server_name phptest.com;
    
    root         /Users/Txm/test; # php 项目根目录
    index index.php index.html index.htm;

    location ~ \.php$ {
        # 设置监听php-fpm的端口
        fastcgi_pass   127.0.0.1:9000;
        fastcgi_index  index.php;
        fastcgi_param  SCRIPT_FILENAME  $document_root$fastcgi_script_name;
        include        fastcgi_params;
    }
}
```


### 附录:php-fpm相关目录

linux下
```
/usr/local/php/php
/usr/local/php/etc/php.ini
/usr/local/php/sbin/php-fpm
/usr/local/php/etc/php-fpm.conf
```

mac下
```
/usr/bin/php
/etc/php.ini
/usr/bin/php-fpm
/etc/php-fpm.conf
```

## 框架
### ThinkPHP

怎么说呢~
### Larvel

PHP中最现代化的框架之一
