## gulp
gulp的基本使用流程为：引入插件——定义任务——执行任务
```
gulp.task(taskname, function(){
  	return gulp.src(filename)
  			   .pipe(plugin.methods)
  			   .pipe(gulp.dest(dest));
})
```

一些常见的开发环境需求都可以找到相关插件，如`gulp-sass`、`gulp-autoprefixer`、`gulp-babel`等

一个gulp插件实际就是一个函数，可以通过`through-gulp`，处理上一个插件导出的文件流，然后返回处理后的文件流，下面是一个编写gulp插件的例子

```js
var through2 = require('through2');
module.exports = modify;
function modify(){
    return through2.obj(function(file, encoding, cb){
        // 内容转换，处理好后，再转成Buffer形式
        var content = versionFun(file.contents.toString());
        file.contents = new Buffer(content);
        // 下面这两句基本是标配，可参考through2的API
        this.push(file);
        cb();
    });
}

function versionFun(data){
    return data.replace(/{{something}}/, 'xxxxx');
}
```
gulp、grunt等工具，如今貌似已经完成了他们的历史使命，逐渐成为过往了

## Fis3
参考
* [官方文档](http://fis.baidu.com/fis3/docs/beginning/debug.html#%E6%B5%8F%E8%A7%88%E5%99%A8%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0)
* [前端构建工具-fis3使用入门](https://blog.csdn.net/renfufei/article/details/74926339)
* [我想问下fis3和webpack有什么区别?](https://www.zhihu.com/question/50829160)
* [fis3总结](https://tangciwei.github.io/2018/09/19/fis3%E6%80%BB%E7%BB%93/)

fis3 集成了web开发中常见的功能，只需要简单的配置即可，还是十分方便的。

除了基本的前端开发之外，fis3还提供了整套前端开发部署解决方法，尽管目前貌似已经不再更新了，其思想还是十分值得学习的。

### 基本原理
参考：[fis3文档](https://fis.baidu.com/fis3/docs/build.html#%E6%9E%84%E5%BB%BA%E6%B5%81%E7%A8%8B)

FIS3 是基于文件对象进行构建的，每个进入 FIS3 的文件都会实例化成一个 File 对象，然后在构建过程中对每一个File对象进行操作
* 扫描项目目录拿到文件并初始化出一个文件对象列表
* 对文件对象中每一个文件进行单文件编译
* 获取用户设置的 package 插件，进行打包处理（包括合并图片）

声明依赖能力为工程师提供了声明依赖关系的编译接口。FIS3 在执行编译的过程中，会扫描这些编译标记，从而建立一张 **静态资源关系表**，资源关系表详细记录了项目内的静态资源id、发布后的线上路径、资源类型以及 依赖关系 和 资源打包 等信息。

在fis3中，依赖本身在构建过程中就已经分析完成，并记录在静态资源映射表中，因此模块化框架只需要根据该映射表正确加载模块即可。

### 优缺点
fis3的本质是基于静态资源标记+动态解析静态资源表，在build时会生成一张资源依赖表，因此不论是纯前端渲染还是后端渲染，都很容易支持，因此可以做到非常精细化的控制资源的按需加载。
* 资源定位能力，可以有效地分离开发路径与部署路径之间的关系，工程师不再关心资源部署到线上之后去了哪里，变成了什么名字，资源定位结果可以被fis的配置文件控制，这些都可以通过配置来指定。而工程师只需要使用相对路径来定位自己的开发资源即可。

fis3的缺点在于其设计的**静态资源标记**依赖于一套内置实现的资源标记语法，这导致不能被浏览器或npm包如babel等工具进行解析。

webpack并没有生成一个颗粒化的静态资源表，对应打包前后的文件，但是社区十分好。
