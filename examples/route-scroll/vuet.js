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
        routeWatch: 'query'
      },
      detail: {
        data () {
          return {}
        },
        routeWatch: 'params.id'
      }
    }
  }
})
