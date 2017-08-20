## vuet-store
[![Coverage Status](https://coveralls.io/repos/github/medatc/vuet/badge.svg?branch=dev)](https://coveralls.io/github/medatc/vuet?branch=dev)
[![Build Status](https://travis-ci.org/medatc/vuet.svg?branch=dev)](https://travis-ci.org/medatc/vuet)
[![npm](https://img.shields.io/npm/v/vuet-store.svg)](https://www.npmjs.com/package/vuet-store) 
[![npm](https://img.shields.io/npm/dm/vuet-store.svg)](https://www.npmjs.com/package/vuet-store)
[![npm](https://img.shields.io/npm/dt/vuet-store.svg)](https://www.npmjs.com/package/vuet-store)


## 它是做什么的？
它能够监模块变化，使用`localStorage`存储模块状态，等下次用户访问时，再从`localStorage`中取出状态，适合存储用户登录状态等。


## 安装
```bash
npm install --save vuet-store
```


## 使用
```javascript
import Vue from 'vue'
import Vuet, { mapModules, mapRules } from 'vuet'
import VuetStore from 'vuet-store'

Vue.use(Vuet)
Vuet.rule('store', VuetStore)

const vuet = new Vuet()
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
  }
})

const App = {
  mixins: [
    mapModules({
      test: 'test' // { 别名： '模块路径' }
    }),
    mapRules({
      store: [{ path: 'test' }] // { 规则: ['模块路径'] }
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
