import VuetModule from './vuet-module'

export default class Vuet {
  constructor () {
    this.modules = {}
    this.app = new Vuet.Vue({
      data: {
        modules: this.modules
      }
    })
  }
  _init () {
  }
  register (path, opts) {
    const vtm = new VuetModule(opts)
    Vuet.Vue.set(this.modules, path, vtm.methods)
    this.modules[path] = vtm
  }
  destroy () {

  }
}
