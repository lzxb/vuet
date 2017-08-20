import Vue from 'vue'
import Vuet, { mapModules, mapRules } from 'vuet'
import VuetStore from 'vuet-store'

Vue.use(Vuet)
Vuet.rule('store', VuetStore)

const vuet = new Vuet()
vuet.addModules('test', {
  data () {
    return {
      count: 0
    }
  },
  fetch () {
    this.count = 1000
  },
  plus () {
    this.count++
  },
  reduce () {
    this.count--
  }
})

const App = {
  mixins: [
    mapModules({
      test: 'test' // { 别名： '模块路径' }
    }),
    mapRules({
      store: [{ path: 'test' }], // { 规则: ['模块路径'] }
      once: [{ path: 'test' }]
    })
  ],
  template: `
    <div>
      <div class="count">{{ test.count }}</div>
      <button @click="test.plus">plus</button> 
      <button @click="test.reduce">reduce</button> 
      <button @click="test.reset">reset</button> 
      <button @click="test.fetch">fetch</button> 
    </div>
  `
}

export default new Vue({
  el: '#app',
  vuet,
  render (h) {
    return h(App)
  }
})
