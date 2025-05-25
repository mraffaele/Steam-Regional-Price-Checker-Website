const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.dev.js");

module.exports = merge(common, {
  mode: "production",
  optimization: {
    minimize: true,
  },
  output: {
    path: path.resolve(__dirname, "docs"),
  },
});
