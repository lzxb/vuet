/* @flow */

import utils from '../utils'
import debug from '../debug'

export const _name = 'route'
export const _key = `__${_name}__`

export default {
  init (vuet: Object) {
    utils.set(vuet, _key, {
      watchers: {},
      scrolls: {}
    })
    Object.keys(vuet.store).forEach(path => {
      utils.set(vuet[_key].watchers, path, [])
      utils.set(vuet[_key].scrolls, path, {})
    })
  },
  rule ({ path }: RuleOptions) {
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
    function getVuetWatchs (vuet: Object) {
      return vuet[_key].watchers[path]
    }
    function setVuetWatchs (vuet: Object, arr: Array<string>) {
      vuet[_key].watchers[path] = arr
    }
    function getWatchs (obj: Route, list: string | Array<string>): Array<string> {
      if (typeof list === 'string') {
        list = [list]
      }
      const getObjVal = (route: Route, str: string) => {
        let obj: any = route
        const arr: Array<string> = str.split('.')
        arr.forEach(k => {
          obj = obj[k]
        })
        return obj
      }
      const arr = []
      list.forEach((val: string) => {
        let value = getObjVal(obj, val)
        if (!isNaN(value)) {
          value = String(value)
        }
        arr.push(JSON.stringify(value))
      })
      return arr
    }

    function diffWatch (to: Array<string>, from: Array<string>): boolean {
      for (let i = 0; i < to.length; i++) {
        if (to[i] !== from[i]) {
          return true
        }
      }
      return false
    }

    return {
      beforeCreate () {
        debug.assertPath(this.$vuet, path)
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
          handler (to: Route, from: Route) {
            const { routeWatch = 'fullPath' } = this.$vuet._options.modules[path]
            const toWatch = getWatchs(to, routeWatch)
            const fromWatch = getWatchs(from, routeWatch)
            const watch: boolean = diffWatch(toWatch, fromWatch)
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
