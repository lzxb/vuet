<template>
  <div>
    <h2>once</h2>
    <div class="count">{{ test.count }}</div>
    <div class="fetch-count">{{ test.fetchCount }}</div>
    <button @click="show = !show">switch</button>
    <update v-if="show"></update>
  </div>
</template>
<script>
  import { mapModules } from 'vuet'
  import Update from './Update'

  export default {
    components: { Update },
    computed: mapModules('test'),
    data () {
      return {
        show: false
      }
    }
  }
</script>
