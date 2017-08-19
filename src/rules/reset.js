import debug from '../debug'

export default {
  rule ({ path }) {
    return {
      beforeCreate () {
        debug.assertFetch(this.$vuet, path)
      },
      destroyed () {
        this.$vuet.getModule(path).reset()
      }
    }
  }
}
