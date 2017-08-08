import debug from '../debug'
import util from '../util'

const PATH = '__once__'

export default {
  init (vuet) {
    vuet.register(PATH, {
      data () {
        return []
      }
    })
  },
  rule ({ path }) {
    return {
      beforeCreate () {
        debug.assertModule(this.$vuet, path)
        const once = this.$vuet.getModule(PATH)
        if (once.state.indexOf(path) > -1) return
        const back = this.$vuet.getModule(path).fetch()
        if (util.isPromise(back)) {
          return back.then(res => {
            once.state.push(path)
          })
        }
        once.state.push(path)
      }
    }
  }
}
