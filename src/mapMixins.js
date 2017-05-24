import Vuet from './vuet'

export default function mapMixins (...paths) {
  // mapMixins('xxx/route/xxx')
  // mapMixins('xxx/route/xxx', 'xxx/route/xxx')
  const mixins = []
  paths.forEach(path => {
    const pluginName = path.split('/')[1]
    const plugin = Vuet.plugins[pluginName]
    mixins.push(plugin.mixin(path))
  })
  return mixins
}
