<template>
  <div class="inner">
    <div class="detail-window-window-scroll-x">{{ pageXOffset }}</div>
    <div class="detail-window-window-scroll-y">{{ pageYOffset }}</div>
    <button class="detail-set-window-scroll" @click="setWindowScroll">Set window scroll</button>
    <button class="detail-set-area-scroll" @click="setAreaScroll">Set area scroll</button>
    <hr>
    <router-link class="detail-to-list-1" :to="{ name: 'list' }">detail to list 1</router-link>
    <router-link class="detail-to-list-2" :to="{ name: 'list', query: { tid: 2 } }">detail to list 2</router-link>
    <div class="detail-view" v-route-scroll.self.window="{ path: 'topicDetail', name: 'detail-view' }">
      <div></div>
    </div>
  </div>
</template>
<script>
  import { mapRules, mapModules } from 'vuet'
  import { scrollTo } from 'vuet/rules/route/route-scroll'

  export default {
    mixins: [
      mapRules({ route: 'topicDetail' }),
      mapModules({ detail: 'topicDetail' })
    ],
    data () {
      return {
        pageXOffset: window.pageXOffset,
        pageYOffset: window.pageYOffset
      }
    },
    created () {
      this.windowScroll = () => {
        this.pageXOffset = window.pageXOffset
        this.pageYOffset = window.pageYOffset
      }
      window.addEventListener('scroll', this.windowScroll, false)
    },
    beforeDestroy () {
      window.removeEventListener('scroll', this.windowScroll, false)
    },
    methods: {
      setWindowScroll () {
        scrollTo(window, {
          scrollTop: 200,
          scrollLeft: 30
        })
      },
      setAreaScroll () {
        scrollTo(document.querySelector('.detail-view'), {
          scrollTop: 500,
          scrollLeft: 500
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
  .detail-view div {
    width: 1000px;
    height: 1000px;
  }
</style>
