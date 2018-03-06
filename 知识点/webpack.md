webpack
===

* 基本需求，比如样式表分离，脚本压缩，内联文件，HTML模板，热更新等
* 常用loader和插件，打包策略
* 优化，打包效率，输出包体积等

参考：
* http://imweb.io/topic/59324940b9b65af940bf58ae
* [深入浅出webpack-电子书](http://webpack.wuhaolin.cn/)

## 核心概念
> webpack是一个打包模块化js的工具，可以通过loader转换文件，通过plugin扩展功能。

* Entry：入口，Webpack 执行构建的第一步将从 Entry 开始，可抽象成输入。
* Module：模块，在 Webpack 里一切皆模块，一个模块对应着一个文件。Webpack 会从配置的 Entry 开始递归找出所有依赖的模块。
* Chunk：代码块，一个 Chunk 由多个模块组合而成，用于代码合并与分割。
* Loader：模块转换器，用于把模块原内容按照需求转换成新内容。
* Plugin：扩展插件，在 Webpack 构建流程中的特定时机注入扩展逻辑来改变构建结果或做你想要的事情。
* Output：输出结果，在 Webpack 经过一系列处理并得出最终想要的代码后输出结果。

## 流程

从启动webpack构建到输出结果经历了一系列过程，它们是：
* 解析webpack配置参数，合并从shell传入和webpack.config.js文件里配置的参数，生产最后的配置结果。
* 注册所有配置的插件，好让插件监听webpack构建生命周期的事件节点，以做出对应的反应。
* 从配置的entry入口文件开始解析文件构建AST语法树，找出每个文件所依赖的文件，递归下去。
* 在解析文件递归的过程中根据文件类型和loader配置找出合适的loader用来对文件进行转换。
* 递归完后得到每个文件的最终结果，根据entry配置生成代码块chunk。
* 输出所有chunk到文件系统。
* 需要注意的是，在构建生命周期中有一系列插件在合适的时机做了合适的事情，比如UglifyJsPlugin会在loader转换递归完后对结果再使用UglifyJs压缩覆盖之前的结果。
