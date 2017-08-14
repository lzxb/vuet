import Vue from 'vue'
import Vuet from 'vuet'
import VuetScroll from 'vuet-scroll'

Vue
  .use(Vuet)
  .use(VuetScroll)

export default new Vuet({
  modules: {
    test: {
      data () {
        return {
          windowScrolls: {
            x: 200,
            y: 300
          },
          areaScrolls: {
            x: 100,
            y: 500
          }
        }
      },
      windowTo () {
        this.windowScrolls.x = 100
        this.windowScrolls.y = 200
      },
      areaTo () {
        this.areaScrolls.x = 200
        this.areaScrolls.y = 800
      }
    }
  }
})
