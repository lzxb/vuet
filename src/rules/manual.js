export default {
  rule ({ path, name }) {
    return {
      beforeCreate () {
        const { manuals = {} } = this.$vuet._options.modules[path]
        const methods = {}
        Object.keys(manuals).forEach(k => {
          const fn = manuals[k]
          if (typeof fn === 'function') {
            methods[`${k}`] = (...arg) => {
              return fn.apply(methods, [{
                state: this.$vuet.getState(path),
                vm: this,
                vuet: this.$vuet
              }, ...arg])
            }
          }
        })
        methods.reset = (...arg) => {
          return this.$vuet.reset(path, ...arg)
        }
        methods.getState = (...arg) => {
          return this.$vuet.getState(path, ...arg)
        }
        methods.setState = (...arg) => {
          return this.$vuet.setState(path, ...arg)
        }
        methods.fetch = (...arg) => {
          return this.$vuet.fetch(path, ...arg)
        }
        const newName = name || manuals.name || `$${this.$vuet.names[path]}`
        this[newName] = methods
      }
    }
  }
}
