import utils from '../utils'

const name = 'route'
const key = `__${name}__`

export default {
  name,
  init (vuet) {
    utils.set(vuet, key, {})
    Object.keys(vuet.store).forEach(k => {
      utils.set(vuet[key], k, [])
    })
  },
  mixin (path) {
    function getWatchs (obj, list) {
      if (typeof list === 'string') {
        list = [list]
      }
      const getObjVal = (obj, str) => {
        const arr = str.split('.')
        arr.forEach(k => {
          obj = obj[k]
        })
        return obj
      }
      const arr = []
      list.forEach(val => {
        let value = getObjVal(obj, val)
        if (!isNaN(value)) {
          value = String(value)
        }
        arr.push(JSON.stringify(value))
      })
      return arr
    }

    function diffWatch (to, from) {
      for (let i = 0; i < to.length; i++) {
        if (to[i] !== from[i]) {
          return true
        }
      }
      return false
    }
    return {
      beforeCreate () {
        const { watch = 'fullPath' } = this.$vuet._options.modules[path]
        const toWatch = getWatchs(this.$route, watch)
        if (diffWatch(toWatch, this.$vuet[key][path])) {
          this.$vuet.reset(path)
          this.$vuet[key][path] = toWatch
        }
        this.$vuet.fetch(path, { current: this }).then(() => {
          this.$vuet[key][path] = toWatch
        })
      },
      watch: {
        $route: {
          deep: true,
          handler (to, from) {
            const { watch = 'fullPath' } = this.$vuet._options.modules[path]
            const toWatch = getWatchs(to, watch)
            const fromWatch = getWatchs(from, watch)
            if (!diffWatch(toWatch, fromWatch)) return false
            this.$vuet.fetch(path, this).then(() => {
              this.$vuet[key][path] = toWatch
            })
          }
        }
      }
    }
  }
}
