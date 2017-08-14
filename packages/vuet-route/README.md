## vuet-route


## 它是做什么的？
它能绑定在路由变化时，自动获取数据，重置页面状态


## 安装
```bash
npm install --save vuet-route
```


## 使用
```javascript
import Vuet from 'vuet'
import VuetRoute from 'vuet-route'

Vuet.rule('route', VuetRoute)

const vuet = new Vuet({
  modules: {
    test: {
      data () {
        return {
          list: []
        }
      },
      route: {
        watch: ['query'] // 监听路由变化，重置页面状态
        fetch () {
          setInterval(() => {
            this.state.list = [...]
          }, 1000)
        }
      }
    }
  }
})
```