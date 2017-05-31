import { _Vue } from './install'
import utils from './utils'
import debug from './debug'
import plugins from './plugins/index'

export default class Vuet {
  constructor (options) {
    if (!utils.isObject(options)) {
      debug.error('Parameter is the object type')
    }
    this.options = options || {}
    this.app = null
    this.store = {}
    this.beforeHooks = [] // Before the request begins
    this.afterHooks = [] // After the request begins
    this.vm = null
  }
  beforeEach (fn) {
    this.beforeHooks.push(fn)
  }
  afterEach (fn) {
    this.afterHooks.push(fn)
  }
  init (app) {
    if (this.app || !app) return
    this.app = app
    this.vm = new _Vue({
      data: {
        store: this.store
      }
    })
    this._options = {
      data: this.options.data || function data () { return {} },
      pathJoin: this.options.pathJoin || '/',
      modules: {}
    }
    const { pathJoin } = this._options
    const initModule = (path, modules) => {
      Object.keys(modules).forEach(k => {
        const item = modules[k]
        const _path = [...path, k]
        if (utils.isFunction(item.fetch) && utils.isFunction(item.data)) {
          this._options.modules[_path.join(pathJoin)] = item
          this.reset(_path.join(pathJoin))
        }
        if (utils.isObject(item)) {
          initModule(_path, item)
        }
      })
    }
    initModule([], this.options.modules)
    Vuet.pluginCallHook(this, 'init')
  }
  setState (path, data) {
    if (!this.store[path]) {
      return _Vue.set(this.store, path, data)
    }
    Object.assign(this.store[path], data)
  }
  getState (path) {
    return this.store[path] || {}
  }
  reset (path) {
    const data = this._options.data.call(this)
    const store = this._options.modules[path]
    if (utils.isFunction(store.data)) {
      Object.assign(data, store.data.call(this, path))
    }
    this.setState(path, data)
  }
  fetch (path, params) {
    const store = this._options.modules[path]
    if (!utils.isFunction(store.fetch)) return false
    const data = {
      path,
      params: { ...params },
      store: this.getState(path)
    }
    const callHook = (hook, ...arg) => {
      for (let i = 0; i < this[hook].length; i++) {
        if (this[hook][i].apply(this, arg)) {
          return false
        }
      }
    }
    if (callHook('beforeHooks', data) === false) return Promise.resolve(data.store)
    return store.fetch.call(this, data)
    .then(res => {
      if (callHook('afterHooks', null, data, res) === false) return data.store
      this.setState(path, res)
      return data.store
    })
    .catch(e => {
      if (callHook('afterHooks', e, data) === false) return Promise.resolve(data.store)
      return Promise.reject(e)
    })
  }
  destroy () {
    this.vm.$destroy()
    Vuet.pluginCallHook(this, 'destroy')
  }
}

Vuet.plugins = {
  ...plugins
}

Vuet.pluginCallHook = (vuet, hook) => {
  for (let k in Vuet.plugins) {
    if (utils.isFunction(Vuet.plugins[k][hook])) {
      Vuet.plugins[k][hook](vuet)
    }
  }
}

Vuet.use = (plugin, opt) => {
  if (utils.isFunction(plugin.install)) {
    plugin.install(_Vue, Vuet, opt)
  }
  if (typeof plugin.name !== 'string' || !plugin.name) return Vuet
  Vuet.plugins[plugin.name] = plugin
  return Vuet
}
