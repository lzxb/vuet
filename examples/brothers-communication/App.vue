<template>
  <div>
    <h2>brothers-communication</h2>
    <div>Root:<span class="root-content">{{ test.keyname }}</span></div>
    <button @click="show = !show">switch</button>
    <input-content></input-content>
    <output-content v-if="show"></output-content>
  </div>
</template>
<script>
  import { mapModules } from 'vuet'
  import OutputContent from './OutputContent'
  import InputContent from './InputContent'
  
  export default {
    components: { OutputContent, InputContent },
    mixins: [
      mapModules({ test: 'test' })
    ],
    data () {
      return {
        show: true
      }
    }
  }
</script>
