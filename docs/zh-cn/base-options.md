### 基本选项
- **data**
  - 类型: `Function`
  - 返回值: `Object`
  - 默认值: `{}`
  - 描述: 所有的模块状态，都会调用data方法，将返回的对象合并到一起
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