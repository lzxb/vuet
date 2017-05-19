<template>
  <div>
    <h2>{{ detail.title }}</h2>
    <article v-html="detail.content"></article>
  </div>
</template>
<script>
  import vrs from './vrs'

  export default {
    mixins: [vrs.detailMixin('cnode')]
  }
</script>
