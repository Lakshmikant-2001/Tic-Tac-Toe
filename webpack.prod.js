//production build & supports catche busting
const path = require("path");
const common = require("./webpack.common.js");
const { merge } = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = merge(common, {
  mode: "production",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle-[contenthash].js",
    assetModuleFilename: "assets/[name]-[contenthash][ext]",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.scss$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
  //extract css
  plugins: [
    new MiniCssExtractPlugin({
      filename: "style-[contenthash].css",
    }),
  ],
});
