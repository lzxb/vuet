import debug from '../../../src/debug'

const getName = (path) => {
  return `__vuet_store_${path}__`
}

const setItem = (path, data) => {
  setTimeout(() => {
    localStorage.setItem(getName(path), JSON.stringify(data))
  }, 0)
}

export default {
  addModule (vuet, path) {
    const store = JSON.parse(localStorage.getItem(getName(path)))
    if (store) {
      vuet.getModule(path).state = store
    }
  },
  rule ({ path }) {
    return {
      created () {
        debug.assertModule(this.$vuet, path)
        setItem(path, this.$vuet.getModule(path).state)
        this[getName(path)] = this.$vuet.app.$watch(function () {
          return this.$vuet.getModule(path).state
        }, (newVal) => {
          setItem(path, newVal)
        }, {
          deep: true
        })
      },
      destroyed () {
        this[getName(path)]()
        delete this[getName(path)]
      }
    }
  }
}
