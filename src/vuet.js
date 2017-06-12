import install, { _Vue } from './install'
import utils from './utils'
import debug from './debug'
import rules from './rules/index'

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
      data: function data () { return {} },
      pathJoin: null,
      ...this.options,
      ...{
        modules: {}
      }
    }
    const keys = ['data', 'fetch', 'routeWatch', 'manuals']
    const { pathJoin } = this._options
    const initModule = (path, modules) => {
      Object.keys(modules).forEach(k => {
        const item = modules[k]
        const _path = [...path, k]
        if (utils.isFunction(item.data)) {
          let newPath = null
          if (pathJoin) {
            newPath = _path.join(pathJoin)
          } else {
            newPath = [_path[0]]
            for (let i = 1; i < _path.length; i++) {
              newPath.push(_path[i].replace(/^(\w)/, (v) => v.toUpperCase()))
            }
            newPath = newPath.join('')
          }
          this._options.modules[newPath] = item
          this.reset(newPath)
        }
        if (keys.indexOf(k) === -1 && utils.isObject(item)) {
          initModule(_path, item)
        }
      })
    }
    initModule([], this.options.modules)
    callRuleHook('init', this)
  }
  getState (path) {
    return this.store[path] || {}
  }
  setState (path, newState) {
    if (!utils.isObject(newState)) return this
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
      state: this.getState(path),
      route: this.app.$route || {}
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
    callRuleHook('destroy', this)
  }
}

Object.assign(Vuet, {
  options: {
    rules: {}
  },
  install,
  rule (name, rule) {
    if (this.options.rules[name]) return this
    this.options.rules[name] = rule
    callRuleHook('install', _Vue, Vuet)
    return this
  },
  mapRules (...paths) {
    const opt = utils.getArgMerge.apply(null, arguments)
    const vueRules = []
    const addRule = (ruleName, any) => {
      const rules = Vuet.options.rules[ruleName]
      if (typeof any === 'string') {
        vueRules.push(rules.rule({ path: any }))
      } else {
        vueRules.push(rules.rule(any))
      }
    }
    Object.keys(opt).forEach(ruleName => {
      const any = opt[ruleName]
      if (Array.isArray(any)) {
        return any.forEach(item => {
          addRule(ruleName, item)
        })
      }
      addRule(ruleName, any)
    })
    return {
      mixins: vueRules
    }
  },
  mapModules () {
    const opt = utils.getArgMerge.apply(null, arguments)
    const computed = {}
    Object.keys(opt).forEach(k => {
      const path = opt[k]
      computed[k] = {
        get () {
          return this.$vuet.store[path]
        },
        set (val) {
          this.$vuet.store[path] = val
        }
      }
    })
    return { computed }
  },
  use (plugin, opt) {
    if (utils.isFunction(plugin)) {
      plugin(_Vue, Vuet, opt)
    } else if (utils.isFunction(plugin.install)) {
      plugin.install(_Vue, Vuet, opt)
    }
    return this
  }
})

function callRuleHook (hook, ...arg) {
  const { rules } = Vuet.options
  for (let k in rules) {
    if (utils.isFunction(rules[k][hook])) {
      rules[k][hook].apply(rules[k], arg)
    }
  }
}

Vuet.use(rules)
