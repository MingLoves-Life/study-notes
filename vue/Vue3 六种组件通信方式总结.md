## Vue3 六种组件通信方式总结

### 基础props方法 （父 --> 子）

```vue
<!-- father.vue -->
<template>
  <Children :msg="msg" />
</template>
<script>
import { ref } from 'vue';
import Children from './components/Children.vue';
export default {
  components: { Children },
  setup() {
    const msg = ref('to children msg');
    return { msg };
  },
};
</script>
```

```vue
<!-- children.vue -->
<template>
  children:
  <h1>{{ msg }}</h1>
</template>

<script>
export default {
  name: 'Children',
  props: { msg: { type: String } }, // 不接收，下面获取不到
  setup(props) {
    console.log(props); // {msg: 'to children msg'}
  },
};
</script>
```

### emit（父 --> 子）

```vue
<!-- father.vue -->
<template>
  <Children :msg="msg" @sendMsg="sendMsg" />
</template>
<script>
import { ref } from 'vue';
import Children from './components/Children.vue';
export default {
  components: { Children },
  setup() {
    const msg = ref('to children msg');
    const sendMsg = (newMsg) => (msg.value = newMsg);
    return {
      msg,
      sendMsg,
    };
  },
};
</script>
```

```vue
<!-- children.vue -->
<template>
  <h1 @click="handleClick">{{ msg }}</h1>
	<!-- 点击后替换为 to father msg -->
</template>

<script>
export default {
  name: 'Children',
  props: { msg: { type: String } },
  setup(props, { emit }) {
    const handleClick = () => emit('sendMsg', 'to father msg');
    return { handleClick };
  },
};
</script>
```

### attrs（父 --> 子）

```vue
<!-- father.vue -->
<template>
  <Children :attr1="attr1" :attr2="attr1" @handleClick="handleClick" />
</template>
<script>
import { ref } from 'vue';
import Children from './components/Children.vue';
export default {
  components: { Children },
  setup() {
    const attr1 = ref('attr1');
    const attr2 = ref('attr2');
    const handleClick = () => console.log('attr3'); 
    return { attr1, attr2, handleClick };
  },
};
</script>
```

```vue
<!-- child.vue -->
<template>
  <h1>child</h1>
</template>
<script>
export default {
  name: 'Children',
  setup(props, { attrs }) {
    console.log('attr:', attrs); 
    //Proxy {attr1: 'attr1', attr2: 'attr1', __vInternal: 1, onHandleClick: ƒ}
  },
};
</script>
```

### v-model（父-->子）

* 类似于vue2  `.sync` 修饰符

```vue
<!-- father.vue -->
<template>
  <Children v-model:attr1="attr1" />
</template>
<script>
import { ref } from 'vue';
import Children from './components/Children.vue';
export default {
  components: { Children },
  setup() {
    const attr1 = ref('attr1');
    return { attr1 };
  },
};
</script>
```

```vue
<!-- children.vue -->
<template>
  <h1>{{ attr1 }}</h1>
	<!-- 点击后替换为 attr2 -->
  <button @click="handleClick">click</button>
</template>
<script>
export default {
  name: 'Children',
  props: { attr1: { type: String } },
  setup(props, { emit }) {
    const handleClick = () => emit('update:attr1', 'attr2');
    return { handleClick };
  },
};
</script>
```

### provide/inject(父-->子孙)

```vue
<!-- father.vue -->
<template>
  <Children />
</template>
<script>
import { ref, provide } from 'vue';
import Children from './components/Children.vue';
export default {
  components: { Children },
  setup() {
    const msg = ref("father's msg");
    provide('fatherMsg', msg.value);
  },
};
</script>
```

```vue
<!-- children.vue -->
<template>
  <h1>child</h1>
</template>
<script>
import { inject } from 'vue';
export default {
  name: 'Children',
  setup() {
    console.log('fatherMsg:', inject('fatherMsg')); //fatherMsg: father's msg
  },
};
```



### espose(子--> 父)

```vue
<!-- father.vue -->
<template>
  <Children ref="child" />
  <button @click="handleClick">click</button>
</template>
<script>
import { ref } from 'vue';
import Children from './components/Children.vue';
export default {
  components: { Children },
  setup() {
    const child = ref();
    const handleClick = () => console.log(child.value.childMsg); // to father msg
    return { child, handleClick };
  },
};
</script>
```

```vue
<!-- children.vue -->
<template>
  <h1>child</h1>
</template>
<script>
export default {
  name: 'Children',
  setup(props, { expose }) {
    expose({ childMsg: 'to father msg' });
  },
};
</script>

```

