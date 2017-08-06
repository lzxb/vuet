export default class VuetModule {
  constructor (opts) {
    this.methods = {}
    Object.keys(opts).forEach(k => {
      if (typeof opts[k] === 'function') {
        this.methods[k] = opts[k].bind(this)
      }
    })
    this.state = this.methods.data()
  }
}
