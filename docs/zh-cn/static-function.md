### 静态方法
- Vuet.mapState 简化组件和Vuet的连接
  ```javascript
  import { mapState } from 'vuet' // 等同于 Vuet.mapState

  export default {
    // ... 选项
    computed: mapState({ '组件注入的名称': '模块的路径' })
    // 同时还支持以下几种写法
    // mapState('test') 等同于  mapState({ test: 'test' })
    // mapState('test', 'test/chlidren') 等同于  mapState({ 'test': 'test/chlidren' })
  }
  ```
- Vuet.mapMixins 向组件混入模块更新的逻辑，Vuet内置了`route`，`once`，`need`，`life`这几种常见的数据更新插件
  ```javascript
  import { mapMixins } from 'vuet' // 等同于 Vuet.mapMixins

  export default {
    // ... 选项
    mixins: mapMixins({ '插件名称': ['更新模块路径'] })
    // 同时还支持以下几种写法
    // mapMixins('插件名称', '更新的模块路径') 等同于 mapMixins({ '插件名称': ['更新模块路径'] })
    // mapMixins('插件名称', ['更新的模块路径']) 等同于 mapMixins({ '插件名称': ['更新模块路径'] })
    // mapMixins({ '插件名称': '更新模块路径' }) 等同于 mapMixins({ '插件名称': ['更新模块路径'] })
  }
  ```
