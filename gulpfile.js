const gulp = require('gulp')

const moduleName = 'Vuet'
const destName = 'vuet'

const eslint = require('gulp-eslint')
const clear = require('clear')
gulp.task('lint', () => {
  clear()
  return gulp.src(['**/*.js', '!node_modules/**', '!dist/**'])
    .pipe(eslint())
    .pipe(eslint.format())
})

const { rollup } = require('rollup')
const babel = require('rollup-plugin-babel')({
  babelrc: false,
  presets: [
    ['es2015-rollup'],
    'stage-0'
  ]
})
const uglify = require('rollup-plugin-uglify')
const { minify } = require('uglify-js')
const replace = require('rollup-plugin-replace')
gulp.task('build', () => {
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

const ava = require('gulp-ava')
gulp.task('test', ['lint', 'build'], () => {
  return gulp.src('test/unit/**.test.js')
  .pipe(ava({
    verbose: true // Enable verbose output
  }))
})

const testcafe = require('gulp-testcafe')
const server = require('./examples/server')
gulp.task('e2e', () => {
  if (process.env.NODE_ENV !== 'development') return
  return gulp.src('test/e2e/**.test.js')
    .pipe(testcafe({ browsers: ['nightmare'] }))
    .catch(e => {
      console.log(e)
    })
})

gulp.task('default', ['lint', 'build', 'test', 'e2e'], () => {
  if (process.env.NODE_ENV !== 'development') {
    server && server.close()
    process.exit()
  }
})

if (process.env.NODE_ENV === 'development') {
  gulp.watch(['**/*.js', '!node_modules/**', '!dist/**'], ['default'])
}
