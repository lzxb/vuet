<template>
  <div>
    {{ test.count }}
     <button @click="$test.plus">plus</button> 
     <button @click="$test.reduce">reduce</button> 
     <button @click="$test.fetch">fetch</button> 
  </div>
</template>
<script>
  import Vuet from 'vuet'

  export default {
    mixins: [
      Vuet.mapModules({
        test: 'test'
      }),
      Vuet.mapRules({
        test: 'test'
      })
    ]
  }
</script>