### 全局更新规则
- life
  - 描述: 每次都会在组件的`beforeCreate`钩子中调用一次更新，组件销毁时调用`destroyed`钩子，状态会被重置，恢复到默认状态
- manual
  - 参数:
    - manuals: `Object{name: String | Function}`
      - 默认值: `$当前模块名称`
      - 描述: 在业务中，我们常常需要各种手动更新状态的操作，manual就是将这种更新的操作集中起来。[点我查看完整例子](../../examples/manual)，另外还允许在调用mapRules方法时重置名字
      - 例子:
      ```javascript
        new Vuet({
          modules: {
            name: 'myTest', // 设置在组件中混入的名字
            test: {
              data () {
                return {
                  count: 0
                }
              },
              manuals: {
                // ... manual会自动加入fetch、reset两个方法，请参照Vuet的实例方法
                plus ({ state, vm, vuet }) {
                  state.count++
                },
                reduce ({ state, vm, vuet }) {
                  state.count--
                }
              }
            }
          }
        })

        mapRules({
          manual: 'test' // this.myTest.xx

          // 同时还支持重置名字，在组件中调用: this.Test.xx
          // manual: [{ path: 'test', name: 'Test' }]

          // 如果模块中没有设置名称，则默认以[`$${模块名称}`]为默认设置，调用: this.$test.xx
          // manual: 'test'
        })
      ```
  - 描述: 这是一种特殊的规则，它无法自动更新数据，它需要你手动调用时才会更新数据
- need
  - 描述: 每次都会在组件的`beforeCreate`钩子中调用一次更新
- once
  - 描述: 仅在组件的`beforeCreate`钩子中调用一次更新，之后不会再进行更新
- route
  - 参数:
    - routeWatch: `String | Array[String]`
      - 默认值: 'fullPath'
      - 描述: 页面发生变化的规则
  - 描述：与`vue-router`模块配合使用，负责统一管理页面切换的状态更新，变化返回请选择this.$route里面的字段，如果页面需要记录滚动条位置的请移步查看[v-route-scroll](./global-directives.md)指令配合使用
  - 例子:
    ```javascript
    new Vuet({
      modules: {
        list: {
          routeWatch: 'query',
          data () {
            return {
              list: []
            }
          }
        },
        detail: {
          routeWatch: ['params.id'],
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