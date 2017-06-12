<template>
  <div class="inner">
    <div v-if="user.name">
      Hello <b class="name">{{ user.name }}</b>
      <ul>
        <li class="age">
          <span class="label">age</span>
          <span class="value">{{ user.age }}</span>
        </li>
        <li class="sex">
          <span class="label">sex</span>
          <span class="value">{{ user.sex }}</span>
        </li>
        <li class="count">
          <span class="label">count</span>
          <span class="value">{{ user.count }}</span>
        </li>
      </ul>
      <hr>
      <button class="sigout" @click="$user.sigout">Sigout</button>
    </div>
    <div v-else>
      Please<router-link :to="{ name: 'signin' }">Signin</router-link>
    </div>
  </div>
</template>
<script>
  import { mapRules, mapModules } from 'vuet'

  export default {
    mixins: [
      mapRules({ manual: 'user', need: 'user' }),
      mapModules({ user: 'user' })
    ]
  }
</script>
<style scoped>
</style>
