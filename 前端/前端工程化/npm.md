


参考
* [2018 年了，你还是只会 npm install 吗](https://juejin.im/post/5ab3f77df265da2392364341)，这篇文章讲的很全，不妨移步阅读

## 相关概念
### 模块与包
参考：[About packages and modules](https://docs.npmjs.com/about-packages-and-modules)

模块`Module`是任何的能被nodejs程序使用require加载的模块。满足以下条件均可以称为Module：
* 一个文件夹包含package.json文件并指定了main字段
* 一个文件夹包含index.js文件
* 一个javascript文件

需要知道的是，JavaScript模块规范有`CommonJS`、`ES6 module`、`AMD`等多种形式。

大多数Package都是一个Module，下面是官网上关于`pacekage`的定义，可以大致了解一下，不必拘泥于相关概念
* (a)一个包含了程序和描述该程序的 package.json 文件 的 文件夹
* (b)一个包含了 (a) 的 gzip 压缩文件
* (c)一个可以下载得到 (b) 资源的 url (通常是 http(s) url)
* (d)一个格式为 `<name>@<version>` 的字符串，可指向 npm 源(通常是官方源 npmjs.org)上已发布的可访问 url，且该 url 满足条件 (c)
* (e)一个格式为 `<name>@<tag>` 的字符串，在 npm 源上该`<tag>`指向某 `<version>` 得到 `<name>@<version>`，后者满足条件 (d)
* (f)一个格式为 `<name>` 的字符串，默认添加 latest 标签所得到的 `<name>@latest` 满足条件 (e)
* (g)一个 git url, 该 url 所指向的代码库满足条件 (a)

[npm](https://www.npmjs.cn/)全称为`Node Package Manager`，是一个基于Node.js的**包**管理器，npm 存在的目的是避免 JS 开发者重复造轮子，让大家的劳动成果可以共享。

### package.json

package.json 文件就是定义了项目的各种元信息，包括项目的名称、git仓库地址、作者等等，最重要的是其中定义了我们项目的依赖插件和环境。一般情况下，不需要将`nodu_modules`放入版本控制，只需要管理这个package.json文件，然后通过`npm install`，就会自动下载相关依赖。

`package.json`的每个字段都有一些特定的用途，关于包依赖有`devDependencies`和`dependencies`两个字段，他们的区别在于：
* 前者是开发的时候需要的依赖项，使用`npm i xxx -S`安装
* 后者是程序正常运行需要的包，使用`npm i xxx -D`安装

此外某些框架或工具还会额外扩展`package.json`的配置，如`babel`等可以也可以直接在`package.json`中配置

### 语义化版本
npm包的版本号使用[semver](https://semver.org/lang/zh-CN/) 定义。版本号实际上是一个特定含义的字符串，其格式为`主版本号.次版本号.修订号`，版本号递增规则如下
* 主版本号：当你做了不兼容的 API 修改，
* 次版本号：当你做了向下兼容的功能性新增，
* 修订号：当你做了向下兼容的问题修正。

package.json中的依赖版本号可以包含`^`、`~`、`>=`等前缀
* caret(箭头)表示： ^2.0.2能帮你下载最新的2.x.x的包，不能下载1.x.x的包。比如最新的是2.1.0， 就是直接下载2.1.0。
* tilde(波浪线)表示： ～2.0.2能帮你下载2.0.x的最新包，不能下载2.1.x的包，比 ^ 要更加谨慎一些。比如最新的包如果是2.0.3， 就会下载，而如果是2.1.3就不会下载。
* `>=`表示需要版本号大于或等于指定版本
* `<=`表示需要版本号小于或等于指定版本
* 没有任何符号就表示严格匹配，必须下载该版本号的依赖包

此外，在`package.json`中任意两条规则，通过 `||` 连接起来，表示“或”逻辑，即两条规则的并集。

### package-lock
参考：[记package-lock引发的一次事故](https://www.shymean.com/article/%E8%AE%B0package-lock%E5%BC%95%E5%8F%91%E7%9A%84%E4%B8%80%E6%AC%A1%E4%BA%8B%E6%95%85)

`package-lock.json`是当 `node_modules`或`package.json`发生变化时自动生成的文件。这个文件主要功能是确定当前安装的包的依赖，以便后续重新安装的时候生成相同的依赖，而忽略项目开发过程中有些依赖已经发生的更新。

Lock机制是为了保证多人开发的统一性。什么是统一性？就是无论何时来了一个新人、换了个新电脑，我们npm i的包都是一致的，不管在那一台机器上执行 npm install 都会得到完全相同的 node_modules 结果。

随着项目越来越大，依赖越来越多，很难保证每一个npm包的最新版本都是适合的、有用的。Lock机制可以最大化解决此类冲突。在多人协作时同步开发环境。至于什么时候用新的包，到时候再同步lock文件就是。

基于以上原因，建议将package-lock文件锁定安装时的包的版本号，并且上传到git，以保证其他人在npm install时大家的依赖能保证一致。

## npm install
参考:
* [npm-install](https://docs.npmjs.com/cli/install)
* [npm 模块安装机制](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/22) 

### 模块安装流程
有了npm之后，我们只需要通过`npm install xxx`就可以从npm仓库里面下载别人写好的包，然后在代码里面引入相关的模块进行开发。

安装流程如下
* npm 模块安装机制：
* 发出npm install命令
* 查询node_modules目录之中是否已经存在指定模块
    * 若存在，不再重新安装
    * 若不存在
        * npm 向 registry 查询模块压缩包的网址
        * 下载压缩包，存放在根目录下的.npm目录里
        * 解压压缩包到当前项目的node_modules目录

具体阶段可分为下面几个步骤
* 如果工程定义了`preinstall`钩子，则先执行
* 根据`package.json`中的`dependencies` 和 `devDependencies` 属性中直接指定的模块确定首层依赖，构建一颗以工程本身为根节点的依赖树
* 分析完模块依赖，就开始获取模块，获取模块是一个递归的过程
    * 获取模块信息，在下载一个模块之前，首先要确定需要下载的包semver版本，然后返回对应的压缩包地址
    * 获取模块实体，上一步会获取到模块的压缩包地址（resolved 字段），npm 会用此地址检查本地`node_modules`是否已经安装该包，如果没有则从仓库下载，下载的文件会放在`node_modules`下
    * 查找该模块依赖，如果有依赖则回到第1步，如果没有则停止。

这里需要理解`模块扁平化（dedupe）`的概念。一棵完整的依赖树，其中可能包含大量**重复模块**，重复模块指的是模块名相同且semver兼容。已重复的模块不需要重新安装，这可以使更多冗余模块在 dedupe 过程中被去掉。
* npm2中，`node_modules`采用简单的递归安装方法，不同的依赖包里面可能包含重复的底层包依赖
* npm3中，`node_modules` 目录改成了更加扁平状的层级结构，得益于 node 的模块加载机制，模块可以在上层的`node_modules`目录中成功加载依赖，从而实现模块扁平化
* npm5中，新增了`package-lock.json`文件，其作用是锁定依赖安装结构，内部与node_modules 目录的文件层级结构是一一对应的

### 优化install速度

**切换镜像**

日常工作可能需要从npm官方源、淘宝镜像、公司私有源等仓库来回切换，因此推荐[nrm](https://www.npmjs.com/package/nrm)工具管理npm源
```
# 列举目前配置的源列表
nrm ls 
# 使用淘宝源
nrm use taobao
# 增加一种源，然后就可以在ls 和 use中使用了
nrm add xxxxx
```

**直接从缓存安装**

参考：[npm 模块安装机制简介](http://www.ruanyifeng.com/blog/2016/01/npm-install.html)

一个模块安装以后，本地其实保存了两份。一份是~/.npm目录下的压缩包，另一份是node_modules目录下解压后的代码。

运行npm install的时候，只会检查node_modules目录，而不会检查~/.npm目录。也就是说，如果一个模块在～/.npm下有压缩包，但是没有安装在node_modules目录中，npm 依然会从远程仓库下载一次新的压缩包

这种行为固然可以保证总是取得最新的代码，但有时并不是我们想要的。最大的问题是，它会极大地影响安装速度。因此可以通过`--cache-min`从本地的缓存目录中直接解压包文件。

## npm script

参考：[npm scripts 使用指南](http://www.ruanyifeng.com/blog/2016/10/npm_scripts.html)

常见的`cli`工具，都增加了一个`npm scripts`命令，如`npm run build`、`npm run serve`等

每当执行`npm run`，就会自动新建一个 Shell，在这个 Shell 里面执行指定的脚本命令。因此，只要是 Shell（一般是 Bash）可以运行的命令，就可以写在 npm 脚本里面。

### npx
npx是什么呢？ npx 会帮你执行依赖包里的二进制文件。 
```
npm i webpack -D      //非全局安装

// 无npx 执行 webpack 的命令
./node_modules/.bin/webpack -v

// 使用npx
npx webpack -v 
```


## 如何发布自己的npm包

### 编写本地模块
参考
* [ 怎么样写一个 node.js模块以及NPM Package](http://blog.csdn.net/bugknightyyp/article/details/8783162)

首先，新建一个`txm`文件夹，管理我们的整个模块文件，
* `index.js`，用来存放模块的主要逻辑，注意按照CommonJS规范来书写模块，即每个模块使用`exports`暴露接口
* `package.json`，模块的配置，比如名称，版本和相关依赖等等
* `README.md`，模块的介绍和使用等

然后再`txm`文件夹中使用`npm pack`将整个文件夹打包，会显示生成`txm-0.0.1.tgz`(这个版本号是在package.json中定义)。

然后返回上一层，使用`npm install txm/txm-0.0.1.tgz`将txm模块包进行安装。        
这里需要注意不能再txm文件夹中直接使用`npm install txm-0.0.1.tgz`，会出现`Refusing to install xm as a dependency of itself`的错误信息

可以在整个项目文件夹的`node_modules`文件夹中发现我们的模块包了。
最后在项目的文件比如`main.js`中就可以直接使用`let txm = require('txm')`来加载我们的模块了。

### 发布及注意事项
编写好本地包之后，如果需要发布到npm仓库上供其他用户使用，按照以下步骤进行
* 将镜像切换回`https://registry.npmjs.org/`，其他源如[淘宝npm](https://npm.taobao.org)会定期从npm官网上同步包，因此只需要发布在npm上即可
* `npm adduser`、`npm login`登录需要发布模块的账号
* 注意包名和版本号，是否已经存在了

目前npm的包名为了防止“误植”攻击，会自动检测相近的包名，参考[https://www.w3cvip.org/topics/393](https://www.w3cvip.org/topics/393)。

解决办法是加命名空间，然后修改发布权限
```
"name": "@shymean/koa-mock",
  
npm publish --access=public
```

具体实践可以参考之前写的一篇文章:
* [写一个搭建本地mock服务器的命令行工具](https://www.shymean.com/article/%E5%86%99%E4%B8%80%E4%B8%AA%E6%90%AD%E5%BB%BA%E6%9C%AC%E5%9C%B0mock%E6%9C%8D%E5%8A%A1%E5%99%A8%E7%9A%84%E5%91%BD%E4%BB%A4%E8%A1%8C%E5%B7%A5%E5%85%B7#4.%20npm%E6%9C%AC%E5%9C%B0%E5%8C%85%E5%8F%8A%E5%8F%91%E5%B8%83)。

## 搭建本地npm服务器

在某些时候不方便将模块发布到公共的npm仓库，因此就有了搭建本地npm服务器的需求

在之前可以使用[sinopia](https://github.com/rlidwka/sinopia)来搭建npm私有仓库，但sinopia已经年久失修了，目前一般使用[verdaccio](https://github.com/verdaccio/verdaccio)

```
# 全局安装
npm i verdaccio -g 

# 启动服务
verdaccio

# 如果希望开启守护经常，可以使用pm2 
pm2 start verdaccio

http://localhost:4873
```

可以修改`vs ~/.config/verdaccio/config.yaml`的相关配置，比如当找不到包时如果希望去其他镜像查找，则修改`uplinks`参数

```
uplinks:
  npmjs:
    url: https://registry.npmjs.org/
    # 可以修改为淘宝镜像 url: https://registry.npm.taobao.org/ 
```

如果是公司级别的npm私库，可以考虑使用Docker安装verdaccio镜像，或者购买云服务厂商的私有包托管仓库。

## 修改npm镜像

如果是临时修改镜像源，可以通过`--registry`参数

```
npm --registry https://registry.npm.taobao.org install
```

永久修改registry，则可以通过`npm config`
```
npm config set registry https://registry.npm.taobao.org/
```

如果需要经常在多个镜像之间来回切换，可以使用nrm

```
npm install -g nrm

# 查看镜像
nrm ls

# 使用某个镜像
nrm use taobao

# 添加镜像
nrm add local http://localhost:4873/
```

## 其他包管理工具

### yarn

Yarn是由Facebook、Google、Exponent 和 Tilde 联合推出了一个新的 JS 包管理工具，主要目的是弥补npm的一些设计缺陷。

在当时还是npm4.x的时代背景下，npm存在的一些缺陷
* npm install的时候非常慢，要安装的依赖太多了，并且是按照队列顺序安装每个依赖
* 同一个项目，安装的时候无法保持一致性，没错，当时还没有package-lock.json

yarn具备的优点
* 安装速度快，主要靠：并行下载、缓存离线安装
* yarn.lock记录每个被安装的依赖的版本

npm5.x之后做出了一些改动
* 增加了package-lock.json
* 文件依赖优化，通过symlinks依赖本地模块（之前是拷贝文件到node_modules）    

yarn切换镜像的话，可以使用[yrm](https://www.npmjs.com/package/yrm)，跟上面的nrm基本一致。

### cnpm

不要用，不如使用npm然后改个taobao镜像。
