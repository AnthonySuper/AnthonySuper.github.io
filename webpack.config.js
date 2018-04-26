const path = require("path");
const webpack = require('webpack'); //to access built-in plugins

module.exports = {
  entry: "./_es6/main.js",
  devtool: "source-map",

  output: {
    path: path.resolve(__dirname, "js"),
    filename: "out.js",
    chunkFilename: "[name].[chunkhash:8].bundle.js",
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
            presets: ["es2017", "react"],
            plugins: [
              "transform-async-to-generator",
              "syntax-dynamic-import",
            ],
          }
        }
      },
      {
            test: /\.scss$/,
            use: [{
                loader: "style-loader"
            }, {
                loader: "css-loader"
            }, {
                loader: "sass-loader",
                options: {
                    includePaths: ["absolute/path/a", "absolute/path/b"]
                }
            }]
        }
    ]
  }
}
