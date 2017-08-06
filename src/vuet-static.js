import debug from './debug'
import utils from './utils'

export default function (Vuet) {
  Object.assign(Vuet, {
    installed: false,
    options: {
      rules: {}
    },
    install (Vue) {
      if (this.installed) return this
      this.installed = true
      this.Vue = Vue
      Object.defineProperty(Vue.prototype, '$vuet', {
        get () { return this.$root._vuet }
      })
      Vue.mixin({
        beforeCreate () {
          if (typeof this.$options.vuet !== 'undefined') {
            this._vuet = this.$options.vuet
            // this._vuet._init(this)
          }
        },
        destroyed () {
          if (typeof this.$options.vuet !== 'undefined') {
            this._vuet = this.$options.vuet
            this._vuet.destroy(this)
          }
        }
      })
      return this
    },
    mapModules (opts) {
      const mixins = Object.keys(opts).map(alias => {
        const name = opts[alias]
        return {
          computed: {
            [alias]: {
              get () {
                debug.assertPath(this.$vuet, name)
                return this.$vuet.modules[name].state
              },
              set (val) {
                debug.assertPath(this.$vuet, name)
                this.$vuet.modules[name].state = val
              }
            },
            [`$${alias}`]: {
              get () {
                debug.assertPath(this.$vuet, name)
                return this.$vuet.modules[name]
              },
              set () { }
            }
          }
        }
      })
      return {
        mixins
      }
    },
    mapRules () {
      const opts = utils.getArgMerge.apply(null, arguments)
      const vueRules = []
      const addRule = (ruleName, any) => {
        const rules = Vuet.options.rules[ruleName]
        if (typeof any === 'string') {
          vueRules.push(rules.rule({ name: any }))
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
    rule (name, opts) {
      Vuet.options.rules[name] = opts
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
