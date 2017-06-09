import utils from '../utils'

export default {
  rule ({ path, name }) {
    return {
      beforeCreate () {
        const { manuals } = this.$vuet._options.modules[path]
        const methods = {}
        Object.keys(manuals).forEach(k => {
          const fn = manuals[k]
          if (utils.isFunction(fn)) {
            methods[`${k}`] = (...arg) => {
              fn.apply(methods, [{
                state: this.$vuet.getState(path),
                vm: this,
                vuet: this.$vuet
              }, ...arg])
            }
          }
        })
        if (name) {
          this[name] = methods
        } else if (manuals.name) {
          this[manuals.name] = methods
        } else {
          const arr = path.split(this.$vuet._options.pathJoin)
          const name = `$${arr[arr.length - 1]}`
          const $methods = this[name] = {}
          Object.assign($methods, methods)
        }
      }
    }
  }
}
