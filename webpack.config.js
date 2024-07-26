const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
// const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, './src/index.js'),
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, './dist/'),
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/index.html'),
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
    /* new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, './images'),
          to: path.resolve(__dirname, './dist/images'),
        },
      ],
    }), */

  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              // Опции для sass-loader
              sassOptions: {
                // Опции для sass
                outputStyle: 'compressed', // Для минификации CSS
              },
              // Опции, специфичные для sass-loader
              // Например, чтобы игнорировать предупреждения о смешанных объявлениях
              sourceMap: true, // Включить карты исходников
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [new CssMinimizerPlugin(), new TerserPlugin()],
  },
  devServer: {
    port: 3000,
    hot: true,
    open: true,
  },
};
