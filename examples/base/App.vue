<template>
  <div>
    {{ test.count }}
     <button @click="$test.plus">plus</button> 
     <button @click="$test.reduce">reduce</button> 
     <button @click="$test.fetch">fetch</button> 
     <button @click="$test.reset">reset</button> 
  </div>
</template>
<script>
  import { mapModules } from 'vuet'

  export default {
    mixins: [
      mapModules({
        test: 'test'
      })
    ]
  }
</script>