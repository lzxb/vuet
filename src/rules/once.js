import debug from '../debug'
import utils from '../utils'

export default {
  init (vuet) {
    vuet.__once__ = {}
  },
  rule ({ path }) {
    return {
      beforeCreate () {
        debug.assertModule(this.$vuet, path)
        if (this.$vuet.__once__[path]) return
        const back = this.$vuet.getModule(path).fetch()
        if (utils.isPromise(back)) {
          return back.then(res => {
            this.$vuet.__once__[path] = true
          })
        }
        this.$vuet.__once__[path] = true
      }
    }
  }
}
