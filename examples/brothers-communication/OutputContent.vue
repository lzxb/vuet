<template>
  <div>Output:<span class="output-content">{{ test.keyname }}</span></div>
</template>
<script>
  import { mapModules } from 'vuet'

  export default {
    mixins: [
      mapModules({ test: 'test' })
    ]
  }
</script>
