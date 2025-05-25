const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
  entry: "./src/index.ts",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    clean: true,
    assetModuleFilename: (pathData) => {
      const filepath = path.dirname(pathData.filename).split("/").slice(1).join("/");
      return `${filepath}/[name][ext][query]`;
    },
  },
  mode: "production",
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.([cm]?ts|tsx)$/,
        loader: "ts-loader",
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    extensionAlias: {
      ".ts": [".js", ".ts"],
      ".cts": [".cjs", ".cts"],
      ".mts": [".mjs", ".mts"],
    },
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    compress: true,
    port: 9000,
    devMiddleware: {
      writeToDisk: true,
    },
    client: {
      overlay: false,
    },
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: "./src/assets/static", to: "./assets/static" }],
    }),
    new HtmlWebpackPlugin({
      template: "src/index.html",
      inject: true,
      filename: "index.html",
    }),
    new HtmlWebpackPlugin({
      template: "src/about/index.html",
      inject: true,
      filename: "about/index.html",
    }),
    new MiniCssExtractPlugin({ filename: "[name].css" }),
    new CssMinimizerPlugin(),
  ],
};
