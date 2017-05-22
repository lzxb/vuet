import utils from './utils'

export default function mapStores () {
  // mapStores(xxx, 'xxx/route/xxx')
  // mapStores({ xxx, 'xxx/route/xxx', xxx, 'xxx/route/xxx' })
  let opt = {}
  if (typeof arguments[0] === 'string') {
    opt[arguments[0]] = arguments[1]
  } else if (utils.isObject(arguments[0])) {
    opt = arguments[0]
  }
  const computed = {}
  Object.keys(opt).forEach(k => {
    const path = opt[k]
    computed[k] = {
      get () {
        return this.$vuet.store[path]
      },
      set (val) {
        this.$vuet.store[path] = val
      }
    }
  })
  return computed
}
