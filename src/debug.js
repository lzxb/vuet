import { _Vue } from './vuet-static'

const NAME = '__name__'

export default {
  error (msg) {
    throw new Error(`[${NAME}] ${msg}`)
  },
  warn (msg) {
    if (process.env.NODE_ENV !== 'production') {
      typeof console !== 'undefined' && console.warn(`[${NAME}] ${msg}`)
    }
  },
  assertModule (vuet, path) {
    if (path in vuet.modules) {
      return
    }
    this.error(`The '${path}' module does not exist`)
  },
  assertVue () {
    if (!_Vue) {
      this.error('must call Vue.use(Vuet) before creating a store instance')
    }
  },
  assertFetch (vuet, path) {
    this.assertModule(vuet, path)
    if (typeof vuet.getModule(path).fetch !== 'function') {
      this.error(`'${path}' module 'fetch' must be the function type`)
    }
  }
}
