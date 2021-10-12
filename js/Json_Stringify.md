## 使用

**JSON.stringify(value [, replacer [, space]])**

> 1. value：序列化的值
> 2. replacer：
>    1. 函数：序列化数据处理
>    2. 数组：只有数组中内容才可序列化
>    3. null：全部都可序列化
> 3. space：美化空格

```js
const obj = {name:'mingming',age:18,sex:'man'}
console.log(JSON.stringify(obj, ['name'], 2))
/*
  {
    "name": "mingming",
  }
*/
```

## 特性

1. 函数，undefined，symbol为值

   > `value`为对象时会被忽略，为数组时会转为null，单独时会转为undefined

2. sysbol属性为键会被忽略

3. 对象中有toJson方法会直接转换方法的返回值

   ```js
   const toJSONObj = {
     name: 'ming',
     toJSON () {
       return 'JSON.stringify'
     }
   }
   
   console.log(JSON.stringify(toJSONObj))
   // "JSON.stringify"
   ```

4. 循环引用，bigInt会报错

***仅会转换可枚举属性***

