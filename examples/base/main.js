import Vue from 'vue'
import Vuet from 'vuet'
import App from './App'

Vue.use(Vuet)

const vuet = new Vuet()
vuet.register('test', {
  data () {
    return {
      count: 0
    }
  },
  fetch () {
    this.state.count = 1000
  },
  plus () {
    this.state.count++
  },
  reduce () {
    this.state.count++
  }
})

export default new Vue({
  el: '#app',
  vuet,
  render (h) {
    return h(App)
  }
})
