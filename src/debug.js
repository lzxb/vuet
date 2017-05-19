export default {
  error (msg) {
    throw new Error(`[vue-router-store] ${msg}`)
  },
  warn (msg) {
    if (process.env.NODE_ENV !== 'production') {
      typeof console !== 'undefined' && console.warn(`[vue-router-store] ${msg}`)
    }
  }
}
