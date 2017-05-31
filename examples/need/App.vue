<template>
  <div>
    <h2>need</h2>
    <div>{{ test.count }}</div>
    <button @click="show = !show">switch</button>
    <update v-if="show"></update>
  </div>
</template>
<script>
  import { mapState } from 'vuet'
  import Update from './Update'

  export default {
    components: { Update },
    computed: mapState('test'),
    data () {
      return {
        show: false
      }
    }
  }
</script>
