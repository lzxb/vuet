## Vuet
[![Build Status](https://travis-ci.org/medevicex/vuet.svg?branch=master)](https://travis-ci.org/medevicex/vuet)
[![Known Vulnerabilities](https://snyk.io/test/npm/vuet/badge.svg)](https://snyk.io/test/npm/vuet)
[![npm](https://img.shields.io/npm/v/vuet.svg?style=flat-square)](https://www.npmjs.com/package/vuet) 
[![npm](https://img.shields.io/npm/dt/vuet.svg?style=flat-square)](https://www.npmjs.com/package/vuet)

### What is the Vuet?
Vuet is aimed at managing the status of `Vue.js`. Modular management is its core, and you can choose between updating automatically and regularly and updating by hand to update the status of
the modules. Anyway, it's all up to you.

### Development and test
```bash
npm install
npm run dev # open: http://localhost:3000/
npm run dev:test
```

### Usage
- install
  ```
  npm install vuet --save
  ```
- example
  ```javascript
  import Vue from 'vue'
  import Vuet from 'vuet'

  Vue.use(Vuet)

  const vuet = new Vuet({
    // ... base options
  })

  new Vue({
    // ...
    vuet
  })

  ```


### Full document
- [简体中文](./docs/zh-cn/README.md)

## LICENSE
MIT