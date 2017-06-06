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
    return this
  }
  afterEach (fn) {
    this.afterHooks.push(fn)
    return this
  }
  _init (app) {
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
    const keys = ['data', 'fetch', 'routeWatch']
    const initModule = (path, modules) => {
      Object.keys(modules).forEach(k => {
        const item = modules[k]
        const _path = [...path, k]
        if (utils.isFunction(item.data)) {
          this._options.modules[_path.join(pathJoin)] = item
          this.reset(_path.join(pathJoin))
        }
        if (keys.indexOf(k) === -1 && utils.isObject(item)) {
          initModule(_path, item)
        }
      })
    }
    initModule([], this.options.modules)
    Vuet.pluginCallHook('init', this)
  }
  getState (path) {
    return this.store[path] || {}
  }
  setState (path, newState) {
    if (!this.store[path]) {
      _Vue.set(this.store, path, newState)
      return this
    }
    Object.assign(this.store[path], newState)
    return this
  }
  fetch (path, params, setStateBtn) {
    const module = this._options.modules[path]
    if (!utils.isFunction(module.fetch)) return Promise.resolve(this.getState(path))
    const data = {
      path,
      params: { ...params },
      state: this.getState(path)
    }
    const callHook = (hook, ...arg) => {
      for (let i = 0; i < this[hook].length; i++) {
        if (this[hook][i].apply(this, arg)) {
          return false
        }
      }
    }
    if (callHook('beforeHooks', data) === false) return Promise.resolve(data.state)
    return module.fetch.call(this, data)
    .then(res => {
      if (callHook('afterHooks', null, data, res) === false) return data.state
      if (setStateBtn === false) return res
      this.setState(path, res)
      return data.state
    })
    .catch(e => {
      if (callHook('afterHooks', e, data) === false) return Promise.resolve(data.state)
      return Promise.reject(e)
    })
  }
  reset (path) {
    const data = this._options.data.call(this)
    const module = this._options.modules[path]
    if (utils.isFunction(module.data)) {
      Object.assign(data, module.data.call(this, path))
    }
    this.setState(path, data)
    return this
  }
  destroy () {
    this.vm.$destroy()
    Vuet.pluginCallHook('destroy', this)
  }
}

Vuet.plugins = {
  ...plugins
}

Vuet.pluginCallHook = (hook, ...arg) => {
  for (let k in Vuet.plugins) {
    if (utils.isFunction(Vuet.plugins[k][hook])) {
      Vuet.plugins[k][hook].apply(Vuet.plugins[k], arg)
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
