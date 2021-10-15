##  优先级

1. id选择器
2. 类选择器，伪类选择器，属性选择器
3. 标签选择器，伪元素选择器
4. 通配符

***important优先级最高***

## 盒模型

```css
box-sizing:context-box 
/*标准盒模型：width和height包括context*/
box-sizing:border-box
/*IE传统盒模型：width和height包括context、padding、border*/
```

## position

```css
position:relative
/*相对定位，相对自身定位，不脱离文档流*/
position:absolute
/*绝对定位，相对于距离自身最近的开启position的父元素定位，脱离文档流*/
position:fixed
/*相对于视口（viewport）定位，脱离文档流*/
position:sticky
/*相对于父元素定位，必须开启top，bottom，left，right其中之一才能生效*/
```

## 伪类/伪元素

+ 伪类

  > `div:nth-child{}` 一种元素属性操作

+ 伪元素

  > `div::after{} ` 不存在DOM树上，一种虚拟的元素，用于展示

## BFC

> 块级作用域，在BFC内部的元素不会收到外部元素的影响

开启方法：

1. body自成BFC
2. float不为none
3. position不为static
4. overflow不为none
5. display

***常用于解决高度塌陷和margin重叠问题***

### 高度塌陷

> 原因：由于子元素脱离文档流，导致父元素内容无法得到填充，所以父元素高度失效

解决方案：

1. 给父元素定义高度

2. 伪元素设置`clear:both`

   ```css
   div::after{
   	context:'';
     clear:both;
   }
   ```

3. 父元素开启BFC

   ```css
   father{
   	overflow:hidden;
   }
   ```

### margin重叠

> 原因：上下相邻的两个元素的margin会失效（++取最大值，+-取差值，--取差值）

解决方案：

1. 父元素开启BFC

   ```css
   father{
   	overflow:hidden;
   }
   ```

## 移动端适配

> 由于设计稿是统一设计，但各个设备的分辨率（物理像素的多少）不同，逻辑像素也不同，所以导致展示的内容不相同，需要适配

+ ***dpr = 物理像素 / 逻辑像素***

### 媒体查询

> 根据`屏幕宽度`来设置不同的样式

```css
@media screen(max-width:500px){}
```

### rem/em/vh/vw

1. rem/em

   > rem：根据`html`的`fontsize`属性为基础进行换算
   >
   > em：  如果自身有`fontsize`属性则根据自身的`fontsize`为基础
   >
   > ​			如没有，则根据父元素的`fontsize`为基础

2. vh/vw

   > 以视窗为基础（viewport为100），进行同比缩放

应用：监听resize事件，根据文档宽高改变html的fontsize

```js
// 计算html的font-size  
(function(){     
  function resizeBaseFontSize(){       
    var rootHtml = document.documentElement,          
        deviceWidth = rootHtml.clientWidth;       
    if(deviceWidth > 640){          
      deviceWidth = 640;
    }       
   rootHtml.style.fontSize = deviceWidth / 7.5 + "px";
  }  
   resizeBaseFontSize();  
   window.addEventListener("resize", resizeBaseFontSize, false);  
   window.addEventListener("orientationchange", resizeBaseFontSize, false);  
})();
```

### 通过meta标签缩放

```html
<meta name="viewport" content="width=device-width; initial-scale=1; maximum-scale=1; minimum-scale=1; user-scalable=no;">
<!--
	width：视口宽度（device-width：设备宽度）
	height：视口高度 （device-height：设备高度）
	initial-scale：初始缩放值
	maximum-scale：最大缩放比例
	minimum-scale：最小缩放比例
	user-scalable：用户是否可以缩放，默认为yes
-->
```

```js
(function () {
   function resizeScale(){
        var dpr = window.devicePixelRatio;
        var meta = document.createElement('meta');
        var scale = 1 / dpr;
        meta.setAttribute('name', 'viewport');
        meta.setAttribute('content', 'width=device-width, user-scalable=no, initial-scale=' + scale +', maximum-scale=' + scale + ', minimum-scale=' + scale);
        document.getElementsByTagName('head')[0].appendChild(meta);
   } 
  window.addEventListener('resize',resizeScale,false);
  })()
```

### 1px 

1. 设置meta viewport标签，将initial-scale属性设为1/dpr
2. 通过css控制 `transform：translateY（0.5）`

## 元素的隐藏

```css
display:none;
/*在DOM树上消失，绑定的事件不可触发*/
visibility:hidden;
/*元素不可见，位置不变，绑定的事件不可触发*/
opacity:0;
/*透明度为0，位置不变，绑定的事件可以触发*/
```

## z-index

> 开启方式：`position`不为`static` 或 设置`css3`属性

顺序：低 -> 高

> `background/border`->`z-index<0` -> `block` -> `float` -> `inline` ->  `z-index=0` ->`>0`

比较方法：

> + 先比较父级层叠上下文
> + 在按照顺序比较同级元素

## 回流/重绘

> 当页面/元素的位置/大小/属性发生改变，获取一些属性（clientWidth等）时会引发`回流`
>
> 当元素的背景，透明度，颜色等发生改变时会引发`重绘`
>
> `回流`会重新构建DOM TREE，重新渲染页面。
>
> `重绘`会重新渲染变化的DOM
>
> ***回流必将引起重绘，重绘不一定会引起回流***

