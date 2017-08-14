import Vue from 'vue'
import Vuet from 'vuet'

Vue.use(Vuet)

let fetchCount = 0

const vuet = new Vuet()

vuet.addModules('test', {
  data () {
    return {
      count: 0,
      fetchCount: 0
    }
  },
  fetch () {
    this.count++
    this.fetchCount = ++fetchCount
  }
})

export default vuet
