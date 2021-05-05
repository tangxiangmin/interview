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
    * `基础类型+[]`，例如`number[]`
    * 数组泛型，例如`Array<number>`
* 元组,`[string, number]`，需要保证对应位置的元素类型保持一致
* enum
* any
* void，表示没有任何类型，通常声明函数没有任何返回值
* null
* undefined
* never

类型断言，可以理解为强制类型转换
```ts
let someValue: any = "this is a string";
let strLength: number = (<string>someValue).length;

let strLength2: number = (someValue as string).length;
```

### 接口
> TypeScript的核心原则之一是对值所具有的结构进行类型检查

传入的对象参数实际上会包含很多属性，但是编译器只会检查那些必需的属性是否存在，并且其类型是否匹配


```ts
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

### 类型定义文件
参考
* [类型定义文件(*.d.ts)](https://blog.csdn.net/u013451157/article/details/79896290)

`*.d.ts`让现有的 JS 库也能定义静态类型，DefinitelyTyped 就是让你把 “类型定义文件(*.d.ts)”，发布到 npm 中，配合编辑器(或插件)，就能够检测到 JS 库中的静态类型。

## 泛型 

泛型的本质是为了参数化类型（在不创建新的类型的情况下，通过泛型指定的不同类型来控制形参具体限制的类型）。也就是说在泛型使用过程中，操作的数据类型被指定为一个参数，这种参数类型可以用在类、接口和方法中，分别被称为泛型类、泛型接口、泛型方法

> 泛型在c++里又叫模板。

为了考虑方法的重用性，要求方法不仅能够支持当前的数据类型，同时也能支持未来的数据类型
```ts
// T帮助我们捕获用户传入的类型,之后我们再次使用了 T当做返回值类型
function identity<T>(arg: T): T {
    return arg;
}
```

泛型类和泛型方法的概念基本相同。

泛型约束允许我们对传入的类型进行一些约束，比如要求传入的类型必须带上某个特定的属性或方法等
```ts
interface Lengthwise {
    length: number;
}
function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);  // Now we know it has a .length property, so no more error
    return arg;
}
```

## 为什么要选择TypeScript
与JavaScript相比，TS具备下面的一些优势

* 静态输入，可以让开发人员在编写脚本时就检测到错误，提高代码的健壮性
* 类型本身就可以当做注释使用，强类型使得代码重构更为清晰
* 类型安全为开发团队创建了一个更高效的编码和调试过程，方便团队协作开发

就我自身的观点来看，
* 基于类型检测和语法提示，使用TS编码时IDE和编辑器的提示更加完备
* 能够强迫自己进行先设计代码，再实现代码的思考流程



