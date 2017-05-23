const name = 'once'

export default {
  name,
  mixin (path) {
    return {
      beforeCreate () {
        if (this.$vuet.__fired_once__ === false) {
          this.$vuet.fetch(path, { current: this }).then(() => {
            this.$vuet.__fired_once__ = true
          })
        }
      }
    }
  },
  init (vuet) {
    vuet.__fired_once__ = false
  },
  destroy (vuet) {
    vuet.__fired_once__ = true
  }
}
