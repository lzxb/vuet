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
  - 描述: 仅在组件的`beforeCreate`钩子中调用一次，之后都不会向服务器发起请求更新
- need
  - 描述: 每次都会在组件的`beforeCreate`钩子中调用一次
- life
  - 描述: 每次都会在组件的`beforeCreate`钩子中调用一次，组件销毁时调用`destroyed`钩子，状态会被重置