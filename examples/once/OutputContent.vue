<template>
  <div>
    {{ test.count }}
  </div>
</template>
<script>
  import Vuet, { mapRules, mapModules } from 'vuet'

  export default {
    mixins: mapRules('once', 'test'),
    computed: mapModules({ test: 'test' })
  }
</script>
