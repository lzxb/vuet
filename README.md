[![Build Status](https://travis-ci.org/medevicex/vuet.svg?branch=master)](https://travis-ci.org/medevicex/vuet)
[![Known Vulnerabilities](https://snyk.io/test/npm/vuet/badge.svg)](https://snyk.io/test/npm/vuet)
[![npm](https://img.shields.io/npm/v/vuet.svg?style=flat-square)](https://www.npmjs.com/package/vuet) 
[![npm](https://img.shields.io/npm/dt/vuet.svg?style=flat-square)](https://www.npmjs.com/package/vuet)

### What is the Vuet?
Vuet is a agile management mode for Vue.js application development, it is different from vuex, it has no concept of action update, it consists of customized rules to update the status, also can be in any place to manually update the status  
`state => view `  
`view[Injection update rule | Manual update] => state`

### Install
```
npm install vuet
```

### Use
```javascript
import Vue from 'vue'
import Vuet from 'vuet'

Vue.use(Vuet)

const vuet = new Vuet({
  // ... options
})

new Vue({
  // ...
  vuet
})

```
### Full document
- [简体中文](./docs/zh-cn/index.md)