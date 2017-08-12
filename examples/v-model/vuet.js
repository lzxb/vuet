import Vue from 'vue'
import Vuet from 'vuet'

Vue.use(Vuet)

export default new Vuet({
  modules: {
    test: {
      data () {
        return {
          keyname: ''
        }
      }
    }
  }
})
