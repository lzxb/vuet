import Vuet from './vuet'
import plugins from './plugins/index'

export let _Vue = null

const isDef = v => v !== undefined

export default function install (Vue) {
  if (install.installed) return
  install.installed = true
  _Vue = Vue
  Object.defineProperty(Vue.prototype, '$vuet', {
    get () { return this.$root._vuet }
  })
  Vue.mixin({
    beforeCreate () {
      if (isDef(this.$options.vuet)) {
        this._vuet = this.$options.vuet
        this._vuet.init(this)
      }
    },
    destroyed () {
      if (isDef(this.$options.vuet)) {
        this._vuet = this.$options.vuet
        this._vuet.destroy(this)
      }
    }
  })
  Object.keys(plugins).forEach(k => {
    Vuet.use(plugins[k])
  })
}
