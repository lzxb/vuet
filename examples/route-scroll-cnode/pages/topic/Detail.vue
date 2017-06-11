<template>
  <!-- 设置指令监听全局滚动条 -->
  <div v-route-scroll.window="{ path: 'topic-detail' }">
    <h3>{{ detail.data.title }}</h3>
    <div v-html="detail.data.content"></div>
  </div>  
</template>
<script>
  import { mapRules, mapModules } from 'vuet'

  export default {
    mixins: [
      // 设置模块的更新规则
      mapRules({
        route: 'topic-detail'
      }),
      // 连接模块的状态
      mapModules({
        detail: 'topic-detail'
      })
    ]
  }
</script>
<style scoped>

</style>
