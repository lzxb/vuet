<template>
  <div class="inner" v-route-scroll.window="{ path: 'test', window: test.windowScrolls }">
    <header>
      <h2>route-scroll-sync</h2>
      <hr>
      <div class="window">
        <button @click="$test.windowTo">windowTo</button>
        <span class="x">{{ test.windowScrolls.x }}</span> -- <span class="y">{{ test.windowScrolls.y }}</span>
      </div>
      <hr>
      <div class="area">
        <button @click="$test.areaTo">areaTo</button>
        <span class="x">{{ test.areaScrolls.x }}</span> -- <span class="y">{{ test.areaScrolls.y }}</span>
      </div>
      <hr>
    </header>
    <div class="view">
      <ul v-route-scroll="{ path: 'test', name: 'list-view', self: test.areaScrolls }">
        <li v-for="num in 500">
          {{ num }}
          {{ num }}
          {{ num }}
          {{ num }}
          {{ num }}
          {{ num }}
        </li>
      </ul>
      <ul v-route-scroll="{ path: 'test', name: 'list-view', self: test.areaScrolls }">
        <li v-for="num in 500">
          {{ num }}
          {{ num }}
          {{ num }}
          {{ num }}
          {{ num }}
          {{ num }}
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import { mapRules, mapModules } from 'vuet'

  export default {
    mixins: [
      mapRules({
        route: 'test',
        manual: 'test'
      }),
      mapModules({ test: 'test' })
    ]
  }
</script>
<style scoped>
  .inner {
    width: 5000px;
    height: 5000px;
    padding-top: 200px;
  }
  header {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: 999;
    background: #ddd;
  }
  .view {
    display: flex;
  }
  ul {
    overflow: auto;
    width: 400px;
    height: 600px;
    padding: 0;
    margin: 0 30px;
    border: 1px solid #ddd;
  }
  ul li {
    width: 600px;
    padding: 0 15px;
    line-height: 38px;
    border-bottom: 1px solid #ddd;
    text-align: center;
    list-style: none;
  }
  ul li:last-of-type {
    border: none;
  }
</style>