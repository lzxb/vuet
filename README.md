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

Vue.use(Vuet)

const vuet = new Vuet({
  // ... 选项
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
  - 描述: 程序会递归遍历，如果对象`Object`里面包含了一个`data`方法，则会被认为是一个模块
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
    - 描述: `vuet route插件时有效配合vue-router时有效`，定义了页面改变的规则，更多的规则可以插件vue-router的route对象
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

### Vuet实例属性
- **store**
  - 类型: `只读`
  - 描述: 所有的模块状态存储在这里

- **beforeHooks**
  - 类型: `只读`
  - 描述: 在调用实例的fetch方法之前，会调用里面的钩子

- **afterHooks**
  - 类型: `只读`
  - 描述: 在调用实例的fetch方法之后，会调用里面的钩子

- **app**
  - 类型: `只读`
  - 描述: Vuet实例挂载到vue应用程序中的根组件

- **options**
  - 类型: `只读`
  - 描述: Vuet实例初始化时，传入的选项

- **_options**
  - 类型: `只读`
  - 描述: 根据传入的选项，生成全局和模块的选项

- **vm**
  - 类型: `只读`
  - 描述: Vuet内部的Vue实例

### Vuet实例方法
- `beforeEach(fn: Function)`  
  - 返回值: this
  - 参数: 
    - `fn` 要执行的方法，必选参  
  - 描述: 每次组件实例fetch方法调用之前执行钩子
  - 例子: 
    ```javascript
    const vuet = new Vuet({
      // ... 选项
    })
    vuet.beforeEach(({ path, params, state }) => {
      console.log(path) // 当前更新的模块路径
      console.log(params) // 组件实例fetch方法传入的自定义参数
      console.log(state) // 当前更新的模块状态
    })
    ```
- `afterEach(fn: Function)`  
  - 参数: 
    - `fn` 要执行的方法，必选参  
  - 返回值: this
  - 描述: 每次组件实例fetch方法调用之后执行ch钩子
  - 例子: 
    ```javascript
    const vuet = new Vuet({
      // ... 选项
    })
    vuet.beforeEach((err, { path, params, state }) => {
      console.log(err) // 如果请求失败，会传入错误的信息
      console.log(path) // 当前更新的模块路径
      console.log(params) // 组件实例fetch方法传入的自定义参数
      console.log(state) // 当前更新的模块状态
    })
    ```
- `getState(path: String)`  
  - 参数: 
    - `path` 模块的路径，必选参  
  - 返回值: Object
  - 描述: 获取某个模块的状态
  - 例子: 
    ```javascript
    const vuet = new Vuet({
      // ... 选项
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
    vuet.getState('myModule') // { count: 0 }
    ```
- `setState(path: String, newState: Object)`  
  - 参数: 
    - `path` 模块的路径，必选参  
    - `newState` 新的状态，必选参
  - 返回值: this
  - 描述: 设置某个模块的状态
  - 例子: 
    ```javascript
    const vuet = new Vuet({
      // ... 选项
      modules: {
        myModule: {
          data () {
            return {
              count: 0,
              text: 'ok'
            }
          }
        }
      }
    })
    vuet
      .setState('myModule', { count: 100 })
      .getState('myModule') // { count: 100, text: 'ok' }
    ```
- `fetch(path: String, params: Object, setStateBtn: true)`  
  - 参数:   
    - `path` 模块的路径，必选参  
    - `params` 自定义参数，在`beforeEach`和`afterEach`钩子中接收到，可选参，默认为`{}`
    - `setStateBtn` 请求成功后，是否自动设置状态，如果为false，则会直接返回fetch请求回来的对象，而不是模块的状态，可选参，默认为`true`
  - 返回值: Promise
  - 描述: 向服务器取得数据更新
- `destroy()`  
  - 描述: 销毁vuet，释放内存

### 辅助方法
- mapState 简化组件和Vuet的连接
  ```javascript
  import { mapState } from 'vuet'

  export default {
    // ... 选项
    computed: mapState({ '组件注入的名称': '模块的路径' })
    // 同时还支持以下几种写法
    // mapState('test') 等同于  mapState({ test: 'test' })
    // mapState('test', 'test/chlidren') 等同于  mapState({ 'test': 'test/chlidren' })
  }
  ```
- mapMixins 向组件混入模块更新的逻辑，Vuet内置了`route`，`once`，`need`，`life`这几种常见的数据更新插件
  ```javascript
  import { mapMixins } from 'vuet'

  export default {
    // ... 选项
    mixins: mapMixins({ '插件名称': ['更新模块路径'] })
    // 同时还支持以下几种写法
    // mapMixins('插件名称', '更新的模块路径') 等同于 mapMixins({ '插件名称': ['更新模块路径'] })
    // mapMixins('插件名称', ['更新的模块路径']) 等同于 mapMixins({ '插件名称': ['更新模块路径'] })
    // mapMixins({ '插件名称': '更新模块路径' }) 等同于 mapMixins({ '插件名称': ['更新模块路径'] })
  }
  ```
