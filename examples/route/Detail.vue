<template>
  <div>
    <button @click="$router.go(-1)">Back</button>
    <h2>{{ detail.title }}</h2>
    <article v-html="detail.content"></article>
    <div class="fetch-count">{{ detail.fetchCount }}</div>
    <router-link class="to-one" :to="{ name: 'detail', params: { id: 1 } }">to one</router-link>
  </div>
</template>
<script>
  import { mapMixins, mapState } from 'vuet'

  export default {
    mixins: [...mapMixins({ route: 'topic/detail' })],
    computed: mapState({ detail: 'topic/detail' })
  }
</script>
