## 优点

* 自动适配环境（浏览器-XML，node-http）

* 支持promise链式调用

* 自动转换请求和响应的数据格式

* 请求拦截器和响应拦截器

* 支持取消请求

* 客户端防范XSRF攻击

  

## 拦截器

> 使用方法：通过use方法注册

```js
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  config.headers.token = 'added by interceptor';
  return config;
});

// 添加响应拦截器
axios.interceptors.response.use(function (data) {
  data.data = data.data + ' - modified by interceptor';
  return data;
});  
```

> 实现原理

1. axios实例在interceptor属性上，为request和response分别创建Interceptor实例

   ```js
   // lib/core/Axios.js
   function Axios(instanceConfig) {
     this.defaults = instanceConfig;
     this.interceptors = {
       request: new InterceptorManager(),
       response: new InterceptorManager()
     };
   }
   ```

2. Interceptor实例上use方法传两个参数（成功的回调，失败的回调），push到自身的数组中

   ```js
   // lib/core/InterceptorManager.js
   function InterceptorManager() {
     this.handlers = [];
   }
   
   InterceptorManager.prototype.use = function use(fulfilled, rejected) {
     this.handlers.push({
       fulfilled: fulfilled,
       rejected: rejected
     });
     // 返回当前的索引，用于移除已注册的拦截器
     return this.handlers.length - 1;
   };
   ```

3. Axios实例本身有一个chain任务编排数组，request方法在发送请求之前，会将req拦截器的数组unshift到chain的最前面，res拦截器的数组push到chain的最后面

4. while循环,通过promise.then(`chain.shift()`,`chain.shift()`)进行调度执行

   ```js
   // lib/core/Axios.js
   Axios.prototype.request = function request(config) {
     config = mergeConfig(this.defaults, config);
   
     // 省略部分代码
     var chain = [dispatchRequest, undefined];
     var promise = Promise.resolve(config);
   
     // 任务编排
     this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
       chain.unshift(interceptor.fulfilled, interceptor.rejected);
     });
   
     this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
       chain.push(interceptor.fulfilled, interceptor.rejected);
     });
   
     // 任务调度
     while (chain.length) {
       promise = promise.then(chain.shift(), chain.shift());
     }
   
     return promise;
   };
   ```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9b660c577cf2498e95b995f4bb804cd0~tplv-k3u1fbpfcp-watermark.awebp)

## 防范CSRF

> 从cookie中取设置到的key所对应的value的值，赋给header中设置好的key

```js
// lib/defaults.js
var defaults = {
  adapter: getDefaultAdapter(),

  // 省略部分代码
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
};

// lib/adapters/xhr.js
module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestHeaders = config.headers;
    
    var request = new XMLHttpRequest();
    // 省略部分代码
    
    // 添加xsrf头部
    if (utils.isStandardBrowserEnv()) {
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    request.send(requestData);
  });
};
```

## 取消请求

> 使用方法

```js
const CancelToken = axios.CancelToken;

// 返回两个字段，{ token, cancel }
// token用于表示某个请求，是一个Promise类型
// cancel是一个方法，当被调用时，则取消token注入的那个请求
const source = CancelToken.source();

axios
    .get('/user/12345', {
        cancelToken: source.token, // 将token注入到请求中
    })
    .catch(function (thrown) {
        // 判断是否是因主动取消导致的
        if (axios.isCancel(thrown)) {
            console.log('Request canceled', thrown.message);
        } else {
            // handle error
            console.error(thrown);
        }
    });

axios.post(
    '/user/12345',
    {
        name: 'new name',
    },
    {
        cancelToken: source.token,
    }
);

// 主动取消请求
// cancel方法会把注入的同一个token的请求方法一并取消掉
// 上面的get和post请求都会被取消掉
// cancel the request (the message parameter is optional)
source.cancel('Operation canceled by the user.');
```

> 实现原理

1. 新建一个promise，将resolve方法赋值给别的函数，暴露出去

   ```js
   function CancelToken(executor) {
       if (typeof executor !== 'function') {
           throw new TypeError('executor must be a function.');
       }
   
       // 创建一个Promise的实例，
       // 当resolvePromise执行时，this.promise变为fulfilled状态
       var resolvePromise;
       this.promise = new Promise(function promiseExecutor(resolve) {
           resolvePromise = resolve;
       });
   
       // new一个实例时，会立即执行CancelToken的回调函数executor方法
       // executor的参数也是一个函数，即上面的cancel就是当前的cancel函数体
       // 当executor的回调函数cancel执行时，会给当前CancelToken创建一个reason属性，这个属性是Cancel的实例
       // 并执行resolvePromise方法，将reason实例穿进去；执行后this.promise变为fulfilled状态
       var token = this;
       executor(function cancel(message) {
           if (token.reason) {
               // Cancellation has already been requested
               return;
           }
   
           token.reason = new Cancel(message);
           resolvePromise(token.reason);
       });
   }
   ```

2. 执行cancel方法时，触发该函数，将promise的状态改为fulfilled，即可触发设置好的.then方法

3. .then方法通过abort终止请求，通过reject抛出异常

   ```js
   if (config.cancelToken) {
       // config.cancelToken就是上面创建的token
       // 当token.promise变为fulfilled状态后，就可以执行后续的链式操作
       // Handle cancellation
       config.cancelToken.promise.then(function onCanceled(cancel) {
           if (!request) {
               return;
           }
   
           // 取消当前的请求
           request.abort();
   
           // 将Cancel的实例cancel给到reject
           reject(cancel);
           // Clean up request
           request = null;
       });
   }
   ```

