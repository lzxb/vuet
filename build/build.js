const fs = require('fs')
const { rollup } = require('rollup')
const uglify = require('rollup-plugin-uglify')
const { minify } = require('uglify-js')
const replace = require('rollup-plugin-replace')
const babel = require('rollup-plugin-babel')

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
      '__version__': package.version,
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

const package = require('../package.json')

build({
  moduleName: package.name.replace(/(\w)/, (v) => v.toUpperCase()),
  destName: package.name,
  entry: 'src/index.js',
  env: 'development'
})
build({
  moduleName: package.name.replace(/(\w)/, (v) => v.toUpperCase()),
  destName: package.name,
  entry: 'src/index.js',
  env: 'production'
})
