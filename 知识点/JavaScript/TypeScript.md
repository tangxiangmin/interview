TypeScript
===
> 有在项目中使用ts的经验吗？为什么要选择ts，它有哪些优势？

参考
* [官方手册指南](https://www.tslang.cn/docs/handbook/basic-types.html)


## 基础语法

类型注解，TypeScript里的类型注解是一种轻量级的为函数或变量添加约束的方式。

格式
```
variableName: variableType
```
### 基础类型
* boolean
* number
* string
* 数组：
    * 基础类型+[]，例如number[]
    * 数组泛型，例如Array<number>
* 元组,[string, number]，需要保证对应位置的元素类型保持一致
* enum
* any
* void，表示没有任何类型，通常声明函数没有任何返回值
* null
* undefined
* never

类型断言，可以理解为强制类型转换
```
let someValue: any = "this is a string";
let strLength: number = (<string>someValue).length;

let strLength2: number = (someValue as string).length;
```

### 接口
> TypeScript的核心原则之一是对值所具有的结构进行类型检查

传入的对象参数实际上会包含很多属性，但是编译器只会检查那些必需的属性是否存在，并且其类型是否匹配


```
// 接口
interface LabelledValue {
  label: string;
}

// 可选属性
interface SquareConfig {
  color?: string;
  width?: number;
}

// 只读属性
interface Point {
    readonly x: number;
    readonly y: number;
}

// 为参数添加其他字段索引值
interface SquareConfig {
    color?: string;
    width?: number;
    [propName: string]: any;
}

```
可选属性的好处
* 可以对可能存在的属性进行预定义
* 可以捕获引用了不存在的属性时的错误


## 为什么要选择TypeScript
与JavaScript相比，TS具备下面的一些优势

* 静态输入，可以让开发人员在编写脚本时就检测到错误，提高代码的健壮性
* 类型本身就可以当做注释使用，强类型使得代码重构更为清晰
* 类型安全为开发团队创建了一个更高效的编码和调试过程，方便团队协作开发

就我自身的观点来看，
* 基于类型检测和语法提示，使用TS编码时IDE和编辑器的提示更加完备
* 能够强迫自己进行先设计代码，再实现代码的思考流程
