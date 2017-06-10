<template>
  <div class="inner">
    <button @click="$router.go(-1)">Back</button>
    <h2>{{ detail.title }}</h2>
    <article id="detail" v-route-scroll="'topicDetail'">
      <div></div>
      {{ detail.content }}
      <div></div>
    </article>
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
<style scoped>
  .inner {
    padding: 100px;
    background: #999;
  }
  article {
    overflow: auto;
    width: 200px;
    height: 200px;
    background: #fff;
  }
  article div {
    width: 600px;
    height: 200px;
  }
</style>
