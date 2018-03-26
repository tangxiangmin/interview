JS基础面试题目
===


### 下面代码输出
```js
var foo = {n: 1}
var bar = foo;
foo.x = foo = {n:2};

foo.x; // undefined
```
主要是由于虽然赋值运算符具有右结合性，然而它首先做的是得到表达式foo.x的值，因此后执行foo = {n:2}导致foo被重写，打印bar.x可以得到预期结果

### 下面代码输出
```js
window.a = 1;
var json = {
  a: 10,
  db: function(){
    this.a *= 2;
  }
}

json.db();
var db = json.db;
db();
json.db.call(window);

alert(window.a + json.a); // 24
```
简单考察了一下this的指向

### 下面代码输出
```js
function func1(){
	var n = 99;

    nAdd = function(){
        this.n += 1;
        console.log(this.n);
    }

    function func2(){
        console.log(n);
    }

    return func2;
}

var res = func1();

res(); // 99
nAdd(); // NAN
res(); // 99
```

### 下面代码输出
```
var obj = {
    name: "obj",
    dose: function(){
        this.name = "dose";
        return function(){
        	return this.name;
        }
    }
}

	console.log(obj.dose().call(this));  // 注意是""而不是undefined，这是因为window对象本身就有一个name属性...
```

### 代码输出
```
var k = c = 5;
function a(n){
    return n ? (n-1)*a(n-1): n;
    k++;
    c++;
    if(c > 10) return c;
}

var res = a(5);
console.log(k, c, res); // 5, 5, 0 这个题简直太渣了
```

## 综合题
考察了变量作用域，声明提前，运算符优先级等问题。
```
function Foo() {
    getName = function() {
        alert(1);
    };

    return this;
}
Foo.getName = function() {
    alert(2);
};
Foo.prototype.getName = function() {
    alert(3);
};
var getName = function() {
    alert(4);
};

function getName() {
    alert(5);
}

//请写出以下输出结果：
Foo.getName(); // 2
getName(); // 4
Foo().getName(); // 1
getName(); // 1
new (Foo.getName)(); // 2
new Foo().getName(); // 3
new ((new Foo()).getName)(); // 3
```

## 变量提升
```
console.log(a); // function

a(); // 10

var a=3;

function a(){

    console.log(10)
}   

console.log(a); // 3

a=6;

a(); // error
```

## event-loop执行顺序
```
setImmediate(function(){
    console.log(1);
},0);
setTimeout(function(){
    console.log(2);
},0);
new Promise(function(resolve){
    console.log(3);
    resolve();
    console.log(4);
}).then(function(){
    console.log(5);
});
console.log(6);
process.nextTick(function(){
    console.log(7);
});
console.log(8);
```

## 代码输出
```js
var obj1 = {
    name: "obj1",
    fn(){
        console.log(this.name);
    }
};
var obj2 = { name: "obj2" };
var obj3 = { name: "obj3" };
obj1.fn(); // obj1
var newFn = obj1.fn;
newFn(); // "" 注意这里不是undefined
newFn.call(obj2); // obj2
obj3.fn = newFn;
obj3.fn(); // obj3

var newFn = obj1.fn.bind(obj1);
newFn(); // obj1
newFn.call(obj2); // obj1，注意这个地方是强绑定，所以一直为obj1
obj3.fn = newFn;
obj3.fn(); // obj1 ，同上
```


## 代码输出
```javascript
	var a = 100;
    var fn = () => {
        console.log(a);
        var a = 200;
        console.log(a);
    }
    fn(); // undefined, 200
    console.log(a); // 100
    var a;
    console.log(a); // 100
    var a = 300;
    console.log(a); // 300
```