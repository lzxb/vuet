import utils from '../utils'

export const _name = 'route'
export const _key = `__${_name}__`

export default {
  init (vuet) {
    utils.set(vuet, _key, {
      watchers: {},
      scrolls: {}
    })
    Object.keys(vuet.store).forEach(path => {
      utils.set(vuet[_key].watchers, path, [])
      utils.set(vuet[_key].scrolls, path, {})
    })
  },
  rule ({ path }) {
    // vuet-scroll
    function resetVuetScroll (vm) {
      const { $scroll } = vm.$vuet.store[path]
      if ($scroll) {
        Object.keys($scroll).forEach(k => {
          $scroll[k].x = 0
          $scroll[k].y = 0
          $scroll[k].count = $scroll[k].count ? ++$scroll[k].count : 0
        })
      }
    }

    // route-watch
    function getVuetWatchs (vuet) {
      return vuet[_key].watchers[path]
    }
    function setVuetWatchs (vuet, val) {
      vuet[_key].watchers[path] = val
    }
    function getWatchs (obj = {}, list) {
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
        const watch = diffWatch(toWatch, getVuetWatchs(this.$vuet))
        if (watch) {
          this.$vuet.reset(path)
          setVuetWatchs(this.$vuet, toWatch)
          resetVuetScroll(this)
        }
        this.$vuet.fetch(path, { current: this, routeWatch: watch }, false).then((res) => {
          if (diffWatch(toWatch, getWatchs(this.$route, routeWatch))) return
          this.$vuet.setState(path, res)
          setVuetWatchs(this.$vuet, toWatch)
        })
      },
      watch: {
        $route: {
          deep: true,
          handler (to, from) {
            const { routeWatch = 'fullPath' } = this.$vuet._options.modules[path]
            const toWatch = getWatchs(to, routeWatch)
            const fromWatch = getWatchs(from, routeWatch)
            const watch = diffWatch(toWatch, fromWatch)
            if (!watch) return false
            this.$vuet.fetch(path, { current: this, routeWatch: watch }).then((res) => {
              if (diffWatch(toWatch, getWatchs(this.$route, routeWatch))) return
              resetVuetScroll(this)
              this.$vuet.setState(path, res)
              setVuetWatchs(this.$vuet, toWatch)
            })
          }
        }
      }
    }
  }
}
