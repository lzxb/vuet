import { _Vue } from './install'
import utils from './utils'
import debug from './debug'

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
      modules: {}
    }
    utils.forEachObj(this.options.modules, (myModule, myModuleName) => {
      utils.forEachObj(myModule, (store, storeName) => {
        const path = `${myModuleName}/${storeName}`
        this._options.modules[path] = this.options.modules[myModuleName][storeName]
        this.reset(path)
      })
    })

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
    const data = this.options.data.call(this)
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
Vuet.plugins = {}
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
