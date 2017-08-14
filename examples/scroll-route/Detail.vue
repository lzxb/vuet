<template>
  <div class="inner">
    <button class="detail-back" @click="$router.go(-1)">Back</button>
    <button class="detail-forward" @click="$router.go(1)">Forward</button>
    <button class="detail-set-window-scroll" @click="setWindowScroll">detail-set-window-scroll</button>
    <button class="detail-set-area-scroll" @click="setAreaScroll">detail-set-area-scroll</button>
    <hr>
    <router-link class="detail-to-list-1" :to="{ name: 'list' }">detail to list 1</router-link>
    <router-link class="detail-to-list-2" :to="{ name: 'list', query: { tid: 2 } }">detail to list 2</router-link>
    <div class="detail-view" v-vuet-scroll.self.window="{ path: 'topic/detail', name: 'detail-view' }">
      <ul>
        <li v-for="item in 1000">{{ item }}</li>
      </ul>
    </div>
  </div>
</template>
<script>
  import { mapRules, mapModules } from 'vuet'

  export default {
    mixins: [
      mapRules({ route: 'topic/detail' }),
      mapModules({ detail: 'topic/detail' })
    ],
    data () {
      return {
        x: window.pageXOffset,
        y: window.pageYOffset
      }
    },
    methods: {
      setWindowScroll () {
        this.$scrollTo(window, {
          x: 30,
          y: 100
        })
      },
      setAreaScroll () {
        this.$scrollTo(document.querySelector('.detail-view'), {
          x: 500,
          y: 500
        })
      }
    }
  }
</script>
<style scoped>
  .inner {
    width: 3000px;
    height: 2000px;
    padding: 200px;
    background: #999;
  }
  .detail-view {
    overflow: auto;
    width: 300px;
    height: 400px;
    padding: 0;
    background: #fff;
  }
  .detail-view ul {
    width: 1000px;
    height: 1000px;
  }
</style>
