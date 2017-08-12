import Vue from 'vue'
import Vuet from 'vuet'
import App from './App'
import VuetScroll from '../../packages/vuet-scroll/src/index'

Vue
  .use(Vuet)
  .use(VuetScroll)

const vuet = new Vuet()
vuet.register('test', {
  data () {
    return {}
  }
})

export default new Vue({
  el: '#app',
  vuet,
  render (h) {
    return h(App)
  }
})
