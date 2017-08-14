import Vue from 'vue'
import Vuet from 'vuet'
import VuetScroll from 'vuet-scroll'
import VuetRoute from 'vuet-route'

Vue
  .use(Vuet)
  .use(VuetScroll)
Vuet
  .rule('route', VuetRoute)

export default new Vuet({
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
          route: {
            watch: 'query'
          }
        },
        detail: {
          data () {
            return {}
          },
          async fetch () {
            return {}
          },
          route: {
            watch: 'params.id'
          }
        }
      }
    }
  }
})
