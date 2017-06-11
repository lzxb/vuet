<template>
  <div class="inner">
    <div class="list-window-window-scroll-x">{{ x }}</div>
    <div class="list-window-window-scroll-y">{{ y }}</div>
    <button class="list-set-window-scroll" @click="setWindowScroll">Set window scroll</button>
    <button class="list-set-area-scroll" @click="setAreaScroll">Set area scroll</button>
    <hr>
    <router-link class="list-to-detail-1" :to="{ name: 'detail', params: { id: 1 } }">list-to-detail-1</router-link>
    <router-link class="list-to-detail-2" :to="{ name: 'detail', params: { id: 2 } }">list-to-detail-2</router-link>
    <div class="list-view" v-route-scroll.self.window="{ path: 'topicList', name: 'list-view' }">
      <div></div>
    </div>
  </div>
</template>
<script>
  import { mapRules, mapModules } from 'vuet'
  import { scrollTo } from 'vuet/rules/route/route-scroll'

  export default {
    mixins: [
      mapRules({ route: 'topicList' }),
      mapModules({ list: 'topicList' })
    ],
    data () {
      return {
        x: window.pageXOffset,
        y: window.pageYOffset
      }
    },
    created () {
      this.windowScroll = () => {
        this.x = window.pageXOffset
        this.y = window.pageYOffset
      }
      window.addEventListener('scroll', this.windowScroll, false)
    },
    beforeDestroy () {
      window.removeEventListener('scroll', this.windowScroll, false)
    },
    methods: {
      setWindowScroll () {
        scrollTo(window, {
          x: 30,
          y: 200
        })
      },
      setAreaScroll () {
        scrollTo(document.querySelector('.list-view'), {
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
  .list-view {
    overflow: auto;
    width: 300px;
    height: 400px;
    padding: 0;
    background: #fff;
  }
  .list-view div {
    width: 1000px;
    height: 1000px;
  }
</style>
