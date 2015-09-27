var webpack = require('webpack');
var path = require('path');

module.exports = {

  entry: [
    'webpack-dev-server/client?http://localhost:9090',
    'webpack/hot/only-dev-server',
    './src/index'
  ],

  output: {
    path:       __dirname + '/build/',
    filename:   'app.js',
    publicPath: 'http://localhost:9090/build/'
  },

  module: {
    loaders: [
      { test: path.join(__dirname, 'src'), loaders: ['react-hot', 'babel-loader']}
    ]
  },

  resolve: {
    extensions: ['', '.js', '.jsx']
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ]
}