**优化：**

+ 浏览器会自动将系列操作放到队列中，一段时间后一起执行（JS获取属性时清空队列）
+ 先将DOM移除DOM TREE，修改后在放回DOM TREE
+ 使元素脱离文档流
+ 减少层级嵌套，避免使用table
+ 开启GPU加速

## GPU加速

> 浏览器将DOM分为多个层，在每层在栅格化之后，会利用GPU来合成图层
>
> 开启GPU加速后，会将元素放到一个新的层，利用GPU合成图层实现动画，来代替CPU来绘制位图
>
> 如果没有变化，可以从GPU的缓存中来绘制，减轻CPU的负担

开启方法：开启3D即可

- transform
- opacity
- filters
- Will-change

## flex

> 父容器

+ flex-direction：设置主轴的方向
+ flex-wrap：设置子元素是否换行
+ justify-content：设置主轴上的子元素排列方式
+ align-content：设置侧轴上的子元素的排列方式（多行）
+ align-items：设置侧轴上的子元素排列方式（单行）
+ flex-flow：复合属性，相当于同时设置了 flex-direction 和 flex-wrap

> 子容器

+ flex-grow：有空余空间放大的比例
+ flex-shrink：空间不足缩小的比例
+ flex-basis：缩放前所占用的空间
+ order：改变子容器排列顺序
+ align-self：子容器如何沿交叉轴排列

***flex：1 （1 1 0）***

***flex：none（0,0,auto)***

## 动画

### transition

| 值                         | 描述                              |
| -------------------------- | --------------------------------- |
| transition-property        | 规定设置过渡效果的 CSS 属性的名称 |
| transition-duration        | 规定完成过渡效果需要多少秒或毫秒  |
| transition-timing-function | 规定速度效果的速度曲线            |
| transition-delay           | 定义过渡效果何时开始              |

***可以定义多个属性中间用 `,` 隔开即可***

### animation

|           属性            | 描述                                                         |
| :-----------------------: | :----------------------------------------------------------- |
|    animation-duration     | 指定动画完成一个周期所需要时间，单位秒（s）或毫秒（ms），默认是 0。 |
| animation-timing-function | 指定动画计时函数，即动画的速度曲线，默认是 "ease"。          |
|      animation-delay      | 指定动画延迟时间，即动画何时开始，默认是 0。                 |
| animation-iteration-count | 定义动画的播放次数，可选具体次数或者无限(infinite)。         |
|    animation-direction    | 设置动画播放方向：normal(按时间轴顺序),reverse(时间轴反方向运行),alternate(轮流，即来回往复进行),alternate-reverse(动画先反运行再正方向运行，并持续交替运行) |
|    animation-fill-mode    | 控制动画结束后，元素的样式，有四个值：none(回到动画没开始时的状态)，forwards(动画结束后动画停留在结束状态)，backwords(动画回到第一帧的状态)，both(根据animation-direction轮流应用forwards和backwards规则)，注意与iteration-count不要冲突(动画执行无限次) |
|   animation-play-state    | 作者：Vince_ 链接：https://juejin.cn/post/6844903615920898056 来源：稀土掘金 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。  控制元素动画的播放状态，通过此来控制动画的暂停和继续，两个值：running(继续)，paused(暂停) |
|      animation-name       | 指定 @keyframes 动画的名称。                                 |

> 使用方法

```css
div{
	animation: rotate 1s;
}
@keyframes rotate {
    from{
    	transfrom:translate(200px,0)
    }
    to{
			transfrom:translate(0,200px)
    }
}
```

### transition和animation对比

+ transition需要触发条件，且出发没法停止
+ transition除非再次触发，否则无法再次使用
+ transition只有两帧，初始帧和最终帧

## 省略号

```css
/*单行*/
overflow: hidden;            // 溢出隐藏
text-overflow: ellipsis;      // 溢出用省略号显示
white-space: nowrap;         // 规定段落中的文本不进行换行

/*多行*/
overflow: hidden;            // 溢出隐藏
text-overflow: ellipsis;     // 溢出用省略号显示
display:-webkit-box;         // 作为弹性伸缩盒子模型显示。
-webkit-box-orient:vertical; // 设置伸缩盒子的子元素排列方式：从上到下垂直排列
-webkit-line-clamp:3;        // 显示的行数

/*多行也可用after伪元素来实现*/
p {
	position:relative;
	line-height:20px;
	max-height:40px;
	overflow:hidden;
}
p::after {
	content: "2026";      // '...'
	position:absolute;
	bottom:0;
	right:0;
	padding-left:40px;
	background:-webkit-linear-gradient(left,transparent,#fff 55%);
	background:-o-linear-gradient(right,transparent,#fff 55%);
	background:-moz-linear-gradient(right,transparent,#fff 55%);
	background:linear-gradient(to right,transparent,#fff 55%);
}
```

## variable

> 使用`--`语法进行定义，`var`进行引用

```css
body{
	--baseColor:red
}
div{
  color:var(--baseColor)
}
```

> JS可以控制CSS变量

```js
// 设置变量
document.body.style.setProperty('--primary', '#7F583F');
// 读取变量
document.body.style.getPropertyValue('--primary').trim();
// '#7F583F'
// 删除变量
document.body.style.removeProperty('--primary');
```





