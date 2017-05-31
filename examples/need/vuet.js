import Vue from 'vue'
import Vuet from 'vuet'

Vue.use(Vuet)

let count = 0

export default new Vuet({
  modules: {
    test: {
      data () {
        return {
          count: 0
        }
      },
      async fetch () {
        count++
        return {
          count
        }
      }
    }
  }
})
