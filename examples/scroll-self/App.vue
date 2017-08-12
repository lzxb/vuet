<template>
  <div>
    {{ scroll }}
    <div class="view" v-vuet-scroll="{ path: 'test', name: 'content' }">
      <div class="content">
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    computed: {
      scroll () {
        return this.$vuet.getState('test')
      }
    }
  }
</script>
<style scoped>
  .view {
    overflow: scroll;
    width: 300px;
    height: 300px;
    border: 1px solid #ddd;
  }
  .view .content {
    width: 1000px;
    height: 3000px;
    background: #eee;
  }
</style>