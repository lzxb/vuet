import utils from './utils'

export default class Vuet {
  constructor (opts) {
    this.modules = {}
    this.store = {}
    this.options = {
      pathJoin: '/',
      modules: {}
    }
    this.app = new Vuet.Vue({
      data: {
        modules: this.store
      }
    })
    Object.assign(this.options, opts)
    const initModule = (names, modules) => {
      Object.keys(modules).forEach(name => {
        const newNames = [...names, name]
        const newName = newNames.join(this.options.pathJoin)
        if (!utils.isObject(modules[name])) return
        if (typeof modules[name].data === 'function') {
          this.register(newName, modules[name])
        }
        Object.keys(modules[name]).forEach(chlidName => {
          if (utils.isObject(modules[name][chlidName])) {
            initModule(newNames, modules[name])
          }
        })
      })
    }
    initModule([], this.options.modules)
    Vuet.callRuleHook('init', this)
  }
  _init () {
  }
  register (name, opts) {
    const vuet = this
    Vuet.Vue.set(vuet.store, name, opts.data())
    Object.defineProperty(opts, 'state', {
      get () {
        return vuet.store[name]
      },
      set (val) {
        vuet.store[name] = val
      }
    })
    Object.assign(opts, {
      reset () {
        this.state = this.data()
      }
    })
    Object.keys(opts).forEach(k => {
      if (typeof opts[k] === 'function') {
        const native = opts[k]
        opts[k] = function proxy () {
          return native.apply(vuet.modules[name], arguments)
        }
      }
    })
    if (utils.isObject(opts.state)) {
      Object.keys(opts.state).forEach(k => {
        Object.defineProperty(opts, k, {
          get () {
            return vuet.store[name][k]
          },
          set (val) {
            vuet.store[name][k] = val
          }
        })
      })
    }
    vuet.modules[name] = opts
    return this
  }
  get (name) {
    return this.modules[name]
  }
  destroy () {
    this.vm.$destroy()
  }
}
