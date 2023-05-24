## rollup

可以参考各个组件库的打包方式

* [rollup官方文档](https://www.rollupjs.com/)

* [Webpack 和 Rollup ：一样但又不同](https://www.html.cn/archives/7703)

> rollup和webpack有什么区别？他们打包出来的代码有什么区别？package.json中pkg.module的作用？

需要遵循的原则：**对于应用使用 webpack或vite，对于类库使用 Rollup**。

### 外部模块

参考:[Rollup 与其他工具集成](https://www.rollupjs.com/guide/tools)

开发的模块很可能依赖外部模块，可以通过`@rollup/plugin-node-resolve`告诉rollup如何查找外部模块

npm中大多数包都是CommonJS模块，可以通过`@rollup/plugin-commonjs`将CommonJS模块转换成ES6模块

### 打包React组件

```
yarn add @rollup/plugin-babel @babel/preset-react
```

```js
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
export default {
    // 其他省略
    plugins: [
        resolve(),
        babel({
            exclude: "**/node_modules/**",
            presets: ['@babel/preset-react']
        }),
        commonjs(),
    ],
};
```

### 打包Vue组件

```
yarn add rollup-plugin-vue @vue/compiler-sfc 
```

```js
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import vue from "rollup-plugin-vue";

export default {
    plugins: [
        resolve(),
        babel({
            exclude: "**/node_modules/**",
        }),
        vue({
            css: true,
            compileTemplate: true,
        }),
        commonjs(),
    ],
};
```

### 一些问题

> 发布到npm的包需要编译或压缩吗？

不打包的话，可能会提高使用门槛，同时降低打包编译速度；但交给用户自己的生成工具打包，定制性更强，打包出来的代码更小。

[相关讨论](https://zhuanlan.zhihu.com/p/54255260)，引申出UI框架提供的按需加载 插件


如果发布的是es6模块的话，建议配置`pkg.module`字段

> 如何不将第三库的包打入文件？

配置`external`，还可以根据`globals`搭配使用
