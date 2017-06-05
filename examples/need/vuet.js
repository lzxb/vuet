import Vue from 'vue'
import Vuet from 'vuet'

Vue.use(Vuet)

let fetchCount = 0

export default new Vuet({
  modules: {
    test: {
      data () {
        return {
          count: 0,
          fetchCount: 0
        }
      },
      async fetch ({ state }) {
        return {
          count: ++state.count,
          fetchCount: ++fetchCount
        }
      }
    }
  }
})
