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
          route: {
            async fetch () {
              return {}
            },
            watch: 'query'
          }
        },
        detail: {
          data () {
            return {}
          },
          route: {
            async fetch () {
              return {}
            },
            watch: 'params.id'
          }
        }
      }
    }
  }
})
