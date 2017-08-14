const path = require("path");
const webpack = require("webpack");

const HtmlWebpackPlugin = require("html-webpack-plugin");
// Gives a pretty dashboard for webpack bulding
const DashboardPlugin = require("webpack-dashboard/plugin");
// Resolves issues when deploying the project to case sensitive flie systems on liuux
const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");
// Allows one to use directory names for components
const DirectoryNamedWebpackPlugin = require("directory-named-webpack-plugin");

// Below is to add addtional attributes to the script tag for react
// const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');

module.exports = {
  node: {
    fs: "empty",
    net: "empty"
  },

  context: path.resolve(__dirname, "src"),

  entry: [
    "react-hot-loader/patch",
    // activate HMR for React

    "webpack-dev-server/client?http://0.0.0.0:8080",
    // bundle the client for webpack-dev-server
    // and connect to the provided endpoint

    "webpack/hot/only-dev-server",
    // bundle the client for hot reloading
    // only- means to only hot reload for successful updates

    "./index.jsx"
    // the entry point of our app
  ],

  ////////////////////////////////////////////
  // Output
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "./bundle.js"
  },

  //////////////////////////////////////////////////////
  // Resolves imports - helps make importing less verbose
  resolve: {
    mainFields: ["browser", "module", "main"],
    extensions: [".js", ".jsx"], // resolves imports
    modules: [
      path.resolve("./src"),
      path.resolve("./src/framework"),
      path.resolve("./lib"),
      path.resolve("./node_modules")
    ],
    // alias: {
    //   styles: path.resolve(__dirname, 'src/components/Styles')
    // },
    plugins: [
      // Resolves component directory names
      new DirectoryNamedWebpackPlugin({
        honorIndex: true,
        exclude: /node_modules/
      })
    ]
  },

  //////////////////////////////////////
  // Modules Loaders
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: ["babel-loader"],
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: [
          { loader: "style-loader", options: { sourceMap: true } },
          {
            loader: "css-loader",
            options: {
              modules: true,
              localIdentName: "[path][name]__[local]--[hash:base64:5]",
              sourceMap: true
              // show original src classname in css
            }
          },
          {
            loader: "postcss-loader",
            options: {
              plugins: [require("autoprefixer")],
              sourceMap: true
            }
          },
          { loader: "sass-loader", options: { sourceMap: true } }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.(jpg|png|gif|svg|mp3)$/,
        loader: "url-loader"
      },
      { parser: { amd: false } }
    ]
  },

  ////////////////////////////////////////////
  // Plugins
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),

    // new CaseSensitivePathsPlugin({debug: true}) for more info
    new CaseSensitivePathsPlugin(),

    // enable HMR globally - enables hot command
    new webpack.HotModuleReplacementPlugin(),

    // prints more readable module names in the browser console on HMR updates
    new webpack.NamedModulesPlugin(),

    // makes webpack-dev-server log look awesome
    new DashboardPlugin(),

    // Generate a new index.html
    new HtmlWebpackPlugin({
      inject: "body", // inject tags into
      filename: "index.html", // file name
      template: "./template.html" // template to generate html
    })
    // new ScriptExtHtmlWebpackPlugin({
    //   defaultAttribute: 'async'
    // })
  ],

  ////////////////////////////////////////////
  // This is the config for webpack-dev-server
  devServer: {
    // Load content from bundle
    hot: true,
    inline: true,
    compress: true,
    historyApiFallback: true,
    host: "0.0.0.0",
    disableHostCheck: true,
    // open: true
    ///// These options are commented out unless we need
    ///// to generate HTML on the fly.
    contentBase: path.resolve(__dirname, "dist")

    // should always point to a index.htm;
    // publicPath: '/' // should always match output dir
  },
  ////////////////////////////////////////////
  devtool: "source-map"
};