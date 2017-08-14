import Vue from 'vue'
import Vuet from 'vuet'
import VuetScroll from 'vuet-scroll'
import VuetRoute from 'vuet-route'
import vuet from './vuet'

Vue
  .use(Vuet)
  .use(VuetScroll)
Vuet.rule('route', VuetRoute)

export default new Vuet({
  data () {
    return {}
  },
  modules: {
    topic: {
      modules: {
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
  }
})
