import Vue from 'vue'
import Vuet from 'vuet'

Vue.use(Vuet)

export default new Vuet({
  modules: {
    test1: {
      data () {
        return {
          count: 0
        }
      },
      async fetch () {
        return {
          count: 100
        }
      },
      manuals: {
        plus ({ state }) {
          state.count++
        },
        reduce ({ state }) {
          state.count--
        }
      }
    },
    test2: {
      data () {
        return {
          count: 0
        }
      },
      async fetch () {
        return {
          count: 100
        }
      },
      manuals: {
        name: 'test2s',
        plus ({ state }) {
          state.count++
        },
        reduce ({ state }) {
          state.count--
        }
      }
    },
    test3: {
      data () {
        return {
          count: 0
        }
      },
      async fetch () {
        return {
          count: 100
        }
      },
      manuals: {
        plus ({ state }) {
          state.count++
        },
        reduce ({ state }) {
          state.count--
        }
      }
    }
  }
})
