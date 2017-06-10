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
