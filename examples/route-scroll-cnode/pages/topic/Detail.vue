<template>
  <div v-route-scroll.window="{ path: 'topic-detail' }">
    <h3>{{ detail.data.title }}</h3>
    <div v-html="detail.data.content"></div>
  </div>  
</template>
<script>
  import { mapRules, mapModules } from 'vuet'

  export default {
    mixins: [
      mapRules({
        route: 'topic-detail'
      }),
      mapModules({
        detail: 'topic-detail'
      })
    ]
  }
</script>
<style scoped>

</style>
