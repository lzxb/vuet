# vuet
简单易用，功能强大Vue 状态管理插件。文档正在更新中

### 使用须知
程序必须要支持Promise  

### 介绍
vuet是一个跨页面、跨组件的状态管理插件，提供了模块化的数据管理，可以自定义mixin来维护模块的数据以及和服务器之间的通信、如何在本地进行更新。

### 快速上手
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
        ArticleList: {
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
