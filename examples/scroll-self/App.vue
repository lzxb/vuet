<template>
  <div>
    <header>
      <button v-for="item in names" @click="test.active = item" :class="item">{{ item }}</button>
    </header>
    <span class="x">{{ scrolls.x }}</span>,
    <span class="y">{{ scrolls.y }}</span>
    <div class="view" v-route-scroll="{ path: 'test', name: this.test.active, self: scrolls }">
      <div class="inner">
        </div>
    </div>
  </div>
</template>
<script>
  import { mapModules, mapRules } from 'vuet'

  export default {
    mixins: [
      mapModules({ test: 'test' })
    ],
    data () {
      return {
        names: ['view-1', 'view-2', 'view-3']
      }
    },
    computed: {
      scrolls () {
        return this.test.scrolls[this.test.active]
      }
    }
  }
</script>
<style scoped>
  header button {
    margin: 10px;
  }
  .view {
    overflow: auto;
    width: 400px;
    height: 400px;
    border: 1px solid #ddd;
  }
  .view .inner {
    width: 800px;
    height: 800px;
  }
</style>

