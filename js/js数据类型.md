## 数据类型

> 基本数据类型：string，number，boolean，undefined，null，symbol，bigInt
>
> 引用数据类型：object（Date，Array，Function...）

### 区别

> 基本数据类型存在栈中，引用数据类型存在堆中，在栈中存储堆中的地址

### 类型检查

#### 1. typeof  

可以用来判断基本数据类型，数组、对象、null都会被显示为`object`

> ***typeof会去检查机器码后三位，null的机器码全是0，object的机器码后三位为000，***
>
> ***所以`typeof null === object`***

```js
console.log(typeof 2);               // number
console.log(typeof true);            // boolean
console.log(typeof 'str');           // string
console.log(typeof []);              // object    
console.log(typeof function(){});    // function
console.log(typeof {});              // object
console.log(typeof undefined);       // undefined
console.log(typeof null);            // object

3. constructor

4. Object.prototype.call()
```

#### 2. instanceof

> 可以用来判断引用数据类型，原理是判断构造函数的prototype是否在对象的原型链上

```js
console.log(2 instanceof Number);                    // false
console.log(true instanceof Boolean);                // false 
console.log('str' instanceof String);                // false 
console.log([] instanceof Array);                    // true
console.log(function(){} instanceof Function);       // true
console.log({} instanceof Object);                   // true
```

#### 3.constructor

> 判断实例的构造函数是不是该函数

```js
console.log((2).constructor === Number); // true
console.log((true).constructor === Boolean); // true
console.log(('str').constructor === String); // true
console.log(([]).constructor === Array); // true
console.log((function() {}).constructor === Function); // true
console.log(({}).constructor === Object); // true
```

#### 4.Object.prototype.toString.call()

> 因为其他类型改写了toString方法，所以需要调用最原始的toString方法

```js
var a = Object.prototype.toString;
 
console.log(a.call(2));  					// [object Number]
console.log(a.call(true));				// [object Boolean]
console.log(a.call('str'));				// [object String]
console.log(a.call([]));					// [object Array]
console.log(a.call(function(){}));// [object Function]
console.log(a.call({}));					// [object Object]
console.log(a.call(undefined)); 	// [object Undefined]
console.log(a.call(null)); 				// [object Null]
```

### 数组类型检查

```js
//Array.isArray()
Array.isArray([1])

//instanceof
[1] instanceof Array

// 原型链
[1].__proto__ === Array.prototype;
[1].constructor === Array

// Object.prototype.toString.call()
Object.prototype.toString.call(obj).slice(8,-1) === 'Array';

//Array.prototype.isPrototypeOf()
Array.prototype.isPrototypeOf([1])
```

### isNaN和Number.isNaN对比

> isNaN会先尝试将传入数据转成Number类型
>
> Number.isNaN不会进行类型转换，会先判断传入数据是否为Number类型

### 原型链

> 实例的`__proto__`	===	构造函数的`prototype`
>
> 实例的`__proto__`.`constructor`	===	构造函数

**当调用实例上没有的方法时，会顺着原型链逐级向上查找，直到找到`Object.prototype.__proto__`(等于 null),如果还没有，返回undefined**

### new

1. 创建一个新的对象
2. 将新对象的原型指向构造函数的`prototype`
3. 将构造函数的`this`指向新对象，并执行
4. 判断返回值，如果为引用数据类型，返回引用类型对象

```js
function myNew(){
    const constructor = Array.prototype.shift(arguments)
    const newObj = Object.create(constructor.prototype)
    const result = constructor.call(newObj,arguments)
    const flag = result && 
          (typeof result === 'object' ||typeof result === 'function')
    return flag ? result : newObj
}
myNew(构造函数, 初始化参数);
```

### extend

### 隐式转换

> 在使用==时，JS会自动将两边的数据类型进行转换，再比较

规则：会尽量将数据类型变为number

1. Object -> String -> Number
2. Boolean -> Number

> JS中每个值都自带一个toPrimitive方法`ToPrimitive(obj,type)`
>
> 1. 当期望`type`为`number`时，会先调用valueOf方法获取原始值，如没有调用`toString`方法，如没有抛出异常
> 2. 当期望`type`为`string`时，会先调用`toString`方法获取原始值，如没有调用`valueOf`方法，如没有抛出异常

