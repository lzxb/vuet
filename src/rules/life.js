import debug from '../debug'

export default {
  rule ({ name }) {
    return {
      beforeCreate () {
        debug.assertPath(this.$vuet, name)
        this.$vuet.signin(name).fetch()
      },
      destroyed () {
        this.$vuet.signin(name).reset()
      }
    }
  }
}
