## JS基础

> 基本数据类型：string，number，boolean，undefined，null，symbol，bigInt
>
> 引用数据类型：object（Date，Array，Function...）

### symbol



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

#### class(es6)

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
2. Boolean -> Number      ***`undefined 、null 、NaN 、''、0会被转成false`***

> JS中每个值都自带一个ToPrimitive方法`ToPrimitive(obj,type)`
>
> 1. 当期望`type`为`number`时，会先调用`valueOf`方法获取原始值—>如没有调用`toString`方法—>如没有抛出异常
> 2. 当期望`type`为`string`时，会先调用`toString`方法获取原始值—>如没有调用`valueOf`方法—>如没有抛出异常

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


### 执行上下文

#### 执行上下文栈

+ 当程序运行时，会将全局执行上下文压入栈底
+ 当函数执行时，会将函数执行上下文压入栈中，执行完毕再弹出栈

#### 执行上下文

##### 种类

> + 全局执行上下文 — 程序运行时创建，泛指window
> + 函数执行上下文 — 函数执行时创建
> + eval执行上下文 — eval执行代码时创建

##### es3

+ 变量对象 — 用来存储上下文中的变量和函数声明

  + 全局上下文中，变量对象就是全局对象，window
  + 函数上下文中，变量对象 又称 活动对象，包括 参数，函数声明，变量声明

+ 作用域链 — 由自身的变量对象和所有父级的变量对象组成

  + 在查找属性时，如当前作用域没有，会沿着作用域链逐级向上查找，直到window对象

+ this - 当函数调用时确定，指向调用者，严格模式下，指向 window 为 undefined

+ 流程

  + 创建阶段
    + `生成变量对象`
      + 生成arguments对象，生成对应的参数名和值
      + 函数提升 — 扫描所有函数声明，存入变量对象中，如有重复名，覆盖
      + 变量提升 — 扫描所有变量声明，存入变量对象中，如有重复，忽略
    + `生成作用域链` — 将自身所有的父级变量对象放到[[scope]]属性中
    + `确定this指向`
  + 执行阶段
    + 变量赋值
    + 将自身的变量对象放到作用域的最前端
    + 按行执行 — 如入其他函数调用，则在执行栈中压入新的上下文

  + 销毁阶段
    + 被弹出执行上下文，等待系统回收

  ```js
  function person(age) {
    console.log(typeof name); // function
    console.log(typeof getName); // undefined
    var name = 'abby';
    var hobby = 'game';
    var getName = function getName() {
      return 'Lucky';
    };
    function name() {
      return 'Abby';
    }
    function getAge() {
      return age;
    }
    console.log(typeof name); // string
    console.log(typeof getName); // function
    name = function () {};
    console.log(typeof name); // function
  }
  person(20);
  ```

##### es5

> 除去了es3的活动对象和变量对象的概念，改为`变量环境`和`词法环境`

+ 词法环境 

  > 词法环境分为 `全局环境` 和 `函数环境`
  >
  > `全局环境`的外部引用为null，`函数环境`的环境记录器包括arguments

  + 环境记录器 — 存储变量和函数声明
  + 外部环境的引用 — 指向作用域链的下一个对象（父级词法环境）

+ 变量环境 — 属于一种词法环境，区别为***词法环境存储 `let` `const`，变量环境存储 `var`***

过程总结

1. **创建阶段** 首先创建全局上下文的词法环境：首先创建 `对象环境记录器`，接着创建他的外部环境引用 `outer`，值为 null
2. 创建全局上下文的变量环境：过程同上
3. 确定 this 值为全局对象（以浏览器为例，就是 window ）
4. 函数被调用，创建函数上下文的词法环境：首先创建 `声明式环境记录器`，接着创建他的外部环境引用 `outer`，值为全局对象，或者为父级词法环境
5. 创建函数上下文的变量环境：过程同上
6. 确定 this 值
7. 进入函数执行上下文的 **执行阶段**
8. 执行完成后进入 **回收阶段

> 如父级词法环境没找到，会自动查找变量环境

#### this指向

> this永远指向最后调用它的对象

this的几种情况：

1. 普通函数 — 指向调用它的函数
2. 箭头函数 — 定义时确认，上级作用域中的this
3. 构造函数 — this指向实例
4. call、apply、bind — this指向第一个参数

### 闭包

> 有权访问另一个函数作用域中变量的函数
>
> 常见形式：函数内部有变量和函数，内部函数中使用了外部的变量

应用：

+ 防抖
+ 计数器

缺点：内存泄漏

### Event Loop

+ JS有一个执行栈，当函数被调用时，会将函数上下文压入栈中，完成后弹出
+ JS将所有执行任务分为 `同步任务` 和 `异步任务`
  + 同步任务会按照调用顺序执行
  + **异步任务首先会被压入栈中，将其回调任务放到`任务队列`，再弹出栈**，在执行栈中为空时，会去任务队列中取已完成的任务，压入栈中执行
+ 异步任务分为`宏任务`和`微任务`，任务队列也分为`宏任务队列`和`微任务队列`
  + JS会借助浏览器的线程，当异步任务有结果后，浏览器的线程会将对应的时间推到对应的队列中
  + 当执行栈为空时，会先检查微任务队列，**执行完所有的微任务，之后去执行宏任务**，之后再检查微任务队列，直到所有任务执行完毕（script算宏任务，所以第一个执行的任务时宏任务）

### 创建对象的方式

1. new Object

   ```js
   const obj = new Object()
   obj.name = 'ming'
   ```

2. 字面量

   ```js
   const obj = {name: 'ming'}
   ```

3. 工厂函数

   ```js
   function createObj(name) {
     const obj = new Object()
     obj.name = name
     return obj
   }
   const obj = createObj('ming')
   ```

