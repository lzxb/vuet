## Vuet
[![Coverage Status](https://coveralls.io/repos/github/medatc/vuet/badge.svg?branch=dev)](https://coveralls.io/github/medatc/vuet?branch=dev)
[![Build Status](https://travis-ci.org/medatc/vuet.svg?branch=dev)](https://travis-ci.org/medatc/vuet)
[![npm](https://img.shields.io/npm/v/vuet.svg)](https://www.npmjs.com/package/vuet) 
[![npm](https://img.shields.io/npm/dm/vuet.svg)](https://www.npmjs.com/package/vuet)
[![npm](https://img.shields.io/npm/dt/vuet.svg)](https://www.npmjs.com/package/vuet)

## 索引
- [Vuet.js是什么？](#vuetjs是什么)  
- [0.x版本和1.x版本的区别](#0x版本和1x版本的区别) 
- [安装](#安装)  
- [快速入门](#快速入门)  
- [API](#api)
  - [实例的选项](#实例的选项)  
  - [实例的属性](#实例的属性)  
  - [实例的方法](#实例的方法)  
  - [全局API](#全局api)  
- [模块](#模块)
  - [什么是模块？](#什么是模块)
  - [注册模块](#注册模块)
  - [使用计算属性连接模块](#使用计算属性连接模块)  
  - [在模块中获取路由对象](#在模块中获取路由对象)  
  - [重置模块状态](#重置模块状态)  
- [规则](#规则)
  - [什么是规则？](#什么是规则)  
  - [内置的规则](#内置的规则)  
  - [自定义规则](#自定义规则)  
- [第三方插件](#第三方插件)  
- [第三方项目](#第三方项目)


## Vuet.js是什么？
在`vuex`中更新状态的唯一途径，就是通过提交`mutation`，这个过程是琐碎的，而在`Vuet`中是允许在何时何地进行直接赋值更新的，这个过程它是愉快的。

## 0.x版本和1.x版本的区别
在`0.x`版本中，我们内置了太多的功能，导致大幅度提升了入门的门槛，`1.x`版本则是化繁为简，只保留了几个核心的API。  
`注`：route规则已经从Vuet中删除，后续会以插件的形式进行发布，敬请期待！[0.x版本地址](https://github.com/medatc/vuet/tree/0.3.0)

## 安装
```bash
npm install vuet@latest
```

## 快速入门
```javascript

import Vue from 'vue'
import Vuet, { mapModules, mapRules } from 'vuet'

Vue.use(Vuet)

const vuet = new Vuet({
  // 实例的选项，详情往下看
})
vuet.addModules('test', {
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

## API


### 实例的选项
`options.pathJoin`
  - 描述：子模块继承父模块时分割符
  - 默认值：`/`

`options.modules`
  - 描述：要初始化的模块
  - 默认值：`{}`

### 实例的属性
`vuet.app`
  - 描述：`new Vuet({ vuet })`时的`Vue`实例
  - 默认值：`null` 

`vuet.modules`
  - 描述：添加的模块，全部都在这里
  - 默认值：`{}`

`vuet.options`
  - 描述：`new Vuet(options)`实例化时传入的参数
  - 默认值：`{ pathJoin: '/', modules: {} }`

`vuet.store`
  - 描述：每个模块存储的状态
  - 默认值：`{}`

`vuet.vm`
  - 描述：vuet内部的Vue实例


### 实例的方法
`vuet.addModules(path: string, modules: Object)`
  - 描述：注册模块  

`vuet.getModule(path: string)`
  - 描述：返回该模块的状态和方法  

`vuet.getState(path: string)`
  - 描述：只返回模块的状态，不会返回方法

`vuet.destroy()`
  - 描述：销毁程序，释放内存。vue实例销毁时，也会跟着自动销毁


### 全局API
`Vuet.mapModules(opts: { 别名: '模块路径' })`
  - 描述：在Vue组件中连接模块，这样就可以在组件中使用模块的方法和状态

`Vuet.mapRules(opts: { 规则: [{ path: '模块路径 }] })`
  - 描述：使用对应的规则，来更新模块。支持简写：`{ 规则: '模块路径' }`、`{ 规则: ['模块路径'] }`

`Vuet.rule(name: string, opts: Object)`
  - 描述：注册全局规则，详情可以查看下面的[自定义规则](#自定义规则)


## 模块


### 什么是模块？
模块好比就是一个人的基本骨架，模块的属性就好比人的手、脚、眼睛等等，而模块的方法就好比大脑，操纵着人的行为，比如用手撸代码，用脚走路，看到漂亮的美女眨眨眼睛


### 注册模块
```javascript
const vuet = new Vuet()

// 注册了一个叫test的模块
vuet.addModules('test', {
  data () {
    return {
      count: 0 // 定义了一个count属性
    }
  },
  plus () { // 定义了一个plus方法
    this.count++
  },
  modules: { // 定义子模块
    chlid: { // 子模块路径 = 父模块/子模块 = test/chlid
      data () {
        return {
          count: 0 // 定义了一个count属性
        }
      },
      plus () { // 定义了一个plus方法
        this.count++
      }
    }
  }
})

```


### 使用计算属性连接模块
```javascript
{
  computed: {
    test () { // 虽然可以通过mapModules方法向组件注入模块，但是也可以通过计算属性的方法获取模块
      return this.$vuet.getModule('模块路径')
    }
  },
  beforeCreate () {
    // this.test 取得模块，就可以调用模块的方法和属性了
    // this.$vuet 取得vuet实例，然后就可以愉快的玩耍了
  }
}
```


### 在模块中获取路由对象
```javascript
const vuet = new Vuet()
vuet.addModules('test', {
  data () {
    return {}
  },
  plus () {
    this.vuet // 取得vuet实例
    this.app // 取得vue根实例
    this.app.$router // 获取路由的方法
    this.app.$route  // 获取路由的状态
  }
})
```


### 重置模块状态
```javascript
const vuet = new Vuet()
vuet.addModules('test', {
  data () {
    return {
      count: 0
    }
  },
  plus () {
    this.count = 100 // 等同于 this.state.count
    setTimeout(() => {
      this.reset() // 这是vuet内置的一个reset的方法 等同于 this.state = this.data()
    }, 2000)
  }
})
```


## 规则


### 什么是规则？
在`Vuet`中，`规则`在`Vuet`中是一种特殊的存在，它允许你将类似的更新一个模块状态的过程抽象出来，你可以使用`规则`来更新任何一个模块。你可以把`Vuet模块`当成一辆车，而`规则`就是定义这辆车应该怎么行走，到底是直走，还是转弯，还是直走一会，然后转弯，这些都是通过来`规则`来定义它


### 内置的规则
`need`
  - 描述：组件每次初始化时，在`beforeCreate`钩子中调用一次`fetch`方法

`once`
  - 描述：仅第一次在组件的`beforeCreate`钩子中调用一次`fetch`方法，之后在任何组件都不会再进行更新

`temp`
  - 描述：组件初始化时，在`beforeCreate`钩子中调用一次`fetch`方法，组件销毁时，在`destroyed`钩子中重置模块状态


### 自定义规则
主要的原理就是获取传入的`模块路径`，`return`一个`mixin`注入到组件中  
我们现在就开始尝试定义一个飙车的过程，就是在组件每次执行`beforeCreate`钩子时，调用一次模块的`fetch`方法，那我们现在尝试定义一个`myRule`规则
```javascript
Vuet.rule('myRule', { // 注意：规则的注册必须在所有组件执行之前
  install (Vuet, Vue) {
    // 传入一个Vuet和Vue构造函数。只会调用一次
  },
  init (vuet) {
    // new Vuet() 实例化后，传入实例，你可以在这里添加一些模块、方法之类的。每new一个Vuet实例，都会执行一次钩子
  },
  addModule (vuet, path) {
    // new Vuet().addModules 每注册一个模块，都会执行一次钩子
  }
  rule ({ path }) {
    // 传入当前模块的路径，返回一个mixin来注入到组件中。执行Vuet的mapRules方法时会调用
    return {
      beforeCreate () {
        // 用路径，取得当前的模块
        const vtm = this.$vuet.getModule(path)
        // 然后调用一次模块的fetch方法
        vtm.fetch()
      }
    }
  },
  destroy (vuet) {
    // 传入当前要销毁的vuet实例，你可以做一些自己使用销毁的东西
  }
})
```
向组件中注入更新模块的规则
```javascript
  {
    mixins: [
      mapRules({
        'myRule': '更新的模块路径'
      })
    ]
    // ...options
  }
```


## 第三方插件
- [vuet-scroll](./packages/vuet-scroll) 记录滚动条位置
- [vuet-route](./packages/vuet-route) 根据`vue-router`的变化，来重新请求数据


## 第三方项目
- [vue-cnode](https://github.com/medatc/vuet) Vue + Vuet实现的cnode社区


## LICENSE
MIT