import Vue from 'vue'
import vuet from './vuet/'
import router from './router/'

export default new Vue({
  el: '#app',
  vuet,
  router,
  render (h) {
    return h('router-view')
  }
})
