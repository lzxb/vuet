<template>
  <div>
    {{ test.count }}
  </div>
</template>
<script>
  import { mapRules, mapModules } from 'vuet'

  export default {
    mixins: [
      mapRules({ life: 'test' }),
      mapModules({ test: 'test' })
    ]
  }
</script>