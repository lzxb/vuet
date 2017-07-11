const { rollup } = require('rollup')
const uglify = require('rollup-plugin-uglify')
const { minify } = require('uglify-js')
const replace = require('rollup-plugin-replace')
const babel = require('rollup-plugin-babel')
const packages = require('../package.json')

const build = async (opts) => {
  const plugins = [
    babel({
      babelrc: false,
      presets: [
        ['es2015-rollup'],
        'stage-0'
      ]
    }),
    replace({
      '__version__': packages.version,
      'process.env.NODE_ENV': JSON.stringify(opts.env)
    })
  ]
  if (opts.env === 'production') {
    plugins.push(uglify({
      compress: {
        drop_debugger: true,
        drop_console: true
      }
    }, minify))
  }
  const bundle = await rollup({ entry: opts.entry, plugins })
  const name = opts.env === 'production' ? opts.destName + '.min' : opts.destName
  await bundle.write({
    moduleName: opts.moduleName,
    format: 'umd',
    dest: `dist/${name}.js`,
    sourceMap: true,
    exports: 'named'
  })
}

const moduleName = packages.name.replace(/(\w)/, (v) => v.toUpperCase())
const destName = packages.name
const builds = [
  {
    moduleName,
    destName,
    entry: 'src/index.js',
    env: 'development'
  },
  {
    moduleName,
    destName,
    entry: 'src/index.js',
    env: 'production'
  }
]

builds.forEach(opts => build(opts))
