import debug from '../debug'

export default {
  rule ({ path }) {
    return {
      beforeCreate () {
        debug.assertPath(this.$vuet, path)
        console.log(this.$vuet)
      },
      destroyed () {
      }
    }
  }
}
