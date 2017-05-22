const name = 'need'

export default {
  name,
  mixin (path) {
    return {
      beforeCreate () {
        this.$vuet.fetch(path, { current: this })
      }
    }
  }
}
