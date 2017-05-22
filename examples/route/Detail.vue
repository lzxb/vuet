<template>
  <div>
    <h2>{{ detail.title }}</h2>
    <article v-html="detail.content"></article>
  </div>
</template>
<script>
  import { mapMixins, mapState } from 'vuet'

  export default {
    mixins: [...mapMixins('cnode/route/detail')],
    computed: mapState({ detail: 'cnode/route/detail' })
  }
</script>
