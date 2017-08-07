import debug from '../debug'

export default {
  rule ({ path }) {
    return {
      beforeCreate () {
        debug.assertModule(this.$vuet, path)
        this.$vuet.getModule(path).fetch()
      },
      destroyed () {
        this.$vuet.getModule(path).reset()
      }
    }
  }
}
