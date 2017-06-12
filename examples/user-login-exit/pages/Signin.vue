
<template>
  <div class="inner">
    <b class="msg" style="color:red" v-if="msg">{{ msg }}</b>
    <form @submit.prevent="submit">
      <div>
        <label>User name:<input class="name" type="text" v-model="form.name"></label>
      </div>
      <div>
        <label>Password:<input class="pass" type="password" v-model="form.pass"></label>
      </div>
      <button>Signin</button>
    </form>
  </div>
</template>
<script>
  import { mapRules, mapModules } from 'vuet'

  export default {
    mixins: [
      mapRules({ manual: 'user' }),
      mapModules({ user: 'user' })
    ],
    data () {
      return {
        msg: null,
        form: {
          name: null,
          pass: null
        }
      }
    },
    methods: {
      async submit () {
        const res = await this.$user.signin(this.form)
        this.msg = res.msg
        if (res.success) {
          this.user = res.data
          setTimeout(() => {
            this.$router.replace({ name: 'home' })
          }, 500)
        }
      }
    }
  }
</script>
<style scoped>
</style>
