export default {
  mixin (path) {
    return {
      beforeCreate () {
        this.$vuet.fetch(path, { current: this })
      }
    }
  }
}
