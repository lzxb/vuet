<template>
  <div>
    <header>
      <span v-for="(item, $index) in tabs" :key="item.value">
        <router-link :to="{ name: 'index', query: { tab: item.value } }">
          {{ item.label }}
        </router-link>
      </span>
    </header>
    <ul>
      <li v-for="(item, $index) in list.list" :key="item.id">
        <router-link :to="{ name: 'detail', params: { id: item.id } }">
          {{ item.title }}
        </router-link>
      </li>
    </ul>
  </div>
</template>
<script>
  import { mapMixins, mapState } from 'vuet'

  export default {
    mixins: [...mapMixins('cnode/route/list')],
    data () {
      return {
        tabs: [
          {
            label: '全部',
            value: 'all'
          },
          {
            label: '精华',
            value: 'good'
          },
          {
            label: '分享',
            value: 'share'
          },
          {
            label: '问答',
            value: 'ask'
          },
          {
            label: '招聘',
            value: 'job'
          }
        ]
      }
    },
    computed: mapState({ list: 'cnode/route/list' })
  }
</script>
