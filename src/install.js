import utils from './utils'

export let _Vue = null

export default function install (Vue) {
  if (install.installed) return
  install.installed = true
  _Vue = Vue
  Object.defineProperty(Vue.prototype, '$vuet', {
    get () { return this.$root._vuet }
  })
  Vue.mixin({
    beforeCreate () {
      if (typeof this.$options.vuet !== 'undefined') {
        this._vuet = this.$options.vuet
        this._vuet._init(this)
      }
    },
    destroyed () {
      if (!utils.isUndefined(this.$options.vuet)) {
        this._vuet = this.$options.vuet
        this._vuet.destroy(this)
      }
    }
  })
}
