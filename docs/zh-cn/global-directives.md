### 全局指令
- **v-vuet-scroll**
  - 描述: Vuet模块系统和Vue深度集成的滚动条双向绑定，可以轻易实现各种复杂的滚动条管理，另外`route`规则在页面切换时，会重置模块的滚动条状态，[cnode社区例子请看](../../examples/scroll-cnode)
  - 修饰符  
    `window` 绑定到window滚动条上
    ```html
    
      <div v-vuet-scroll.window="{ path: '....' }"></div>

    ```
    `self`  绑定到元素自身的内部滚动条，默认绑定元素内部滚动条

    ```html

      <div v-vuet-scroll.self="{ path: '...', name: '...' }"></div>

    ```

    - 参数  
    `path` Vuet的模块路径，必传参数  
    `name` 绑定`self`时，为必传参数  
    `self` 绑定元素内部的滚动条位置
    `window` 绑定`window`滚动条的位置

    ```html

    <div v-vuet-scroll.window.self="{ path: '...', name: '...', self: { x: 0, y: 0 }, window: { x: 0, y: 0 } }"></div>

    ```
