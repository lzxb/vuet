
export default {
  error (msg) {
    throw new Error(`[vuet] ${msg}`)
  },
  warn (msg) {
    if (process.env.NODE_ENV !== 'production') {
      typeof console !== 'undefined' && console.warn(`[vuet] ${msg}`)
    }
  },
  assertPath (vuet, path) {
    if (path in vuet.modules) {
      return
    }
    this.error('The module does not exist. Call the this.$vuet method in the Vue component to see all module paths')
  }
}
