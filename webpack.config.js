const path = require("path");
const webpack = require('webpack'); //to access built-in plugins

module.exports = {
  entry: "./_es6/main.js",

  output: {
    path: path.resolve(__dirname, "js"),
    filename: "out.js",
    chunkFilename: "[name].bundle.js",
    publicPath: "/js/",
  },

  plugins: [
    // new webpack.optimize.UglifyJsPlugin()
  ],

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ["es2017"],
            plugins: [
              "transform-async-to-generator",
              "syntax-dynamic-import",
            ],
          }
        }
      }
    ]
  }

}
