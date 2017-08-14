import debug from '../../../src/debug'
// import util from '../../../src/util'

const NAME = '__route__'

export default {
  init (vuet) {
    vuet[NAME] = {}
  },
  register (vuet, path) {
    vuet[NAME][path] = []
  },
  rule ({ path }) {
    return {
      beforeCreate () {
        debug.assertModule(this.$vuet, path)
        // const vtm = this.$vuet.getModule(path)
        // const { routeWatch = 'fullPath' } = vtm
        // console.log(vtm)
      }
    }
  }
}
