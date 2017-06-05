<template>
  <div>
    <header>
      <span v-for="(item, $index) in types" :key="item.value">
        <router-link :to="{ name: 'index', query: { type: item.value } }">
          {{ item.label }}
        </router-link>
      </span>
    </header>
    <ul>
      <li v-for="(item, $index) in list.list" :key="item.id">
        <router-link :to="{ name: 'detail', params: { id: item.id } }">{{ item.title }}</router-link>
      </li>
    </ul>
  <div class="fetch-count">{{ list.fetchCount }}</div>
  </div>
</template>
<script>
  import { mapMixins, mapState } from 'vuet'

  export default {
    mixins: [...mapMixins({ route: 'topic/list' })],
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
    },
    computed: mapState({ list: 'topic/list' })
  }
</script>
