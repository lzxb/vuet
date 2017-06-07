<template>
  <div>
    {{ test.count }}
  </div>
</template>
<script>
  import Vuet, { mapRules, mapModules } from 'vuet'

  export default {
    mixins: mapRules('need', 'test'),
    computed: mapModules({ test: 'test' })
  }
</script>
