### 数据类型

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

#### 3. constructor

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

### 继承

#### 原型继承

```js
function Father(name){								优点: 
  this.name = name												1.继承了父类的模板，又继承了父类的原型对象
}
Father.prototype.getName() = function(){
  console.log(this.name)
}
function Son(name){										缺点:  
	this.sex = 'boy'												1.无法实现多继承（prototype已经被确定了，属性会互相影响）
}                                        2.无法向父类传参
Son.prototype = new Fater()
```

#### 构造继承

```js
function Father(name){								优点: 
	this.name = name													1.可以实现多继承，子类改父类属性时不会互相影响
}
Father.prototype.getName = function () {
  console.log(this.name)
}
function Son(name){										缺点:  
	this.sex = 'boy'													1.无法使用父类原型上的方法，只能使用实例方法		
  this.name = 'ming'			  								2.在instanceof时，xxx instanceof Father===false
  Father.call(this,name) //顺序会覆盖
}
```

#### 组合继承

```js
function Parent (name) {                优点：
  this.name = name                          1.可以使用实例和原型上的方法，可传参
}
Parent.prototype.getName = function () {
  console.log(this.name)                缺点：
}                                          1.创建两个父类实例
function Child (name) {
  this.sex = 'boy'
  Parent.call(this, name)
}
Child.prototype = new Parent()
Child.prototype.getSex = function () {
  console.log(this.sex)
}
```

#### 寄生组合式继承(Object.create)

> `Object.create(proto, propertiesObject)`
>
> - 参数一，需要指定的原型对象
> - 参数二，可选参数，给新对象自身添加新属性以及描述器
>
> 可以指定新建对象的`__proto__`

```js
function Parent (name) {
  this.name = name
}            
Parent.prototype.getName = function () {     优点：
  console.log(this.name)                        1.只创建一次父类实例，可以用到父类原型和属性方法
}                                               2.能够正常使用instanceof和isPrototypeOf
function Child (name) {
  this.sex = 'boy'
  Parent.call(this, name)
}
// 与组合继承的区别
Child.prototype = Object.create(Parent.prototype)

var child1 = new Child('child1')
```

#### class

> ***原理等于寄生组合式继承***

##### extend

- `class`可以通过`extends`关键字实现继承父类的所有属性和方法

- 若是使用了`extends`实现继承的子类内部没有`constructor`方法，则会被默认添加`constructor`和`super`

  > - 可以继承构造函数`Parent`
  > - 不存在任何继承，就是一个普通的函数，所以直接继承`Function.prototype`
  > - 可以继承原生构造函数

##### super

+ super()返回的是子类实例—`this`,如果在constructor中要使用this，必须先调用super()
+ 在子类的普通函数中`super`对象指向父类的原型对象
+ 在子类的静态方法中`super`对象指向父类

##### es5和es6继承对比

>1. 在`ES5`中的继承(例如**构造继承、寄生组合继承**) ，实质上是先创造子类的实例对象`this`，然后再将父类的属性和方法添加到`this`上(使用的是`Parent.call(this)`)。
>
>2. 而在`ES6`中却不是这样的，它实质是**先创造父类的实例对象`this`(也就是使用`super()`)，然后再用子类的构造函数去修改`this`**。

### 隐式转换

> 在使用==时，JS会自动将两边的数据类型进行转换，再比较

规则：会尽量将数据类型变为number

1. Object -> String -> Number
2. Boolean -> Number

> JS中每个值都自带一个ToPrimitive方法`ToPrimitive(obj,type)`
>
> 1. 当期望`type`为`number`时，会先调用valueOf方法获取原始值，如没有调用`toString`方法，如没有抛出异常
> 2. 当期望`type`为`string`时，会先调用`toString`方法获取原始值，如没有调用`valueOf`方法，如没有抛出异常

### 深拷贝与浅拷贝

1. 浅拷贝属于两个变量指向同一个堆中的地址，当修改其中一个时，另一个也会改变（基本数据类型不影响，只有引用类型才会一起改变）

   + Object.assign()
   + 扩展运算符[...Array]
   + concat()

   > 浅拷贝与直接赋值的区别：
   >
   > + 直接赋值属于两个地址完全相同，当改变基本数据类型时，也会改变
   > + 浅拷贝在复制基本数据类型时，会开辟新的栈空间，不会受到影响

2. 深拷贝利用基本数据类型不会被影响的特点，循环遍历，将每一层都进行拷贝

   + Json.parse(Json.stringfy())

     ***不能拷贝`函数`、`undefind`、`null`***

   ```js
   function deepClone(obj, hash = new WeakMap()) {
     if (obj === null) return obj; // 如果是null或者undefined我就不进行拷贝操作
     if (obj instanceof Date) return new Date(obj);
     if (obj instanceof RegExp) return new RegExp(obj);
     // 可能是对象或者普通的值  如果是函数的话是不需要深拷贝
     if (typeof obj !== "object") return obj;
     // 是对象的话就要进行深拷贝
     if (hash.get(obj)) return hash.get(obj);
     let cloneObj = new obj.constructor();
     // 找到的是所属类原型上的constructor,而原型上的 constructor指向的是当前类本身
     hash.set(obj, cloneObj);
     for (let key in obj) {
       if (obj.hasOwnProperty(key)) {
         // 实现一个递归拷贝
         cloneObj[key] = deepClone(obj[key], hash);
       }
     }
     return cloneObj;
   }
   let obj = { name: 1, address: { x: 100 } };
   obj.o = obj; // 对象存在循环引用的情况
   let d = deepClone(obj);
   obj.address.x = 200;
   console.log(d);
   ```

### json.stringfy()

1. 使用:**JSON.stringify(value [, replacer [, space]]).  ** 		 ***仅会转换可枚举属性***

> + value：序列化的值
>
> + replacer：
>   + 函数：序列化数据处理
>   + 数组：只有数组中内容才可序列化
>   + null：全部都可序列化
>
> + space：美化空格

```js
const obj = {name:'mingming',age:18,sex:'man'}
console.log(JSON.stringify(obj, ['name'], 2))   //  {"name": "mingming"}
```

2. 特性            ***循环引用，bigInt会报错***
   + 函数，undefined，symbol为值

   > `value`为对象时会被忽略，为数组时会转为null，单独时会转为undefined

   + sysbol属性为键会被忽略

   + 对象中有toJson方法会直接转换方法的返回值

   ```js
   const toJSONObj = {
     name: 'ming',
     toJSON () {
       return 'JSON.stringify'
     }
   }
   console.log(JSON.stringify(toJSONObj))   // "JSON.stringify"
   ```

3. 

