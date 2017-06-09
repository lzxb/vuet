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
