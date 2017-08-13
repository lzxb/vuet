import Vue from 'vue'
import router from './router/'
import vuet from './vuet/'

export default new Vue({
  el: '#app',
  vuet,
  router,
  render (h) {
    return h('router-view')
  }
})
