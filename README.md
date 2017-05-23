[![Build Status](https://travis-ci.org/medevicex/vuet.svg?branch=master)](https://travis-ci.org/medevicex/vuet)
[![Known Vulnerabilities](https://snyk.io/test/npm/vuet/badge.svg)](https://snyk.io/test/npm/vuet)
[![npm](https://img.shields.io/npm/v/vuet.svg?style=flat-square)](https://www.npmjs.com/package/vuet) 
[![npm](https://img.shields.io/npm/dt/vuet.svg?style=flat-square)](https://www.npmjs.com/package/vuet)

# vuet
简单易用，功能强大Vue 状态管理插件

#### 功能开发列表
- [x]  route 插件，每次组件beforeCreate钩子会触发一次fetch，根据配置的规则来监听$route的变化来决定是否更新fetch（适合存储页面之间的数据）
- [x]  once  插件，只有第一次组件使用的时候beforeCreate钩子会触发一次fetch，以后永远不会重新触发请求（适合存储不变的数据，比如省市区的数据）
- [x]  need  插件，每一次组件使用的时候，beforeCreate钩子会触发一次fetch（适合存储一次性拿到全部的数据，比如某个模块的统计）
- [x]  local 插件，不会调用任何钩子，只是单纯的存储本地的数据（适合写死在程序中的数据，比如某个下拉框）
- [x]  life  插件，组件销毁时，数据将会被重置（适合跨组件进行通信，比如一个组件是编辑数据，另外一个兄弟组件则预览数据）

#### 单元测试
- [ ] debug.js
- [x] install.js
- [ ] mapMixins.js
- [ ] mapState.js
- [ ] utils.js
- [x] vuet.js
- [ ] plugins/life.js
- [ ] plugins/local.js
- [ ] plugins/need.js
- [ ] plugins/once.js
- [ ] plugins/route.js

#### 安装
```
npm install vuet
```

#### 使用须知
程序必须要支持Promise，[完整的例子请看这里](https://github.com/medevicex/vuet/tree/master/examples)

#### 介绍
vuet是一个跨页面、跨组件的状态管理插件，提供了模块化的数据管理，可以自定义mixin来维护模块的数据以及和服务器之间的通信、如何在本地进行更新。

#### 快速上手
```javascript
import Vue from 'vue'
import Vuet from 'vuet'

Vue.use(Vuet)

const vuet = new Vuet({
  data () { // 基本的数据，会注入到所有的module中
    return { loading: true, loaded: true }
  },
  modules: {
    myModule: { // 模块名称
      route: { // 要使用的插件，这个插件是配合vue-router使用的，具体请查看内置插件相关
        articleList: {
          // 更新数据的规则设置，默认是$route.fullPath
          // 如果有多个条件，可以传入一个数组['query.name', 'params.id']
          watch: 'fullPath',
          data () { // 会和全局的data合并到一起
            return { list: [] }
          },
          fetch () { // 插件更新数据时，调用的钩子，必须返回一个Promsie
            return Promise.resolve({ list: [1,2,3] })
          }
        }
      }
    }
  }
})

vuet.beforeEach(function ({ store }) { // 请求发送前调用钩子，return false 则取消本次请求
  store.loading = true
  store.loaded = true
})
vuet.afterEach (function (err, { store }, res) { // 请求结束后调用钩子，return false 则取消更新数据
  store.loading = false
  store.loaded = (err === null)
})

new Vue({
  el: '#app',
  vuet
})

```

#### 组件注入处理逻辑和模块的数据
```javascript
import { mapMixins, mapState } from 'vuet'

export default {
 // ...options
 mixins: [...mapMixins('myModule/route/articleList')], // 向组件注入处理数据的逻辑
 computed: mapState({ articleList: 'myModule/route/articleList' }), // 使用键值的方式，和数据进行连接
 created () {
  console.log(this.articleList.loading, this.articleList.loaded, this.articleList.list)
 }
}

```
#### 组件内注入的方法
```javascript
// 直接设置模块的状态
this.$vuet.setState('myModule/route/articleList', {
 // ...参数
})
// 获取模块的状态
this.$vuet.getState('myModule/route/articleList')
// 重置模块的状态
this.$vuet.reset('myModule/route/articleList')
// 向服务器请求更新模块的状态
this.$vuet.fetch('myModule/route/articleList', {
 // 自定义参数，在beforeEach、beforeEach钩子中能接收到对应的参数
})
```

#### 自定义插件
```javascript
import Vuet from 'vuet'
const myPlugin = {
 name: 'myPlugin', // 插件的名称
 install (Vue, Vuet, options) {
  // ...调用Vuet.use()方法时会执行
 },
 mixin (path) { // 会传入一个模块路径的参
  return {
   // ....options，你可以根据自己的需求，定义数据的处理方式
   created () {
    console.log(this._options.modules[path]) // 取得当前模块的配置
    console.log(this.getState(path)) // 取得当前模块的状态
    this.$vuet.fetch(path) // 向服务器请求更新状态
   }
  }
 }
}
Vuet.use(myPlugin, {
 // ...options
})

const vuet = new Vuet({
 modules: {
  myModule: {
   myPlugin: { // 使用自定义插件来处理数据
    data () {
     return {
      state: false
     }
    },
    fetch () {
     return Promise.resolve({ state: true })
    }
   }
  }
 }
})

```

#### 内置的插件
##### route
描述：配合vue-router使用的页面数据管理插件,会监听$route的变化来确定是否需要请求数据，每次渲染组件渲染时，在beforeCreate钩子函数中也会触发一次请求。他可以轻易实现页面后退时显示原来的列表数据  
有一个watch的参数，来确定$route变化时是否需要重新请求数据  
例子：
```javascript
new Vuet({
  modules: {
    myModule: { // 模块名称
      route: { // 要使用的插件，这个插件是配合vue-router使用的
        articleList: {
          // 更新数据的规则设置，默认是$route.fullPath
          // 如果有多个条件，可以传入一个数组['query.name', 'params.id']
          watch: 'fullPath',
          data () { // 会和全局的data合并到一起
            return { list: [] }
          },
          fetch () { // 插件更新数据时，调用的钩子，必须返回一个Promsie
            return Promise.resolve({ list: [1,2,3] })
          }
        }
      }
    }
  }
})
```
