const path = require('path')

module.exports = {
  entry: ['babel-polyfill', 'whatwg-fetch', 'init-react.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'react.bundle.js'
  },
  module : {
    rules : [
      {
        exclude: /node_modules/,
        test : /\.jsx?/,
        include : __dirname,
        loader : 'babel-loader'
      },
      {
        test: /\.css$/,
        loader: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    modules: [
      path.resolve('./'), // this allows us to import files starting at the root instead of a relative path. For example, 'components/Component' instead of '../../../components/Component'
      path.resolve('./node_modules')
    ]
  }
}
