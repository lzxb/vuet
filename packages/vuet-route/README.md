## vuet-route
[![npm](https://img.shields.io/npm/v/vuet-route.svg)](https://www.npmjs.com/package/vuet-route) 
[![npm](https://img.shields.io/npm/dm/vuet-route.svg)](https://www.npmjs.com/package/vuet-route)
[![npm](https://img.shields.io/npm/dt/vuet-route.svg)](https://www.npmjs.com/package/vuet-route)


## 它是做什么的？
它能在路由变化时，自动获取数据，重置页面状态


## 安装
```bash
npm install --save vuet-route
```


## 使用
```javascript
import Vuet from 'vuet'
import VuetRoute from 'vuet-route'

Vuet.rule('route', VuetRoute) // 注意：规则的注册必须在所有组件执行之前

const vuet = new Vuet({
  modules: {
    test: {
      data () {
        return {
          list: []
        }
      },
      route: {
        once: true, // 第一次加载成功后，是否还请求数据，true请求数据，false不请求数据，默认为true
        watch: ['query'], // 监听路由变化，重置页面状态，默认为fullPath
        fetch () {
          this.app.$route // 取得路由对象，你可以在这里发起http请求
          setInterval(() => {
            this.state.list = [...]
          }, 1000)
        }
      }
    }
  }
})
```