4. 构造函数

   ```js
   function Person(name) {
     this.name = name
   }
   const person = new Person('Sunshine_Lin')
   ```

### JS事件/DOM时间流

DOM时间流分为三个阶段：`事件捕获` —> `目标阶段`—>  `事件冒泡`

> 从文档根节点document出发，向目标节点流去，依次执行对应事件,到达目标节点后执行目标事件，再向根节点流去，依次执行对应事件

#### 事件类型

1. HTML事件

```html
<!-- Chrome 输出 click -->
<script>
    function showMessage(event) {
        console.log(event.type);
    }
</script>
<input type="button" value="Click Me" onclick="showMessage(event)">
```

2. DOM 0事件 — 冒泡阶段才会被处理，删除直接赋为`null`即可

```js
var btn=document.getElementById("btn");
btn.onclick=function(){
  console.log(this.id); // 输出 btn
}
```

3. DOM 2事件 — `addEventListener` 和 `removeEventListener`

```js
var btn=document.getElementById("btn");
var handler = function(){
  console.log(this.id);
}
btn.addEventListener("click", handler, false);
btn.removeEventListener("click",handler, false);
```

#### event对象

1. target — 事件触发的节点
2. currentTarget — 事件绑定的节点
3. preventDefault — 阻止事件默认行为
4. stopPropagation — 阻止事件继续传递

#### 事件代理

```js
<ul id="myLinks">
    <li id="goSomewhere">Go somewhere</li>
    <li id="doSomething">Do something</li>
    <li id="sayHi">Say hi</li>
</ul>
<script>
    var list = document.getElementById("myLinks");
    EVentUtil.addHandler (list, "click", function (event) {
        event = EVentUtil.getEvent(event);
        var target = EVentUtil.gitTarget(event);

        switch(target.id) {
            case "doSomething":
                document.title = "I changed the document's title";
                break;
            case "goSomewhere":
                location.href = "https://heycoder.cn/";
                break;
            case "sayHi":
                console.log("hi");
                break;
        }
    })
</script>
```

#### load 与 DOMContentLoaded

1. DOMContentLoaded — `文档解析完成` 以及 `内链外链JS` 执行完毕，触发事件
2. load — 文档内所有内容加载完毕，触发事件

## es6+

### call、apply、bind

> 都是改变this指向，call和apply是立即执行，返回函数的结果，bind是返回函数的复制

1. call — 分开传入参数

```js
Function.prototype.myCall = function (context, ...arr) {
    if (context === null || context === undefined) {
       // 指定为 null 和 undefined 的 this 值会自动指向全局对象(浏览器中为window)
        context = window 
    } else {
        context = Object(context) //值为原始值（数字，字符串，布尔值）的 this 会指向该原始值的实例对象
    }
    const specialPrototype = Symbol('特殊属性Symbol') // 用于临时储存函数
    context[specialPrototype] = this; // 函数的this指向隐式绑定到context上
    let result = context[specialPrototype](...arr); // 通过隐式绑定执行函数并传递参数
    delete context[specialPrototype]; // 删除上下文对象的属性
    return result; // 返回函数执行结果
};
```

2. apply — 传数组

```js
Function.prototype.myApply = function (context) {
    if (context === null || context === undefined) {
        context = window 
      // 指定为 null 和 undefined 的 this 值会自动指向全局对象(浏览器中为window)
    } else {
        context = Object(context) //值为原始值（数字，字符串，布尔值）的 this 会指向该原始值的实例对象
    }
    // JavaScript权威指南判断是否为类数组对象
    function isArrayLike(o) {
        if (o &&                                    // o不是null、undefined等
            typeof o === 'object' &&                // o是对象
            isFinite(o.length) &&                   // o.length是有限数值
            o.length >= 0 &&                        // o.length为非负值
            o.length === Math.floor(o.length) &&    // o.length是整数
            o.length < 4294967296)                  // o.length < 2^32
            return true
        else
            return false
    }
    const specialPrototype = Symbol('特殊属性Symbol') // 用于临时储存函数
    context[specialPrototype] = this; // 隐式绑定this指向到context上
    let args = arguments[1]; // 获取参数数组
    let result
    // 处理传进来的第二个参数
    if (args) {
        // 是否传递第二个参数
        if (!Array.isArray(args) && !isArrayLike(args)) {
            throw new TypeError('myApply 第二个参数不为数组并且不为类数组对象抛出错误');
        } else {
            args = Array.from(args) // 转为数组
            result = context[specialPrototype](...args); // 执行函数并展开数组，传递函数参数
        }
    } else {
        result = context[specialPrototype](); // 执行函数 
    }
    delete context[specialPrototype]; // 删除上下文对象的属性
    return result; // 返回函数执行结果
};
```

3. bind — 分开传入参数

```js
Function.prototype.myBind = function (objThis, ...params) {
    const thisFn = this; // 存储源函数以及上方的params(函数参数)
    // 对返回的函数 secondParams 二次传参
    let fToBind = function (...secondParams) {
        const isNew = this instanceof fToBind 
        // this是否是fToBind的实例 也就是返回的fToBind是否通过new调用
        const context = isNew ? this : Object(objThis) 
        // new调用就绑定到this上,否则就绑定到传入的objThis上
        return thisFn.call(context, ...params, ...secondParams); 
      	// 用call调用源函数绑定this的指向并传递参数,返回执行结果
    };
    if (thisFn.prototype) {
        // 复制源函数的prototype给fToBind 一些情况下函数没有prototype，比如箭头函数
        fToBind.prototype = Object.create(thisFn.prototype);
    }
    return fToBind; // 返回拷贝的函数
};
```



### proxy

### reflect

### promise



