import debug from '../../../src/debug'
// import util from '../../../src/util'

export default {
  rule ({ path }) {
    return {
      beforeCreate () {
        debug.assertModule(this.$vuet, path)
      }
    }
  }
}
