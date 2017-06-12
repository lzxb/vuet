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