import debug from './debug'
import util from './util'
import { _Vue } from './vuet-static'
export default class Vuet {
  constructor (opts) {
    debug.assertVue()
    debug.assertPromise()

    this.modules = {}
    this.store = {}
    this.options = {
      pathJoin: '/',
      modules: {}
    }
    this.app = null
    this.vm = new _Vue({
      data: {
        modules: this.store
      }
    })
    Object.assign(this.options, opts)
    const initModule = (paths, modules) => {
      Object.keys(modules).forEach(path => {
        const mde = modules[path]
        const newNames = [...paths, path]
        const newName = newNames.join(this.options.pathJoin)
        if (typeof mde.data === 'function') {
          this.register(newName, mde)
        }
        if (util.isObject(mde.modules)) {
          initModule(newNames, mde.modules)
        }
      })
    }
    if (util.isObject(this.options.modules)) {
      initModule([], this.options.modules)
    }
    Vuet.callRuleHook('init', this)
  }
  _init (app) {
    this.app = app
  }
  register (path, opts) {
    const vuet = this
    opts = { ...opts }
    _Vue.set(vuet.store, path, opts.data())
    vuet.modules[path] = opts
    vuet.modules[path].vuet = this
    vuet.modules[path].app = vuet.app
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
    if (util.isObject(opts.state)) {
      Object.keys(opts.state).forEach(k => {
        if (k in opts) {
          return debug.warn(`'${k}' already exists on the object`)
        }
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
    return this
  }
  getModule (path) {
    debug.assertModule(this, path)
    return this.modules[path]
  }
  getState (path) {
    debug.assertModule(this, path)
    return this.modules[path].state
  }
  destroy () {
    this.vm.$destroy()
    Vuet.callRuleHook('destroy', this)
  }
}
