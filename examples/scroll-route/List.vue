<template>
  <div class="inner">
    {{ list.$scroll }}
    <button class="list-back" @click="$router.go(-1)">Back</button>
    <button class="list-forward" @click="$router.go(1)">Forward</button>
    <button class="list-set-window-scroll" @click="setWindowScroll">list-set-window-scroll</button>
    <button class="list-set-area-scroll" @click="setAreaScroll">list-set-area-scroll</button>
    <hr>
    <router-link class="list-to-detail-1" :to="{ name: 'detail', params: { id: 1 } }">list-to-detail-1</router-link>
    <router-link class="list-to-detail-2" :to="{ name: 'detail', params: { id: 2 } }">list-to-detail-2</router-link>
    <div class="list-view" v-vuet-scroll.self.window="{ path: 'topic/list', name: 'list-view' }">
      <ul>
        <li v-for="item in 1000">
            <router-link :to="{ name: 'detail', params: { id: item } }">{{ item }}</router-link>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import { mapRules, mapModules } from 'vuet'

  export default {
    mixins: [
      mapRules({ route: 'topic/list' }),
      mapModules({ list: 'topic/list' })
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
        this.$scrollTo(document.querySelector('.list-view'), {
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
  .list-view ul {
    width: 1000px;
    height: 1000px;
  }
</style>
