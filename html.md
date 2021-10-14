## 行内元素/块级元素

> 行内 - a / span / text / image / input
>
> 块级 - div / p / ul / li / h 

## 语义化的理解

语义化标签是H5新添的内容，有`header` `main` `footer` `articald` 等等，相对于`div` 更有利于浏览器去理解，有利于SEO

## H5新增内容

1. 语义化标签 header footer main aside等
2. 媒体格式 audio video
3. localStorage / sessionStorage缓存
4. web worker开启多线程
5. servers worker离线缓存
6. canvas

## meta标签

> 由name和context组成，用来描述页面文档的属性 

*** 可以提高SEO***

```html
<meta charset="UTF-8" >
<meta name="keywords" content="关键词" />
<meta name="description" content="页面描述内容" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
/*
  width viewport ：宽度(数值/device-width)
  height viewport ：高度(数值/device-height)
  initial-scale ：初始缩放比例
  maximum-scale ：最大缩放比例
  minimum-scale ：最小缩放比例
  user-scalable ：是否允许用户缩放(yes/no）
*/
```

## label标签

关联属性，用户选择label标签时，会自动聚焦到所关联的标签

```html
<label for='in'></label>
<input type="text" id='in'/>
<!----------------------------------->
<label>iphone:<input type="text"/></label>
```

## iframe

可以用于嵌套其他网站，通过src访问，支持通过postMassage跨域

```html
<iframe src="https://www.baidu.com"></iframe>
```

> 优点

1. 页面可以复用
2. 通过postMessage可以避开跨域问题
3. 天然隔离 css 和 js 不互相影响

> 缺点

1. 不利于SEO
2. 与主页面共用数据池，会阻塞主页面渲染    **浏览器支持六个请求同时发送**
3. 阻塞主页面的onload事件

## DOCTYPE

写在了HTML头部，用来表示解析方式，分为严格模式（W3C规范）和 简单模式（IE规范）

## src/href

> src - 属于引用资源，下载时阻塞文档渲染

> href - 超文本引用，下载时并行，不阻塞文档

## img标签srcset/size属性

> srcset - 根据不同的屏幕比例或宽度，展示不同的图片 [srcset= ' xxxx.png 550w, yyyy.png 880w']

> Size - 根据条件，设置不同的图片尺寸***只有srcset设置为w时才生效***

```html
<img src="4.jpg" srcset="3.jpg 229w,2.png 618w,1.jpg 1000w", sizes="(max-width: 500px) 400px, (max-width: 900px) 700px, 1200px">
```

在屏幕小于等于500px情况下，图片显示成400px宽，选取`2.png`；在屏幕小于等于900px情况下，图片显示成700px宽，选取`1.jpg`；其余情况显示成1200px宽，还是选取`1.jpg`。

## postMessage

> 用于跨页面传递消息

```html
<!------iframe.html------->
<body>
  <div>111111</div>
  <iframe src="./iframe2.html" frameborder="0" id="myIframe"></iframe>
</body>
<script>
  const myIframe = document.getElementById('myIframe')
  myIframe.onload= () => myIframe.contentWindow.postMessage('q11111')
  const fn = (e) => console.log('parent',e)
  window.addEventListener('message', fn, false)
</script>
<!------iframe2.html------->
<body>
  <h1>22222</h1>
</body>
<script>
  const fn = (e) => console.log('son',e)
  window.addEventListener('message', fn, false)
  parent.postMessage({msg:'sonPage'},'*')
</script>
```

