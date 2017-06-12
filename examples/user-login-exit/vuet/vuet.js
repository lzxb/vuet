import Vue from 'vue'
import Vuet from 'vuet'
import user from './user'

Vue.use(Vuet)

const vuet = new Vuet({
  modules: {
    user
  }
})

export default vuet
