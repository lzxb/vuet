## vuet-scroll
[![npm](https://img.shields.io/npm/v/vuet-scroll.svg)](https://www.npmjs.com/package/vuet-scroll) 
[![npm](https://img.shields.io/npm/dm/vuet-scroll.svg)](https://www.npmjs.com/package/vuet-scroll)
[![npm](https://img.shields.io/npm/dt/vuet-scroll.svg)](https://www.npmjs.com/package/vuet-scroll)


## 它是做什么的？
它可以将`window`和`元素内部`的滚动条记录在`Vuet`的模块中，如果没有传入绑定的对象，将会自动注入模块的`$scroll`对象中


## 安装
```bash
npm install --save vuet-scroll
```


## 使用
```javascript
import Vue from 'vue'
import Vuet from 'vuet'
import VuetRoute from 'vuet-route'

Vue.use(VuetScroll)

const vuet = new Vuet({
  // 选项
})

const app = new App({
  el: '#app',
  vuet
})

```
安装成功后，会在Vue中注入`v-vuet-scroll`指令，注意，此指令必须配合`Vuet`使用才会有效
```html
<!-- 默认绑定元素自身的滚动条 -->
<div v-vuet-scroll="{ path: 'vuet的模块路径，必选', name: '必须设置一个名称' }"></div>
<!-- 绑定window滚动条，不需要设置name -->
<div v-vuet-scroll.window="{ path: 'vuet的模块路径，必选' }"></div>
<!-- 同时绑定元素自身滚动条和window滚动条 -->
<div v-vuet-scroll.self.window="{ path: 'vuet的模块路径，必选', name: '必须设置一个名称' }"></div>
<!-- 手动绑定对象，可以设置默认滚动条位置 -->
<div v-vuet-scroll.self.window="{ path: 'vuet的模块路径，必选', name: '必须设置一个名称', self: { x: 0, y: 0 }, window: { x: 0, y: 0 } }"></div>
```