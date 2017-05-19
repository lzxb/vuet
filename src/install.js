export let _Vue = null

const isDef = v => v !== undefined

export default function install (Vue) {
  if (install.installed) return
  install.installed = true
  _Vue = Vue
  Object.defineProperty(Vue.prototype, '$vrs', {
    get () { return this.$root._vrs }
  })
  Object.defineProperty(Vue.prototype, '$rs', {
    get () { return this.$root._vrs.store }
  })
  Vue.mixin({
    beforeCreate () {
      if (isDef(this.$options.vrs)) {
        this._vrs = this.$options.vrs
      }
    }
  })
}
