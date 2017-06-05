[![Build Status](https://travis-ci.org/medevicex/vuet.svg?branch=master)](https://travis-ci.org/medevicex/vuet)
[![Known Vulnerabilities](https://snyk.io/test/npm/vuet/badge.svg)](https://snyk.io/test/npm/vuet)
[![npm](https://img.shields.io/npm/v/vuet.svg?style=flat-square)](https://www.npmjs.com/package/vuet) 
[![npm](https://img.shields.io/npm/dt/vuet.svg?style=flat-square)](https://www.npmjs.com/package/vuet)

### vuet是什么？
vuet是一个专门为Vue.js应用程序开发的**状态管理模式**，它与vuex不同，它没有action更新的概念，它由定制的规则来更新状态，也可以在任何地方手动更新状态，放下一切包袱，只是为了敏捷开发而生  
`state => view `  
`view[注入更新规则 | 手动更新] => state`

### 安装
```
npm install vuet
```

### 使用
```javascript
import Vue from 'vue'
import Vuet from 'vuet'

Vue.use(vuet)

const vuet = new Vuet({
  // ...
})

new Vue({
  // ...
  vuet
})

```

### 选项
- **data**
  - 类型: `Function`
  - 返回值: `Object`
  - 默认值: `{}`
  - 描述: 所有的模块状态，都会调用data方法，将返回的对象合并到一起

- **pathJoin**

  - 类型: `String`
  - 默认值: `/`
  - 描述: 父子模块之间的路径分隔符

- **modules**
  - 类型: `Object`
  - 默认值: `{}`
  - 描述: 程序会递归遍历，发现一个`Object`对象里面包含了一个`data`方法，则会被认为是一个模块
  - 例子:
    ```javascript
    new Vuet({
      modules: {
        myModule: {
          // ...模块选项
          data () {
            return {
              // ...
            }
          },
          chlidrenModule: {
            // ...模块选项
            data () {
              return {
                // ...
              }
            }
          }
        },
      }
    })
    ```

### 模块选项

- **data**
  - 类型: `Function`
  - 返回值: `Object`
  - 描述: 定义一个模块状态的初始值，它和全局选项中`data`方法的返回值合并到一起
  - 例子:
    ```javascript
    const vuet = new Vuet({
      data () {
        return {
          loading: true
        }
      },
      modules: {
        myModule: {
          data () {
            return {
              count: 0
            }
          }
        }
      }
    })
    vuet.getState('myModule') // { loading:true, count: 0 }
    ```

- **fetch**
  - 类型: `Function`
  - 返回值: `Promise`
  - 描述: 向服务器请求模块的数据
  - 例子:
    ```javascript
    const vuet = new Vuet({
      modules: {
        myModule: {
          data () {
            return {
              count: 0
            }
          },
          fetch () {
            return Promise.resolve({
              count: 100
            })
          }
        }
      }
    })
    vuet
      .fetch('myModule')
      .then((store) => {
        console.log(store) // { count: 100 }
      })
    ```

 - **routeWatch**
    - 类型: `String | Array`
    - 描述: `route插件时有效配合vue-router是有效`，定义了页面改变的规则，更多的规则可以插件vue-router的route对象
    - 例子:
      ```javascript
      const vuet = new Vuet({
        modules: {
          list: {
            // ...
            routeWatch: 'query'
          },
          detail: {
            // ...
            routeWatch: ['params.id']
          }
        }
      })
      ```