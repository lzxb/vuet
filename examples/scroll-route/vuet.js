import Vue from 'vue'
import Vuet from 'vuet'

Vue.use(Vuet)

export default new Vuet({
  data () {
    return {}
  },
  modules: {
    topic: {
      list: {
        data () {
          return {}
        },
        async fetch () {
          return {}
        },
        routeWatch: 'query'
      },
      detail: {
        data () {
          return {}
        },
        async fetch () {
          return {}
        },
        routeWatch: 'params.id'
      }
    }
  }
})
