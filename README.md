## Vuet
[![Coverage Status](https://coveralls.io/repos/github/medatc/vuet/badge.svg?branch=dev)](https://coveralls.io/github/medatc/vuet?branch=dev)
[![Build Status](https://travis-ci.org/medatc/vuet.svg?branch=dev)](https://travis-ci.org/medatc/vuet)
[![npm](https://img.shields.io/npm/v/vuet.svg)](https://www.npmjs.com/package/vuet) 
[![npm](https://img.shields.io/npm/dm/vuet.svg)](https://www.npmjs.com/package/vuet)
[![npm](https://img.shields.io/npm/dt/vuet.svg)](https://www.npmjs.com/package/vuet)

### Vuet.js是什么？
在`vuex`中更新状态的唯一途径，就是通过提交`mutation`，这个过程是琐碎，而`Vuet`是允许在何时何地进行直接赋值更新的，这个过程它是愉快的。

### 0.x版本和1.x版本的区别
在0.x版本中，我们内置了太多的功能，导致大幅度提升了入门的门槛，1.x版本则是化繁为简，只保留了几个核心的API

### 快速入门

```javascript

import Vue from 'vue'
import Vuet, { mapModules, mapRules } from 'vuet'

Vue.use(Vuet)

const vuet = new Vuet()
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
  }
})

const App = {
  mixins: [
    mapModules({
      test: 'test' // { 别名： '模块名称' }
    }),
    mapRules({
      once: 'test' // { 规则: ['模块名称'] }
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

## LICENSE
MIT