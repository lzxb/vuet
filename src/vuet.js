import VuetModule from './vuet-module'

export let _Vue

export default class Vuet {
  static install (Vue) {
    if (this.installed) return this
    this.installed = true
    _Vue = Vue
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
  }
  static mapModules (opts) {
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
            set () {}
          }
        }
      }
    })
    return {
      mixins
    }
  }
  static mapRules () {
    return {}
  }
  constructor () {
    this.modules = {}
    this.app = new _Vue({
      data: {
        modules: this.modules
      }
    })
  }
  _init () {
  }
  register (path, opts) {
    const vtm = new VuetModule(opts)
    _Vue.set(this.modules, path, vtm.methods)
    this.modules[path] = vtm
  }
  destroy () {

  }
}
