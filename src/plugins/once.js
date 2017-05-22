const name = 'once'

export default {
  name,
  mixin (path) {
    return {
      beforeCreate () {
        if (this.$vuet.__once__ === false) {
          this.$vuet.fetch(path, { current: this }).then(() => {
            this.$vuet.__once__ = true
          })
        }
      }
    }
  },
  install (Vue, Vuet) {},
  init (vuet) {
    vuet.__once__ = false
  },
  destroy (vuet) {
    vuet.__once__ = true
  }
}
