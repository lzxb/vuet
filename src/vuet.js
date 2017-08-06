import utils from './utils'

export default class Vuet {
  constructor (opts) {
    this.modules = {}
    this.options = {
      pathJoin: '/',
      modules: {}
    }
    this.app = new Vuet.Vue({
      data: {
        modules: this.modules
      }
    })
    Object.assign(this.options, opts)
    Object.keys(this.options.modules).forEach(name => {
      this.register(name, this.options.modules[name])
    })
    console.log(this)
  }
  _init () {
  }
  register (name, opts) {
    const vuet = this
    opts.state = opts.data()
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
            return opts.state[k]
          },
          set (val) {
            opts.state[k] = val
          }
        })
      })
    }
    Vuet.Vue.set(this.modules, name, opts)
  }
  signin (name) {
    return this.modules[name]
  }
  destroy () {
    this.vm.$destroy()
  }
}
