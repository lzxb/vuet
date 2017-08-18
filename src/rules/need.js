import debug from '../debug'

export default {
  rule ({ path }) {
    return {
      beforeCreate () {
        debug.assertFetch(this.$vuet, path)
        this.$vuet.getModule(path).fetch()
      }
    }
  }
}
