## Vuet
[![Coverage Status](https://coveralls.io/repos/github/medatc/vuet/badge.svg?branch=dev)](https://coveralls.io/github/medatc/vuet?branch=dev)
[![Build Status](https://travis-ci.org/medatc/vuet.svg?branch=dev)](https://travis-ci.org/medatc/vuet)
[![npm](https://img.shields.io/npm/v/vuet.svg)](https://www.npmjs.com/package/vuet) 
[![npm](https://img.shields.io/npm/dm/vuet.svg)](https://www.npmjs.com/package/vuet)
[![npm](https://img.shields.io/npm/dt/vuet.svg)](https://www.npmjs.com/package/vuet)

## 索引
- [Vuet.js是什么？](#vuetjs是什么)  
- [0.x版本和1.x版本的区别](#0x版本和1x版本的区别)  
- [快速入门](#快速入门)  
- [实例的选项](#实例的选项)  
- [实例的方法](#实例的方法)  
- [全局API](#全局api)  
- [什么是规则？](#什么是规则)  
- [内置的规则](#内置的规则)  
- [自定义规则](#自定义规则)  


## Vuet.js是什么？
在`vuex`中更新状态的唯一途径，就是通过提交`mutation`，这个过程是琐碎的，而在`Vuet`中是允许在何时何地进行直接赋值更新的，这个过程它是愉快的。


## 0.x版本和1.x版本的区别
在`0.x`版本中，我们内置了太多的功能，导致大幅度提升了入门的门槛，`1.x`版本则是化繁为简，只保留了几个核心的API。  
`注`：route规则已经从Vuet中删除，后续会以插件的形式进行发布，敬请期待！


## 快速入门
```javascript

import Vue from 'vue'
import Vuet, { mapModules, mapRules } from 'vuet'

Vue.use(Vuet)

const vuet = new Vuet({
  // 实例的选项，详情往下看
})
vuet.register('test', {
  data () {
    return {
      count: 0
    }
  },
  fetch () {
    this.count = 1000
  },
  plus () {
    this.count++
  },
  reduce () {
    this.count--
  },
  modules: {
    // 可以添加子模块，会自动继承父模块的名称：路径 = 父模块名称/子模块名称
  }
})

const App = {
  mixins: [
    mapModules({
      test: 'test' // { 别名： '模块路径' }
    }),
    mapRules({
      once: [{ path: 'test' }] // { 规则: ['模块路径'] } 内置的规则和简写方式可以在下面看
    })
  ],
  template: `
    <div>
      <div class="count">{{ test.count }}</div>
      <button @click="test.plus">plus</button> 
      <button @click="test.reduce">reduce</button> 
      <button @click="test.reset">reset</button> 
      <button @click="test.fetch">fetch</button> 
    </div>
  `
}

export default new Vue({
  el: '#app',
  vuet,
  render (h) {
    return h(App)
  }
})

```


## 实例的选项
`options.pathJoin`
  - 描述：子模块继承父模块时分割符
  - 默认值：`/`

`options.modules`
  - 描述：要初始化的模块
  - 默认值：`{}`

## 实例的方法
`vuet.register(path: string, module: Object)`
  - 描述：注册模块  

`vuet.getModule(path: string)`
  - 描述：返回该模块的状态和方法  

`vuet.getState(path: string)`
  - 描述：只返回模块的状态，不会返回方法

`vuet.destroy()`
  - 描述：销毁程序，释放内存。vue实例销毁时，也会跟着自动销毁


## 全局API
`Vuet.mapModules(opts: { 别名: '模块路径' })`
  - 描述：在Vue组件中连接模块，这样就可以在组件中使用模块的方法和状态

`Vuet.mapRules(opts: { 规则: [{ path: '模块路径 }] })`
  - 描述：使用对应的规则，来更新模块。支持简写：`{ 规则: '模块路径' }`、`{ 规则: ['模块路径'] }`


## 什么是规则？
在`Vuet`中，`规则`在`Vuet`中是一种特殊的存在，它允许你将类似的更新一个模块状态的过程抽象出来，你可以使用`规则`来更新任何一个模块。你可以把`Vuet模块`当成一辆车，而`规则`就是定义这辆车应该怎么行走，到底是直走，还是转弯，还是直走一会，然后转弯，这些都是通过来`规则`来定义它


## 内置的规则
`need`
  - 描述：组件每次初始化时，在`beforeCreate`钩子中调用一次`fetch`方法

`once`
  - 描述：仅第一次在组件的`beforeCreate`钩子中调用一次`fetch`方法，之后在任何组件都不会再进行更新

`temp`
  - 描述：组件初始化时，在`beforeCreate`钩子中调用一次`fetch`方法，组件销毁时，在`destroyed`钩子中重置模块状态

## LICENSE
MIT