### 全局更新规则
- route
  - 参数:
    - routeWatch: `String | Array[String]`
      - 默认值: 'fullPath'
      - 描述: 页面发生变化的规则
  - 描述：与`vue-router`模块配合使用，负责统一管理页面切换的状态更新，变化返回请选择this.$route里面的字段
  - 例子:
    ```javascript
    new Vuet({
      modules: {
        list: {
          watch: 'query',
          data () {
            return {
              list: []
            }
          }
        },
        detail: {
          watch: ['params.id'],
          data () {
            return {
              id: null,
              title: null,
              content: null
            }
          }
        }
      }
    })
    ```
- once
  - 描述: 仅在组件的`beforeCreate`钩子中调用一次更新，之后不会再进行更新
- need
  - 描述: 每次都会在组件的`beforeCreate`钩子中调用一次更新
- life
  - 描述: 每次都会在组件的`beforeCreate`钩子中调用一次更新，组件销毁时调用`destroyed`钩子，状态会被重置，恢复到默认状态

### 自定义更新规则
```javascript
import Vuet from 'vuet'

Vuet.rule('myRule', {
  install (Vue, Vuet) {
    // 传入一个Vue和Vuet，比如你可以给Vuet.prototype.xxx 添加方法
  },
  init (vuet) {
    // 接收到当前的vuet实例，你可以在这里初始化程序的一些自定义配置，例如：
    // vuet.__myRule__ = xxx
  },
  destroy (vuet) {
    // 销毁vuet实例调用的钩子
  },
  rule ({ path }) { // 定义数据的更新规则
    // path是当前处理的模块路径
    // 需要返回一个Object对象，将会插入到Vue mixins中
    return {
      beforeCreate () {
        const vuet = this.$vuet // 取得在Vue实例上挂载的Vuet实例
        vuet.fetch(path) // 调用vuet的fetch方法来更新数据
      }
    }
  }
})

```