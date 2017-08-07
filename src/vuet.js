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
    const initModule = (paths, modules) => {
      Object.keys(modules).forEach(path => {
        const newNames = [...paths, path]
        const newName = newNames.join(this.options.pathJoin)
        if (!utils.isObject(modules[path])) return
        if (typeof modules[path].data === 'function') {
          this.register(newName, modules[path])
        }
        Object.keys(modules[path]).forEach(chlidName => {
          if (utils.isObject(modules[path][chlidName])) {
            initModule(newNames, modules[path])
          }
        })
      })
    }
    initModule([], this.options.modules)
    Vuet.callRuleHook('init', this)
  }
  _init () {
  }
  register (path, opts) {
    const vuet = this
    Vuet.Vue.set(vuet.store, path, opts.data())
    Object.defineProperty(opts, 'state', {
      get () {
        return vuet.store[path]
      },
      set (val) {
        vuet.store[path] = val
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
          return native.apply(vuet.modules[path], arguments)
        }
      }
    })
    if (utils.isObject(opts.state)) {
      Object.keys(opts.state).forEach(k => {
        Object.defineProperty(opts, k, {
          get () {
            return vuet.store[path][k]
          },
          set (val) {
            vuet.store[path][k] = val
          }
        })
      })
    }
    vuet.modules[path] = opts
    return this
  }
  getModule (path) {
    return this.modules[path]
  }
  getState (path) {
    return this.modules[path].state
  }
  destroy () {
    this.vm.$destroy()
  }
}
