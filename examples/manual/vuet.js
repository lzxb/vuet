import Vue from 'vue'
import Vuet from 'vuet'

Vue.use(Vuet)

export default new Vuet({
  modules: {
    count1: {
      data () {
        return 0
      },
      async fetch () {
        return 100
      },
      manuals: {
        plus ({ state }) {
          this.setState(++state)
        },
        reduce ({ state }) {
          this.setState(--state)
        }
      }
    },
    count2: {
      data () {
        return 0
      },
      async fetch () {
        return 100
      },
      manuals: {
        name: 'count2s',
        plus ({ state }) {
          this.setState(++state)
        },
        reduce ({ state }) {
          this.setState(--state)
        }
      }
    },
    count3: {
      data () {
        return 0
      },
      async fetch () {
        return 100
      },
      manuals: {
        plus ({ state }) {
          this.setState(++state)
        },
        reduce ({ state }) {
          this.setState(--state)
        }
      }
    }
  }
})
