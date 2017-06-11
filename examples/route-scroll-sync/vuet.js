import Vue from 'vue'
import Vuet from 'vuet'

Vue.use(Vuet)

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
      manuals: {
        windowTo ({ state }) {
          state.windowScrolls.x = 100
          state.windowScrolls.y = 200
        },
        areaTo ({ state }) {
          state.areaScrolls.x = 200
          state.areaScrolls.y = 800
        }
      }
    }
  }
})
