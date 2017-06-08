<template>
  <div>
    {{ test.count }}
  </div>
</template>
<script>
  import Vuet, { mapRules, mapModules } from 'vuet'

  export default {
    mixins: [
      mapRules({ once: 'test' }),
      mapModules({ test: 'test' })
    ]
  }
</script>
