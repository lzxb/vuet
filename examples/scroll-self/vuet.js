import Vue from 'vue'
import Vuet from 'vuet'
import VuetScroll from '../../packages/vuet-scroll/src/index'

Vue
  .use(Vuet)
  .use(VuetScroll)

export default new Vuet({
  modules: {
    test: {
      data () {
        return {
          active: 'view-1',
          scrolls: {
            'view-1': { x: 50, y: 60 },
            'view-2': { x: 280, y: 300 },
            'view-3': { x: 0, y: 0 }
          }
        }
      }
    }
  }
})
