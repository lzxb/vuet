const path = require('path')
const fs = require('fs')
const webpack = require('webpack')

module.exports = {
  entry: fs.readdirSync(__dirname).reduce((entries, dir) => {
    const fullDir = path.join(__dirname, dir)
    const entry = path.join(fullDir, 'main.js')
    if (fs.statSync(fullDir).isDirectory() && fs.existsSync(entry)) {
      entries[dir] = ['babel-polyfill', entry]
    }
    return entries
  }, {}),
  output: {
    filename: 'js/[name].js',
    path: path.join(__dirname, '__build__'),
    publicPath: '/__build__/'
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
      { test: /\.vue$/, loader: 'vue-loader' }
    ]
  },
  resolve: {
    alias: {
      'vue': 'vue/dist/vue.common.js',
      'vue-router': 'vue-router/dist/vue-router.common.js',
      'vuet': path.join(__dirname, '..', 'src/')
    },
    extensions: ['.js', '.vue', '.json']
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      filename: 'js/common.js'
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    })
  ]
}
