<template>
  <div>
    {{ test.count }}
  </div>
</template>
<script>
  import Vuet, { mapMixins, mapState } from 'vuet'

  export default {
    mixins: mapMixins('life', 'test'),
    computed: mapState('test')
  }
</script>
