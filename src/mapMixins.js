import { plugins } from './vuet'

export default function mapMixins (...paths) {
  // mapMixins('xxx/route/xxx')
  // mapMixins(['xxx/route/xxx', 'xxx/route/xxx'])
  const mixins = []
  paths.forEach(path => {
    const [moduleName, pluginName, type] = path.split('/')
    const plugin = plugins[pluginName]
    mixins.push(plugin.mixin(path, moduleName, type))
  })
  return mixins
}
