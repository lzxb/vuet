export default function (Vuet) {
  Object.assign(Vuet, {
    installed: false,
    options: {
      rules: {}
    },
    install (Vue) {
      if (this.installed) return this
      this.installed = true
      this.Vue = Vue
      Object.defineProperty(Vue.prototype, '$vuet', {
        get () { return this.$root._vuet }
      })
      Vue.mixin({
        beforeCreate () {
          if (typeof this.$options.vuet !== 'undefined') {
            this._vuet = this.$options.vuet
            // this._vuet._init(this)
          }
        },
        destroyed () {
          if (typeof this.$options.vuet !== 'undefined') {
            this._vuet = this.$options.vuet
            this._vuet.destroy(this)
          }
        }
      })
      return this
    },
    mapModules (opts) {
      const mixins = Object.keys(opts).map(name => {
        const path = opts[name]
        return {
          computed: {
            [name]: {
              get () {
                return this.$vuet.modules[path].state
              },
              set (val) {
                this.$vuet.modules[path].state = val
              }
            },
            [`$${name}`]: {
              get () {
                return this.$vuet.modules[path].methods
              },
              set () { }
            }
          }
        }
      })
      return {
        mixins
      }
    },
    mapRules () {
      return {}
    }
  })
}
