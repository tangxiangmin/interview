貌似公司是做BI大数据的

## 线上笔试
先线上做了一套题，用的[百一测评](https://www.101test.com/)，

之前没有做过这种在线测试的，大部分都是写代码，那个线上编辑器有点问题，我怀疑代码都没有运行成功，得分该不会是0吧哈哈

### JS实现继承

**ES6**

题目要求使用ES 6，且需要实现父类的私有方法

封装父类的私有方法，大致思路是在父类的方法中调用局部函数，通过call或者apply显示绑定到this。这样子类就不会知道你都在类内部使用过哪些私有方法
```js
function my_fun(options) {
  this.render()
}

export default class MyClass {
    render() {}
    test() {
      my_fun.apply(this, 'options')
    }
}
```

下面是一些常见的实现继承的方式，工作中用的比较多的实际上就是`Object.create()`了

**通过原型链实现**

基本思路是:利用原型让一个引用类型继承另外一个引用类型的属性和方法。
```js
function Parent(name){
    this.name = name
}
Parent.prototype.cb = function(){
    console.log(this.name)
}

function Child(age) {
    this.age = age
}
Child.prototype = new Parent('shymean')
```
存在的问题是子类的原型对象是父类的实例，其值在实例化时已经固定了，如果父类存在引用数据类型，则导致子类所有实例共享一个数据对象

**借用构造函数继承**

在子类型构造函数的内部调用超类构造函数，通过使用call()和apply()方法可以在新创建的对象上执行构造函数。

```js
function f() {
    this.firends = ["Jack", "Rose"];
}
f.prototype.say = function() {
    console.log(this.firends);
};

function s() {
    f.apply(this, arguments);
}
```
这个例子中，子类的实例访问到的firends不受影响

**组合继承**

将原型链和借用构造函数的技术组合在一块，从而发挥两者之长的一种继承模式

**原型式继承**
通过`Object.create`方法，借助原型可以基于已有的对象创建新对象，同时还不必须因此创建自定义的类型。





### 编写以一个函数，实现不定参数的求和，需过滤非number类型的参数

我觉得那个在线编辑器真的有问题，运行不成功，不知道是不是不兼容ES6语法
```js
function isNumber(num){
    return typeof num === 'number'
}

function totalSum(...args) {
    console.log(args);
    return args.reduce((acc, item)=>{
        if(isNumber(item)){
            acc += item
        }

        return acc
    }, 0)
}
```

### 日期处理函数
给定一组`yyyy-mm-dd HH:mm:ss`形式的日期参数，按照一定周期递增，求周期， 输出格式为`x hours x minutes x second`

思路是将日期转换成时间戳，然后求出时间间隔，再进行格式化即可。
题目给定的日期格式好像不是这个，忘记了，总之感觉思路没问题，最多再对参数进行一次格式化

```
let arr = ["2018-10-24 12:00:00", "2018-10-24 13:10:03"];

function getDuration(n1, n2) {
    let time_1 = new Date(n1).getTime(),
        time_2 = new Date(n2).getTime();

    return Math.floor((time_2 - time_1) / 1000);
}

function formatDuration(time) {
    let hour = Math.floor(time / 3600),
        min = Math.floor((time - hour * 3600) / 60);
    sec = time % 60;

    return `${hour}hour${min}minutes${sec}second`;
}

function calcPeriod(arr) {
    let duration = getDuration(arr[0], arr[1]);

    return formatDuration(duration);
}

let res = calcPeriod(arr);
console.log(res)

```


### 网格地图走法

一个网格地图，左下角是A,右上角是B，只可以向上或者向右走，从A点到B点
* 一个`日`字形，col为1，row为2，返回3
* 一个`田`字形，col为2，row为2，返回6

给定col和row，求A到B有多少种走法。

这道题没做出来，后来查资料才了解到其实是一个组合问题。对方向编号，向上是0，向右是1，那么从左下角走到右上角一定要经过M 个1和N个0。这个题目可以转化为从M+N个盒子中挑出M个盒子有多少种方法。

就是C(M+N, M), 或者C(M+N, N).

```js
function factorial(n) {
    if (n > 1) {
        return n * factorial(n - 1);
    }

    return 1;
}

function C(n, m) {
    return factorial(n) / (factorial(m) * factorial(n - m));
}

function countRoute(row, col) {
    return C(row + col, col);
}

console.log(countRoute(1, 2)); // 3
console.log(countRoute(2, 2)); // 6
```


### 判断一个sql语句是否可以使用limit 子句，需考虑子查询的情形
思路：只需要考虑最外部select语句是否包含limit ，子查询语句可忽略，

```js
var cases = [
    "select * from table limit 1", // false
    "select * from table", // true
    "select * from (select * from sub_table limit 1) sub_select", // true
];

function checkLimit(cases) {
    let limitRe = /limit \d+/,
        bracketRe = /\([^\)]*\)/g

    return cases.map(item => {

        item = item.replace(bracketRe, "");
        console.log(item)
        return !limitRe.test(item);
    });
}

let res = checkLimit(cases)
console.log(res)
```

### 实现字符串函数的format函数，考点是replace传回调函数
```js
let str = "Hello JS";

// str = str.replace("JS", "PHP");
// 第一个参数是匹配结果，后面参数是捕获到的分组
str = str.replace(/(J)S/, (word, $1, $2)=>{
    console.log(word);
    console.log($1)
    return 'PHP'
})
console.log(str)
```

### flex布局,每一行尽可能拜访多个cell，每个间隔20px，剩余孔隙两边均分
```html
<style>
    .wrap {

        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap
    }
    .cell {
        margin: 10px;
        width: 100px;
        height: 100px;
        background-color: red
    }
</style>

<body>
    <div class="wrap">
        <div class="cell"></div>
        <div class="cell"></div>
        <div class="cell"></div>
        <div class="cell"></div>
        <div class="cell"></div>
        <div class="cell"></div>
        <div class="cell"></div>
        <div class="cell"></div>
        <div class="cell"></div>
        <div class="cell"></div>
    </div>
</body>
```


### 给定一个字符数组和一个排序规则
返回满足规则的组合，规则`A->C`表示C在A右侧
```
let arr = ["A", "B", "C"],
    rules = ["A->C", "B->C"];
    
// 返回结果ABC BAC

```

思路：解析规则，从右到左先将确定的顺序排好，剩下左边的字符进行组合
```js
function parseRule(rule) {
    return rule.split("->");
}

function findRightLetter(rules) {
    let right = rules[0][1];

    let leftRules = []
    rules.forEach(item => {
        if (right == item[0]) {
            right = item[1];
        }else {
            leftRules.push(item)
        }
    });

    return { right, leftRules };
}

function sortByRule(arr, rules) {
    rules = rules.map(item => {
        return parseRule(item);
    });

    let { right, leftRules } = findRightLetter(rules);
    console.log(right);
    console.log(leftRules);
}

sortByRule(arr, rules)
```

### 给定一个字符数组
每个元素的综合得分由索引分和一个权重分数组组成，返回综合分前5的字符
```js
let arr = ["A", "B", "C", "D", "E", "F", "G"],
    weight = [3, 1, 5, 2, 1, 4, 2];

function sortByScore(arr, weight) {
    let totalScore = arr.map((item, index)=>{
        let indexScore = index + 1,
            weightScore = weight[index]
        let score = indexScore + weightScore
        return {
            score,
            val: item
        }
    })

    totalScore.sort((a, b)=>{
        return b.score - a.score
    })

    return totalScore.map(item=>{
        return item.val
    }).slice(0, 5)
}
var res = sortByScore(arr, weight)
console.log(res)

```

### 传统的九键键盘，输入两个数字，返回可能的字符组合
思路：保存每个按键对应的字符列表，进行排列组合即可
```js
function num2letter(n){
    const hash = {
        1: ' ',
        2: 'abc',
        3: 'def',
        4: 'ghi',
        5: 'jkl',
        6: 'mno',
        7: 'pqrs',
        8: 'tuv',
        9: 'wxyz'
    }

    return hash[n] || ''
}

function nineKeyboards(n1, n2){
    let letter_1 = num2letter(n1),
        letter_2 = num2letter(n2)

    let res = []
    for(let i = 0; i < letter_1.length; ++i){
        for(let j = 0; j < letter_2.length; ++j){
            let str = letter_1[i] + letter_2[j]
            res.push(str)
        }
    }
    return res
}

var res = nineKeyboards(2, 3)
console.log(res)
```

### 给定一个字符串，判断类型
规则如下
* true和false，不区分大小写，Boolean
* yyyymmdd 和yyyymmdd HH:mm:ii字符串，Date
* 数字、小数和科学记数法，Number，
* 其他，String

主要是考察正则的，发现这套笔试题里面考正则的地方不少啊
```js
function parseType(str) {
    let boolRe = /^(true|false)$/i,
        dateRe = /^\d{4}(0[1-9]|1[0-2])\d{2}$/, // 闰年、月份、日期都需要考虑，这里还是有点繁琐的，没写全
        numRe = /^-?\d+(\.\d+)?(e\d+)?$/ // 负数、小数、科学记数法

    if(boolRe.test(str)){
        return 'Boolean'
    }else if(dateRe.test(str)){
        return 'Date'
    }else if(numRe.test(str)){
        return 'Number'
    }else {
        return 'String'
    }
}
```