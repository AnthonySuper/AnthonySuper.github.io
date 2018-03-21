const path = require("path");
const webpack = require('webpack'); //to access built-in plugins
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  entry: {
    main: "./_es6/main.js",
    cyoa: "./_es6/cyoa/main.js",
  },

  output: {
    path: path.resolve(__dirname, "js"),
    filename: "[name].entry.js",
    chunkFilename: "[name].bundle.js",
    publicPath: "/js/",
  },

  plugins: [
    // new webpack.optimize.UglifyJsPlugin()
  ],

  module: {
    rules: [
      {
        test: /\.js(x?)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ["stage-0"],
              ["react"]
            ],
            plugins: [
              "transform-async-to-generator",
              "syntax-dynamic-import",
              "transform-decorators-legacy",
            ],
          }
        }
      }
    ]
  },

  devtool: "source-map",

  plugins: [
    new UglifyJsPlugin({sourceMap: true}),
  ]


}
