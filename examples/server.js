const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const express = require('express')
const webpackConfig = require('./webpack.config')
const rewrite = require('express-urlrewrite')

const app = express()
const compiler = webpack(webpackConfig)

const devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  stats: 'minimal'
})

app.use(devMiddleware)

fs.readdirSync(__dirname).forEach(file => {
  if (fs.statSync(path.join(__dirname, file)).isDirectory()) {
    app.use(rewrite('/' + file + '/*', '/' + file + '/index.html'))
  }
})

app.use(express.static(__dirname))

module.exports = app.listen(3000, (err) => {
  if (err) return console.log(err)
  console.log('http://localhost:3000/')
})
