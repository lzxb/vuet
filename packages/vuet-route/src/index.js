import debug from '../../../src/debug'
import util from '../../../src/util'

const NAME = '__route__'

function isWatch (vuet, path, route) {
  const vtm = vuet.getModule(path)
  let watch = ['fullPath']
  if (vtm.route.watch) {
    watch = vtm.route.watch
  }
  watch = Array.isArray(watch) ? watch : [watch]
  const oldWatch = vuet[NAME][path]
  vuet[NAME][path] = []
  watch.forEach(k => {
    let data = route
    k.split('.').forEach(chlidKey => {
      data = data[chlidKey]
    })
    vuet[NAME][path].push(JSON.stringify(data))
  })
  return oldWatch.join() !== vuet[NAME][path].join()
}

export default {
  init (vuet) {
    vuet[NAME] = {}
  },
  addModule (vuet, path) {
    vuet[NAME][path] = []
    if (!util.isObject(vuet.getModule(path).route)) {
      vuet.getModule(path).route = {}
    }
  },
  rule ({ path }) {
    return {
      beforeCreate () {
        debug.assertModule(this.$vuet, path)
        const vtm = this.$vuet.getModule(path)
        if (isWatch(this.$vuet, path, this.$route)) {
          vtm.reset()
          vtm.state.__routeLoaded__ = true
          return vtm.fetch(vtm)
        }
        if (vtm.route.once !== false || !vtm.state.__routeLoaded__) { // default
          vtm.state.__routeLoaded__ = true
          return vtm.fetch(vtm)
        }
      },
      watch: {
        $route: {
          deep: true,
          handler (to, from) {
            const vtm = this.$vuet.getModule(path)
            if (isWatch(this.$vuet, path, to)) {
              vtm.reset()
              vtm.state.__routeLoaded__ = true
              vtm.fetch(vtm)
            }
          }
        }
      }
    }
  }
}
