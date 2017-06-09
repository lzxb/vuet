import utils from '../../utils'
import { scrollTo } from './route-scroll'

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
    // route-scroll
    function resetVuetScroll (vuet) {
      Object.keys(vuet[_key].scrolls[path]).forEach(k => {
        const scrolls = { scrollTop: 0, scrollLeft: 0 }
        vuet[_key].scrolls[path][k] = scrolls
        const el = document.getElementById(k)
        if (el) {
          scrollTo(el, scrolls)
        }
      })
    }

    // route-watch
    function getVuetWatchs (vuet) {
      return vuet[_key].watchers[path]
    }
    function setVuetWatchs (vuet, val) {
      vuet[_key].watchers[path] = val
    }
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
        if (diffWatch(toWatch, getVuetWatchs(this.$vuet))) {
          this.$vuet.reset(path)
          setVuetWatchs(this.$vuet, toWatch)
          resetVuetScroll(this.$vuet)
        }
        this.$vuet.fetch(path, { current: this }, false).then((res) => {
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
            if (!diffWatch(toWatch, fromWatch)) return false
            this.$vuet.fetch(path, { current: this }).then((res) => {
              if (diffWatch(toWatch, getWatchs(this.$route, routeWatch))) return
              resetVuetScroll(this.$vuet)
              this.$vuet.setState(path, res)
              setVuetWatchs(this.$vuet, toWatch)
            })
          }
        }
      }
    }
  }
}
