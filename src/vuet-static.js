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
                return this.$vuet.getModule(path)
              },
              set (val) {
                debug.error(`The'${path}'module is not allowed to assign`)
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
        if (!util.isObject(rules)) debug.error(`The'${ruleName}'rule does not exist. Please make sure that it executes 'Vuet.rule('${ruleName}', opts)' before all components`)
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
      if (typeof arguments[1].install === 'function') {
        arguments[1].install(Vuet, _Vue)
      }
      return this
    },
    callRuleHook (hook, ...arg) {
      Object.keys(Vuet.options.rules).forEach(k => {
        if (typeof Vuet.options.rules[k][hook] === 'function') {
          Vuet.options.rules[k][hook].apply(undefined, arg)
        }
      })
    }
  })
}
