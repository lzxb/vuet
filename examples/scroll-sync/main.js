import Vue from 'vue'
import App from './App'
import vuet from './vuet'

export default new Vue({
  el: '#app',
  vuet,
  render (h) {
    return h(App)
  }
})
