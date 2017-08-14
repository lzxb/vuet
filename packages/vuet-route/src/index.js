import debug from '../../../src/debug'
// import util from '../../../src/util'

const NAME = '__route__'

function isWatch (vuet, path, route) {
  const vtm = vuet.getModule(path)
  let watch = vtm.route.watch || ['fullPath']
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

function resetVuetScroll (vtm) {
  const { $scroll } = vtm.state
  if ($scroll) {
    Object.keys($scroll).forEach(k => {
      $scroll[k].x = 0
      $scroll[k].y = 0
    })
  }
}

export default {
  init (vuet) {
    vuet[NAME] = {}
  },
  addModule (vuet, path) {
    vuet[NAME][path] = []
    const vtm = vuet.getModule(path)
    Object.keys(vtm.route).forEach(k => {
      if (typeof vtm.route[k] === 'function') {
        vtm.route[k] = vtm.route[k].bind(vtm)
      }
    })
  },
  rule ({ path }) {
    return {
      beforeCreate () {
        debug.assertModule(this.$vuet, path)
        const vtm = this.$vuet.getModule(path)
        if (isWatch(this.$vuet, path, this.$route)) {
          vtm.reset()
          resetVuetScroll(vtm)
        }
        vtm.route.fetch(vtm)
      },
      watch: {
        $route: {
          deep: true,
          handler (to, from) {
            const vtm = this.$vuet.getModule(path)
            if (isWatch(this.$vuet, path, to)) {
              vtm.reset()
              resetVuetScroll(vtm)
            }
            vtm.route.fetch(vtm)
          }
        }
      }
    }
  }
}
