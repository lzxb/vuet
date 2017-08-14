import debug from '../../../src/debug'
// import util from '../../../src/util'

const NAME = '__route__'

export default {
  init (vuet) {
    vuet[NAME] = {}
  },
  register (vuet, path) {
    vuet[NAME][path] = ''
  },
  rule ({ path }) {
    return {
      beforeCreate () {
        debug.assertModule(this.$vuet, path)
        const vuet = this.$vuet
        const vtm = vuet.getModule(path)
        // let watch = vtm.route.watch
        // watch = Array.isArray(watch) ? watch : [watch]
        // watch.forEach(k => {
        //   vuet[NAME][path] += JSON.stringify(this.$route[k])
        // })
        // console.log(vuet[NAME])
        vtm.route.fetch.call(vtm)
      },
      watch: {
        $route: {
          deep: true,
          handler (to, from) {
            const vtm = this.$vuet.getModule(path)
            vtm.reset()
            vtm.route.fetch.call(vtm)
          }
        }
      }
    }
  }
}
