import debug from '../debug'
import util from '../util'

const NAME = '__once__'

export default {
  init (vuet) {
    vuet[NAME] = []
  },
  rule ({ path }) {
    return {
      beforeCreate () {
        debug.assertModule(this.$vuet, path)
        const vuet = this.$vuet
        if (vuet[NAME].indexOf(path) > -1) return
        const back = this.$vuet.getModule(path).fetch()
        if (util.isPromise(back)) {
          return back.then(res => {
            vuet[NAME].push(path)
          })
        }
        vuet[NAME].push(path)
      }
    }
  }
}
