<template>
  <div>
    <h2>once</h2>
    <div class="count">{{ test.count }}</div>
    <div class="fetch-count">{{ test.fetchCount }}</div>
    <button @click="show = !show">switch</button>
    <output-content v-if="show"></output-content>
  </div>
</template>
<script>
  import { mapModules } from 'vuet'
  import OutputContent from './OutputContent'

  export default {
    components: { OutputContent },
    mixins: [
      mapModules({ test: 'test' })
    ],
    data () {
      return {
        show: false
      }
    }
  }
</script>
