/* @flow */

export default {
  error (msg: string) {
    throw new Error(`[vuet] ${msg}`)
  },
  warn (msg: string) {
    if (process.env.NODE_ENV !== 'production') {
      typeof console !== 'undefined' && console.warn(`[vuet] ${msg}`)
    }
  },
  assertPath (vuet: Object, path: string) {
    if (path in vuet.store) {
      return
    }
    this.error('The module does not exist. Call the this.$vuet method in the Vue component to see all module paths')
  }
}
