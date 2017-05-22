export default {
  error (msg) {
    throw new Error(`[vuet] ${msg}`)
  },
  warn (msg) {
    if (process.env.NODE_ENV !== 'production') {
      typeof console !== 'undefined' && console.warn(`[vuet] ${msg}`)
    }
  }
}
