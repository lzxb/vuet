### 全局指令
- **v-route-scroll**
  - 描述: 配合[route规则](./global-update-rules.md)使用的指令，可以记录页面中的滚动条，在页面后退时还原滚动条位置，支持`全局滚动条`和`元素自身滚动条`的记录和还原。[本地例子请看](../../examples/route-scroll)
  - 例子:
    ```html
    <template>
      <div>
        <!-- 默认记录元素自身的滚动条，因为可能会记录多个元素，所以必须要给这个滚动条设置一个名字，不可重复 -->
        <div v-route-scroll="{ path: '模块路径', name: 'name-1' }"></div>
        <!-- 记录全局滚动条 ，则需要要传入模块路径，并且设置`window`修饰符 -->
        <div v-route-scroll.window="{ path: '模块路径' }"></div>
        <!-- 如果需要同时记录全局滚动条和元素自身的滚动条，同时设置`self`和`window`修饰符 -->
        <div v-route-scroll.self.window="{ path: '模块路径', name: 'name-2' }"></div>
        <!-- 滚动条位置和数据进行绑定 -->
        <div v-route-scroll.self.window="{ path: '模块路径', name: 'name-2', self: { x: 0, y: 0 }, window: { x: 0, y: 0 } }"></div>
      </div>
    </template>
    <script>
      import { mapRules } from 'vuet'
      export default {
        mixins: [
          // 千万不要忘了把模块设置到route规则设置到组件中，否则页面切换滚动条对应的变化不会操作的！！！
          mapRules({ route: '模块路径' })
        ]
      }
    </script>
    ```