const { rollup } = require('rollup')
const uglify = require('rollup-plugin-uglify')
const { minify } = require('uglify-js')
const replace = require('rollup-plugin-replace')
const babel = require('rollup-plugin-babel')
const packages = require('../package.json')

const build = async (opts) => {
  let packagesName = opts.destName.split('/')
  packagesName = packagesName[packagesName.length - 1]
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
      '__name__': packagesName,
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

const builds = [
  {
    moduleName: 'Vuet',
    destName: 'vuet',
    entry: 'src/index.js',
    env: 'development'
  },
  {
    moduleName: 'Vuet',
    destName: 'vuet',
    entry: 'src/index.js',
    env: 'production'
  },
  {
    moduleName: 'VuetScroll',
    destName: '../packages/vuet-scroll/dist/vuet-scroll',
    entry: 'packages/vuet-scroll/src/index.js',
    env: 'development'
  },
  {
    moduleName: 'VuetScroll',
    destName: '../packages/vuet-scroll/dist/vuet-scroll',
    entry: 'packages/vuet-scroll/src/index.js',
    env: 'production'
  },
  {
    moduleName: 'VuetRoute',
    destName: '../packages/vuet-route/dist/vuet-route',
    entry: 'packages/vuet-route/src/index.js',
    env: 'development'
  },
  {
    moduleName: 'VuetRoute',
    destName: '../packages/vuet-route/dist/vuet-route',
    entry: 'packages/vuet-route/src/index.js',
    env: 'production'
  },
  {
    moduleName: 'VuetStore',
    destName: '../packages/vuet-store/dist/vuet-store',
    entry: 'packages/vuet-store/src/index.js',
    env: 'development'
  },
  {
    moduleName: 'VuetStore',
    destName: '../packages/vuet-store/dist/vuet-store',
    entry: 'packages/vuet-store/src/index.js',
    env: 'production'
  }
]

builds.forEach(opts => build(opts))
