import debug from '../debug'
import utils from '../utils'

export default {
  init (vuet) {
    vuet.__once__ = {}
  },
  rule ({ name }) {
    return {
      beforeCreate () {
        debug.assertPath(this.$vuet, name)
        if (this.$vuet.__once__[name]) return
        const back = this.$vuet.get(name).fetch()
        if (utils.isPromise(back)) {
          return back.then(res => {
            this.$vuet.__once__[name] = true
          })
        }
        this.$vuet.__once__[name] = true
      }
    }
  }
}
