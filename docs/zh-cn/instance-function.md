### Vuet实例方法
- `beforeEach(fn: Function)`  
  - 返回值: `this`
  - 参数: 
    - `fn` 要执行的方法，必选参  
  - 描述: 每次组件实例fetch方法调用之前执行钩子
  - 例子: 
    ```javascript
    const vuet = new Vuet({
      // ... 选项
    })
    vuet.beforeEach(({ path, params, state, route }) => {
      console.log(path) // 当前更新的模块路径
      console.log(params) // 组件实例fetch方法传入的自定义参数
      console.log(state) // 当前更新的模块状态
      console.log(route) // 当前路由信息
    })
    ```
- `afterEach(fn: Function)`  
  - 参数: 
    - `fn` 要执行的方法，必选参  
  - 返回值: `this`
  - 描述: 每次组件实例fetch方法调用之后执行ch钩子
  - 例子: 
    ```javascript
    const vuet = new Vuet({
      // ... 选项
    })
    vuet.beforeEach((err, { path, params, state, route }) => {
      console.log(err) // 如果请求失败，会传入错误的信息
      console.log(path) // 当前更新的模块路径
      console.log(params) // 组件实例fetch方法传入的自定义参数
      console.log(state) // 当前更新的模块状态
      console.log(route) // 当前路由信息
    })
    ```
- `getState(path: String)`  
  - 参数: 
    - `path` 模块的路径，必选参  
  - 返回值: `Object`
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
  - 返回值: `this`
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
  - 返回值: `Promise`
  - 描述: 向服务器取得数据更新
- `destroy()`  
  - 描述: 销毁vuet，释放内存

### Vue组件内注入Vuet实例属性
```javascript
import Vue from 'vue'
import Vuet from 'vuet'

Vue.use(Vuet)

const vuet = new Vuet({
  // ... base options
})

new Vue({
  // ...
  vuet,
  created () {
    //this.$vuet.xxx
  }
})
```