Babel
===

[Babel](https://babeljs.io/docs/en/7.0.0/) 是一个通用的多功能 JavaScript 编译器，但与一般编译器不同的是它只是把同种语言的高版本规则转换为低版本规则，而不是输出另一种低级机器可识别的代码，并且在依赖不同的拓展插件下可用于不同形式的静态分析。

由于浏览器对于JavaScript新语法的支持总是滞后的，使用babel可以让我们快速使用新语法编写代码，且无需考虑浏览器兼容性的问题。

## Babel原理
参考
* [初学 Babel 工作原理](https://segmentfault.com/a/1190000019578478)
* [Babel 插件原理的理解与深入](https://segmentfault.com/a/1190000016359110)
* [Babel是如何读懂JS代码的](https://zhuanlan.zhihu.com/p/27289600)
* [一口（很长的）气了解 babel](https://zhuanlan.zhihu.com/p/43249121)

与编译器类似，babel转译过程也分为下面三个阶段
* 解析 Parse，通过 [`babylon`](https://babeljs.io/docs/en/7.0.0/babylon) 将代码解析生成抽象语法树( 即AST )
* 转换 Transform，接收AST并通过`babel-traverse`遍历AST，在此过程中进行添加、更新和移除等操作，大部分插件都是专注于该阶段的工作
* 生成 Generate，通过`babel-generator`将转换后的AST再重新生成JS代码

`babel-core`模块则是将三者结合使得对外提供的API做了一个简化。需要注意的是babel仅仅是转译新标准引入的语法，如箭头函数、class语法等，而新标准引入的原生对象、接口等，则需要使用`polyfill`实现。

## 使用方法
常见做法是设置一个根目录下的 [`.babelrc`](https://babeljs.io/docs/en/config-files#file-relative-configuration) 文件，用来设置转码规则和插件，其基本格式如下
```json
{
  "presets": [],
  "plugins": []
}
```

### plugins插件
通过`plugins`字段表示，要加载和使用的插件，插件名前的babel-plugin-可省略；plugin列表按从头到尾的顺序运行。

配置不同的插件，告诉babel我们的代码中有哪些是需要转译的，常用的插件如`transform-runtime`，该插件能自动为项目引入polyfill和helpers

```js
{
    "plugins": [
        ["transform-runtime", {
            "helpers": false, //自动引入helpers
            "polyfill": false, //自动引入polyfill（core-js提供的polyfill）
            "regenerator": true, //自动引入regenerator
        }]
    ]
}
```

就其`polyfill`与手动引入`babel-polyfill`相比
* `transform-runtime`是按需引入，需要用到哪些polyfill，runtime就自动帮你引入哪些，多个模块使用相同的polyfill，可能会造成重复引入
* `babel-polyfill`的引入是全局的，基本能满足所有新接口的polyfill。在小项目中可能会造成体积过大等问题
* 一般地使用原则是：开发框架和库时为了避免污染全局polyfill，建议使用`transform-runtime`；开发大型web应用时，建议使用`babel-polyfill`

### presets预设
通过`presets`表示要加载和使用的preset ，每个 preset 表示一个预设插件列表，preset名前的babel-preset-可省略；presets列表的preset按从尾到头的逆序运行。

目前官方推荐的使用preset为`babel-preset-env`，它能灵活决定加载哪些插件和polyfill，相当于CSS的`Autoprefixer`
```js
{
    "presets": [
        ["env", {
            "targets": { //指定要转译到哪个环境
                //浏览器环境
                "browsers": ["last 2 versions", "safari >= 7"],
                //node环境
                "node": "6.10", //"current"  使用当前版本的node
                
            },
             //是否将ES6的模块化语法转译成其他类型
             //参数："amd" | "umd" | "systemjs" | "commonjs" | false，默认为'commonjs'
            "modules": 'commonjs',
            //是否进行debug操作，会在控制台打印出所有插件中的log，已经插件的版本
            "debug": false,
            //强制开启某些模块，默认为[]
            "include": ["transform-es2015-arrow-functions"],
            //禁用某些模块，默认为[]
            "exclude": ["transform-es2015-for-of"],
            //是否自动引入polyfill，开启此选项必须保证已经安装了babel-polyfill
            //参数：Boolean，默认为false.
            "useBuiltIns": false
        }]
    ]
}
```

如果不采用 presets 完全可以单独引用某个功能。如果同时设置了presets和plugins，那么plugins的先运行；每个preset和plugin都可以再配置自己的option

### 执行顺序

前面提到，可以同时使用多个 Plugin 和 Preset，此时，它们的执行顺序非常重要。

* 先执行完所有 Plugin，再执行 Preset。
* 多个 Plugin，按照声明顺序依次执行。
* 多个 Preset，按照声明顺序逆序执行。

