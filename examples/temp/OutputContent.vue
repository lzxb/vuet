<template>
  <div>
    {{ test.count }}
  </div>
</template>
<script>
  import { mapRules, mapModules } from 'vuet'

  export default {
    mixins: [
      mapRules({ temp: 'test' }),
      mapModules({ test: 'test' })
    ]
  }
</script>