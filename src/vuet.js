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
    Vuet.callRuleHook('init', this)
    Object.keys(this.options.modules).forEach(k => {
      this.register(k, this.options.modules[k])
    })
  }
  _init (app) {
    this.app = app
  }
  register (path, opts) {
    if (util.isObject(opts.modules)) {
      Object.keys(opts.modules).forEach(k => {
        this.register(`${path}${this.options.pathJoin}${k}`, opts.modules[k])
      })
    }
    if (typeof opts.data !== 'function') return this
    const vuet = this
    opts = { ...opts }
    _Vue.set(vuet.store, path, opts.data())
    vuet.modules[path] = opts
    Vuet.callRuleHook('register', this, path)
    Object.defineProperty(opts, 'vuet', {
      get: () => (vuet)
    })
    Object.defineProperty(opts, 'app', {
      get: () => (vuet.app)
    })
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
          return debug.warn(`'${path}' the '${k}' already exists on the object`)
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
