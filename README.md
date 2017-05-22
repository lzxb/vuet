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
  data () {
    return { loading: true, loaded: true }
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

new Vuew({
  vuet
})

```
