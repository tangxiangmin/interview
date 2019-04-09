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