
export default {
  error (msg) {
    throw new Error(`[vuet] ${msg}`)
  },
  warn (msg) {
    if (process.env.NODE_ENV !== 'production') {
      typeof console !== 'undefined' && console.warn(`[vuet] ${msg}`)
    }
  },
  assertModule (vuet, name) {
    if (name in vuet.modules) {
      return
    }
    this.error(`The '${name}' module does not exist`)
  }
}
