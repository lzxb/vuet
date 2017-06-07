<template>
  <div>Output:<span class="output-content">{{ test.keyname }}</span></div>
</template>
<script>
  import Vuet, { mapRules, mapModules } from 'vuet'

  export default {
    computed: mapModules({ test: 'test' })
  }
</script>
