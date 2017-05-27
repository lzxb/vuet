import Vuet from './vuet'
import utils from './utils'

export default function mapMixins (...paths) {
  const opt = utils.getArgMerge.apply(null, arguments)
  const mixins = []
  Object.keys(opt).forEach(pluginName => {
    const any = opt[pluginName]
    if (Array.isArray(any)) {
      return any.forEach(path => {
        const plugin = Vuet.plugins[pluginName]
        mixins.push(plugin.mixin(path))
      })
    }
    const plugin = Vuet.plugins[pluginName]
    mixins.push(plugin.mixin(any))
  })
  return mixins
}
