const name = 'once'

export default {
  name,
  install (Vue, Vuet) {
  },
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
  destroy () {
    this.__fired_once__ = false
  }
}
