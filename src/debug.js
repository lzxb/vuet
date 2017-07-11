/* @flow  */

export default {
  error (msg: string) {
    throw new Error(`[vuet] ${msg}`)
  },
  warn (msg: string) {
    if (process.env.NODE_ENV !== 'production') {
      typeof console !== 'undefined' && console.warn(`[vuet] ${msg}`)
    }
  }
}
