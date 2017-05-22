const name = 'local'

export default {
  name,
  install (Vue, Vuet) {
  },
  mixin (path) {
    return {
      beforeCreate () {
        this.$vuet.fetch(path, { current: this })
      }
    }
  }
}