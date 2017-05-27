const gulp = require('gulp')
const eslint = require('gulp-eslint')
const clear = require('clear')
const { rollup } = require('rollup')
const babel = require('rollup-plugin-babel')({
  babelrc: false,
  presets: [
    ['es2015-rollup'],
    'stage-0'
  ]
})
const ava = require('gulp-ava')
const uglify = require('rollup-plugin-uglify')
const { minify } = require('uglify-js')
const replace = require('rollup-plugin-replace')

const moduleName = 'Vuet'
const destName = 'vuet'

gulp.task('lint', () => {
  clear()
  return gulp.src(['**/*.js', '!node_modules/**', '!dist/**'])
    .pipe(eslint())
    .pipe(eslint.format())
})

gulp.task('build', ['lint'], () => {
  // Development environment version
  return rollup({
    entry: 'src/index.js',
    plugins: [babel]
  }).then((bundle) => {
    return bundle.write({
      moduleName,
      format: 'umd',
      dest: `dist/${destName}.js`,
      sourceMap: true,
      exports: 'named'
    })
  }).then(() => {
    // Production environment version
    return rollup({
      entry: 'src/index.js',
      plugins: [
        babel,
        replace({
          'process.env.NODE_ENV': JSON.stringify('production')
        }),
        uglify({
          compress: {
            drop_debugger: true,
            drop_console: true
          }
        }, minify)
      ]
    })
  }).then((bundle) => {
    return bundle.write({
      moduleName,
      format: 'umd',
      dest: `dist/${destName}.min.js`,
      sourceMap: true,
      exports: 'named'
    })
  })
})

gulp.task('test', ['build'], () => {
  return gulp.src('test/**.test.js')
  .pipe(ava({
    verbose: true // Enable verbose output
  }))
})

gulp.task('default', ['test'])

if (process.env.NODE_ENV !== 'testing' && process.env.NODE_ENV !== 'production') {
  gulp.watch(['**/*.js', '!node_modules/**', '!dist/**'], ['default'])
}
