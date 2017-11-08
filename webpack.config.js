const path = require("path");
const webpack = require('webpack'); //to access built-in plugins

module.exports = {
  entry: "./_es6/main.js",

  output: {
    path: path.resolve(__dirname, "js"),
    filename: "main.js"
  },

  plugins: [
    new webpack.optimize.UglifyJsPlugin()
  ],

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ["env"],
            plugins: ["transform-async-to-generator"],
          }
        }
      }
    ]
  }

}
