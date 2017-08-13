<template>
  <div>
    <button @click="$router.go(-1)">Back</button>
    <h2>{{ detail.title }}</h2>
    <article>{{ detail.content }}</article>
    <div class="fetch-count">{{ detail.fetchCount }}</div>
    <router-link class="to-one" :to="{ name: 'detail', params: { id: 1 } }">to one</router-link>
  </div>
</template>
<script>
  import { mapRules, mapModules } from 'vuet'

  export default {
    mixins: [
      mapRules({ route: 'topicDetail' }),
      mapModules({ detail: 'topicDetail' })
    ]
  }
</script>
