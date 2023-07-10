const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  devtool: "source-map",

  entry: {
    popup: "./popup.js",
    background: "./background.js",
    contentScript: "./contentScript.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: "manifest.json", to: "manifest.json" },
        { from: "popup.html", to: "popup.html" },
      ],
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        browser_action: {
          default_popup: "popup.html",
        },
      },
    }),
  ],
  module: {
    rules: [
      {
        test: /\.json$/,
        loader: "json-loader",
        type: "javascript/auto",
      },
    ],
  },
};
