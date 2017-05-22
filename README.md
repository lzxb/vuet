# vuet
简单易用，功能强大Vue 状态管理插件。文档正在更新中

#### 使用须知
程序必须要支持Promise  

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
      route: { // 要使用的插件，这个插件是配合vue-router使用的
        articleList: {
          // 更新数据的规则设置，默认是$route.fullPath
          // 如果有多个条件，可以传入一个数组['query.name', 'params.id']
          watch: 'fullPath',
          data () { // 会和全局的data合并到一起
            return { list: [] }
          },
          fetch () { // 插件更新数据时，调用的钩子，必须返回一个Promsie
            return Promise.resolve([1,2,3])
          }
        }
      }
    }
  }
})

vuet.beforeEach(function ({ store }) {
  store.loading = true
  store.loaded = true
})
vuet.afterEach (function (err, { store }) {
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
import { mapMixins, mapStores } from 'vuet'

export default {
 // ...options
 mixins: [...mapMixins('myModule/route/articleList')], // 向组件注入处理数据的逻辑
 computed: mapStores({ articleList: 'myModule/route/articleList' }), // 使用键值的方式，和数据进行连接
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
// 更新$route.query的参数
this.$vuet.search({
 // 参数
}, 
 false // true是调用this.$router.replace方法更新，false是调用this.$router.query来更新，默认为false
)
```

### 自定义插件
```
const myPlugin = {
 name: 'myPlugin', // 插件的名称
 install (Vue, Vuet) {
  // ...调用Vuet.use()方法时会执行
 },
 mixin (path) { // 会传入一个模块路径的参
  return {
   // ....options，你可以根据自己的需求，定义数据的处理方式
   created () {
    console.log(this._options.modules[path]) // 取得当前模块的配置
    console.log(this.getState(path)) // 取得当前模块的状态
   }
  }
 }
}
```
