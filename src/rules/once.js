import debug from '../debug'

export default {
  init (vuet) {
    vuet.__once__ = {}
  },
  rule ({ name }) {
    return {
      beforeCreate () {
        debug.assertPath(this.$vuet, name)
        if (this.$vuet.__once__[name]) return
        this.$vuet.get(name).fetch().then(res => {
          this.$vuet.__once__[name] = true
        })
      }
    }
  }
}
