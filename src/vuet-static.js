import debug from './debug'
import util from './util'

export let _Vue

export default function (Vuet) {
  Object.assign(Vuet, {
    installed: false,
    options: {
      rules: {}
    },
    install (Vue) {
      if (this.installed) return this
      this.installed = true
      _Vue = Vue
      Object.defineProperty(Vue.prototype, '$vuet', {
        get () { return this.$root._vuet }
      })
      Vue.mixin({
        beforeCreate () {
          if (typeof this.$options.vuet !== 'undefined') {
            if (this.$options.vuet instanceof Vuet) {
              this._vuet = this.$options.vuet
              this._vuet._init(this)
            }
          }
        },
        destroyed () {
          if (typeof this.$options.vuet !== 'undefined') {
            if (this.$options.vuet instanceof Vuet) {
              this._vuet.destroy(this)
            }
          }
        }
      })
      return this
    },
    mapModules (opts) {
      const mixins = Object.keys(opts).map(alias => {
        const path = opts[alias]
        return {
          computed: {
            [alias]: {
              get () {
                debug.assertModule(this.$vuet, path)
                return this.$vuet.modules[path].state
              },
              set (val) {
                debug.assertModule(this.$vuet, path)
                this.$vuet.modules[path].state = val
              }
            },
            [`$${alias}`]: {
              get () {
                debug.assertModule(this.$vuet, path)
                return this.$vuet.modules[path]
              },
              set () {
                debug.error('It is read-only')
              }
            }
          }
        }
      })
      return {
        mixins
      }
    },
    mapRules () {
      const opts = util.getArgMerge.apply(null, arguments)
      const vueRules = []
      const addRule = (ruleName, any) => {
        const rules = Vuet.options.rules[ruleName]
        if (typeof any === 'string') {
          vueRules.push(rules.rule({ path: any }))
        } else {
          vueRules.push(rules.rule(any))
        }
      }
      Object.keys(opts).forEach(ruleName => {
        const any = opts[ruleName]
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
    rule () {
      Vuet.options.rules[arguments[0]] = arguments[1]
      return this
    },
    callRuleHook (hook, vuet) {
      Object.keys(Vuet.options.rules).forEach(k => {
        if (typeof Vuet.options.rules[k][hook] === 'function') {
          Vuet.options.rules[k][hook](vuet)
        }
      })
    }
  })
}
