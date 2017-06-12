### 全局方法
- `Vuet.mapModules(any)`
  - 描述: 组件和Vuet的模块连接起来
  - 返回值: `Object`
  - 例子:
    ```javascript
    import { mapModules } from 'vuet' // 等同于 Vuet.mapModules

    export default {
      // ... 选项
      mixins: [
        mapModules({ '组件注入的名称': '模块的路径' })
      ]
      // 同时还支持以下几种写法
      // mapModules('test') 等同于  mapModules({ test: 'test' })
      // mapModules('test', 'test/chlidren') 等同于  mapModules({ 'test': 'test/chlidren' })
    }
    ```
- `Vuet.mapRules(any)`
  - 描述: 向组件混入模块更新的规则，Vuet内置了`route`，`once`，`need`，`life`这几种常见的数据[更新规则](./global-update-rules.md)
  - 返回值: `Object`
  - 例子:
    ```javascript
    import { mapRules } from 'vuet' // 等同于 Vuet.mapRules

    export default {
      // ... 选项
      mixins: [
        // 完整写法
        mapRules({ '规则名称': [{ path: '更新模块路径' }] })
      ]
      // 同时还支持以下几种简写
      // mapRules('规则名称', '更新的模块路径') 等同于 mapRules({ '规则名称': [{ path: '更新模块路径' }] })
      // mapRules('规则名称', ['更新的模块路径']) 等同于 mapRules({ '规则名称': [{ path: '更新模块路径' }] })
      // mapRules({ '规则名称': '更新模块路径' }) 等同于 mapRules({ '规则名称': [{ path: '更新模块路径' }] })
    }
    ```
- `Vuet.rule(name: String, rule: Object)`
  - 描述: 自定义更新规则，[相关的例子请点击这里](./global-rules.md#自定义更新规则)
  - 返回值: `this`