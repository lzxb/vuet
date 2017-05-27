import utils from './utils'

export default function mapState () {
  // mapState(xxx, 'xxx/route/xxx')
  // mapState({ xxx, 'xxx/route/xxx', xxx, 'xxx/route/xxx' })
  const opt = utils.getArgMerge.apply(null, arguments)
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
