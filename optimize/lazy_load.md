### [原生windowAPI](https://zhuanlan.zhihu.com/p/55311726)

![img](https://gitee.com/MingLovesLife/markdown/raw/master/img/v2-af1ab0c5f34e468e8647135c1f9f51e4_1440w.jpg)

```javascript
var imgs = document.querySelectorAll('img');
    //offsetTop是元素与offsetParent的距离，循环获取直到页面顶部
    function getTop(e) {
      var T = e.offsetTop;
      while(e = e.offsetParent) {
        T += e.offsetTop;
      }
      return T;
    }
    function lazyLoad(imgs) {
      var H = document.documentElement.clientHeight;
      //获取可视区域高度
      var S = document.documentElement.scrollTop 
      || document.body.scrollTop;
      for (var i = 0; i < imgs.length; i++) {
        if (H + S > getTop(imgs[i])) {
          imgs[i].src = imgs[i].getAttribute('data-src');
        }
      }
    }
    window.onload = window.onscroll = function () { 
      //onscroll()在滚动条滚动的时候触发
      lazyLoad(imgs);
    }
```

### [getBoundingClientRect](https://juejin.cn/post/6844903801590120462#heading-4)

  JavaScript 提供 Element.getBoundingClientRect() 方法返回元素的大小以及相对于视口的位置信息，接下来会用到返回对象的四个属性：

-  top 和 left 是目标元素左上角坐标与网页左上角坐标的偏移值；

- width 和 height 是目标元素自身的宽度和高度。

  

  ![img](https://gitee.com/MingLovesLife/markdown/raw/master/img/v2-641fabfd753a1fa5f4749cc8d72d61b0_1440w.jpg)

  ```javascript
  function isElementInViewport (el) {
    const { top, height, left, width } = el.getBoundingClientRect()
    const w = window.innerWidth || document.documentElement.clientWidth
    const h = window.innerHeight || document.documentElement.clientHeight
    return (
      top <= h &&
      (top + height) >= 0 &&
      left <= w &&
      (left + width) >= 0
    )
  }
  ```

### [intersectionObserver](http://www.ruanyifeng.com/blog/2016/11/intersectionobserver_api.html)

> ```javascript
> var io = new IntersectionObserver(callback, option);
> ```

上面代码中，`IntersectionObserver`是浏览器原生提供的构造函数，接受两个参数：`callback`是可见性变化时的回调函数，`option`是配置对象（该参数可选）。

构造函数的返回值是一个观察器实例。实例的`observe`方法可以指定观察哪个 DOM 节点。

> ```javascript
> // 开始观察
> io.observe(document.getElementById('example'));
> 
> // 停止观察
> io.unobserve(element);
> 
> // 关闭观察器
> io.disconnect();
> ```

上面代码中，`observe`的参数是一个 DOM 节点对象。如果要观察多个节点，就要多次调用这个方法。

> ```javascript
> io.observe(elementA);
> io.observe(elementB);
> ```

`callback`一般会触发两次。一次是目标元素刚刚进入视口（开始可见），另一次是完全离开视口（开始不可见）。

> ```javascript
> var io = new IntersectionObserver(
>   entries => {
>     console.log(entries);
>   }
> );
> ```

`IntersectionObserverEntry`对象提供目标元素的信息，一共有六个属性。

> ```javascript
> {
>   time: 3893.92,
>   rootBounds: ClientRect {
>     bottom: 920,
>     height: 1024,
>     left: 0,
>     right: 1024,
>     top: 0,
>     width: 920
>   },
>   boundingClientRect: ClientRect {
>      // ...
>   },
>   intersectionRect: ClientRect {
>     // ...
>   },
>   intersectionRatio: 0.54,
>   target: element
> }
> ```

每个属性的含义如下。

> - `time`：可见性发生变化的时间，是一个高精度时间戳，单位为毫秒
> - `target`：被观察的目标元素，是一个 DOM 节点对象
> - `rootBounds`：根元素的矩形区域的信息，`getBoundingClientRect()`方法的返回值，如果没有根元素（即直接相对于视口滚动），则返回`null`
> - `boundingClientRect`：目标元素的矩形区域的信息
> - `intersectionRect`：目标元素与视口（或根元素）的交叉区域的信息
> - `intersectionRatio`：目标元素的可见比例，即`intersectionRect`占`boundingClientRect`的比例，完全可见时为`1`，完全不可见时小于等于`0`

![img](https://gitee.com/MingLovesLife/markdown/raw/master/img/bg2016110202.png)

```javascript
function query(selector) {
  return Array.from(document.querySelectorAll(selector));
}

var observer = new IntersectionObserver(
  function(changes) {
    changes.forEach(function(change) {
      var container = change.target;
      var content = container.querySelector('template').content;
      container.appendChild(content);
      observer.unobserve(container);
    });
  }
);

query('.lazy-loaded').forEach(function (item) {
  observer.observe(item);
});
```

