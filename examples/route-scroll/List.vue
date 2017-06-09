<template>
  <div class="inner">
    <header>
      <span v-for="(item, $index) in types" :key="item.value">
        <router-link :to="{ name: 'index', query: { type: item.value } }">
          {{ item.label }}
        </router-link>
      </span>
    </header>
    <ul id="list" v-route-scroll="'topicList'">
      <li style="height: 50px;"></li>
      <li v-for="(item, $index) in list.list" :key="item.id">
        <router-link :to="{ name: 'detail', params: { id: item.id } }">{{ item.title }}</router-link>
      </li>
      <li style="height: 50px;"></li>
    </ul>
  <div class="fetch-count">{{ list.fetchCount }}</div>
  </div>
</template>
<script>
  import { mapRules, mapModules } from 'vuet'

  export default {
    mixins: [
      mapRules({ route: 'topicList' }),
      mapModules({ list: 'topicList' })
    ],
    data () {
      return {
        types: [
          {
            label: 'All',
            value: 'all'
          },
          {
            label: 'Good',
            value: 'good'
          },
          {
            label: 'Share',
            value: 'share'
          },
          {
            label: 'Job',
            value: 'job'
          }
        ]
      }
    }
  }
</script>
<style scoped>
  .inner {
    height: 2000px;
    padding: 200px;
    background: #999;
  }
  ul {
    overflow: auto;
    width: 300px;
    height: 400px;
    padding: 0;
    background: #fff;
  }
  li {
    width: 600px;
    height: 200px;
    list-style: none;
  }
  li a {
    display: block;
    padding: 20px;
    margin: 5px;
    color: #fff;
    background: #222;
  }
</style>
