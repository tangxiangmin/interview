前端工程化
===

前端工程化涵盖：创建、开发、编译、打包、测试、发布、监控全流程

## 项目初始化：cli工具
目前主流框架都提供了cli工具方便快速搭建项目，如`create-react-app`、`vue-ci`等。

cli本质是一种用户操作界面，根据一些指令和参数来与程序完成交互并得到相应的反馈。使用cli，一般需要以下方面
* 基本命令使用，如`vue create myAPP`
* 自定义配置，在某些场景下，官方提供的配置并不能满足业务需求，因此需要掌握手动修改cli配置的方法，如在CRA项目中使用`npm run reject`展示源配置文件，手动配置
* 内部实现，我们需要大致了解工具内部原理实现，这样方便定位问题

## 开发环境
前端开发环境，可以明显提高我们的开发效率，常见需求
* 本地开发 lint的规范一定要在项目初期就落地
* 处理模块化：在开发环境CSS 和 JS 的模块化语法，在线上进行打包，如`webpack`
* 编译语法：SCSS、ES6等需要转换成浏览器被浏览器识别的代码，如预编译`SCSS`、后处理`PostCSS`等
* 代码压缩：将 CSS、JS 代码混淆压缩，为了让代码体积更小，加载更快，如`uglifyJS`等

### 开发工具
* 编码工具，常见功能比如指定文件代码高亮、主题、代码联想啥的，常用Webstorm、VScode
* host切换工具，常在线上、测试环境、本地等多个环境下切换host，推荐[SwitchHosts](https://github.com/oldj/SwitchHosts)
* 抓包，调试移动端接口时，需要进行抓包，Mac上使用Charles，Windows上使用Fidder
* 终端，需要了解终端常用的一些命令

### 版本控制
参考
* [关于版本控制](https://git-scm.com/book/zh/v2/%E8%B5%B7%E6%AD%A5-%E5%85%B3%E4%BA%8E%E7%89%88%E6%9C%AC%E6%8E%A7%E5%88%B6)
* [git教程](https://www.liaoxuefeng.com/wiki/896043488029600)


用的比较多的是`Git bash`和`source tree`，学习git需要掌握下面几个方面的知识
* 掌握基本的概念和命令，如提交、版本回退、分支等
* 规范commit，可以使用[commitizen](https://www.npmjs.com/package/commitizen)来规范commit提交信息
* 了解多人协作开发时的[git flow](https://www.git-tower.com/learn/git/ebook/cn/command-line/advanced-topics/git-flow)

### 数据模拟
使用mock，前后端分离

## 测试
单元测试，`BDD`、`TDD`等，使用mocha等工具

## 打包

目前比较流行的做法是`webpack`打包项目代码，`rollup`打包工具库代码

## 发布
`travis-ci`、git hooks、shell等，通过命令自动部署到生成环境，提供日志和回滚等功能，避免手动发布出错。


## 监控
前端打点、日志统计
