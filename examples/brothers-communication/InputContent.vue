<template>
  <div>
    <input class="input" type="text" v-model="test.keyname">
    <div>Input:<span class="input-content">{{ test.keyname }}</span></div>
  </div>
</template>
<script>
  import Vuet, { mapRules, mapModules } from 'vuet'

  export default {
    mixins: [
      mapModules({ test: 'test' })
    ]
  }
</script>
