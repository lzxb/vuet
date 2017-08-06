import debug from '../debug'

export default {
  rule ({ name }) {
    return {
      beforeCreate () {
        debug.assertPath(this.$vuet, name)
        this.$vuet.get(name).fetch()
      },
      destroyed () {
        this.$vuet.get(name).reset()
      }
    }
  }
}
