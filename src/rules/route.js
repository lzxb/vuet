import utils from '../utils'

const name = 'route'
const key = `__${name}__`

export default {
  init (vuet) {
    utils.set(vuet, key, {})
    Object.keys(vuet.store).forEach(k => {
      utils.set(vuet[key], k, [])
    })
  },
  rule ({ path }) {
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
        const { routeWatch = 'fullPath' } = this.$vuet._options.modules[path]
        const toWatch = getWatchs(this.$route, routeWatch)
        if (diffWatch(toWatch, this.$vuet[key][path])) {
          this.$vuet.reset(path)
          this.$vuet[key][path] = toWatch
        }
        this.$vuet.fetch(path, { current: this }, false).then((res) => {
          if (diffWatch(toWatch, getWatchs(this.$route, routeWatch))) return
          this.$vuet.setState(path, res)
          this.$vuet[key][path] = toWatch
        })
      },
      watch: {
        $route: {
          deep: true,
          handler (to, from) {
            const { routeWatch = 'fullPath' } = this.$vuet._options.modules[path]
            const toWatch = getWatchs(to, routeWatch)
            const fromWatch = getWatchs(from, routeWatch)
            if (!diffWatch(toWatch, fromWatch)) return false
            this.$vuet.fetch(path, { current: this }).then((res) => {
              if (diffWatch(toWatch, getWatchs(this.$route, routeWatch))) return
              this.$vuet.setState(path, res)
              this.$vuet[key][path] = toWatch
            })
          }
        }
      }
    }
  }
}
