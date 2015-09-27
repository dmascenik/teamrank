var webpack = require('webpack');
var path = require('path');

module.exports = {

  entry: [
    './src/index'
  ],

  output: {
    path:       __dirname + '/build/dist',
    filename:   'app.js'
  },

  module: {
    loaders: [
      { test: path.join(__dirname, 'src'), loaders: ['babel-loader']}
    ]
  },

  resolve: {
    extensions: ['', '.js', '.jsx']
  },

  plugins: [
    new webpack.NoErrorsPlugin()
  ]
}