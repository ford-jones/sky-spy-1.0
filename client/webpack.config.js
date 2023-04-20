const path = require('path')
const webpack = require('webpack')
require('dotenv').config()

module.exports = {
  entry: ['./client/index.js'],
  output: {
    path: path.join(__dirname, '..', 'src', 'public'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  devServer: {
    historyApiFallback: true,
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.LOCAL_PORT': JSON.stringify(process.env.LOCAL_PORT),
      'process.env.AIR_LABS_API_KEY1': JSON.stringify(
        process.env.AIR_LABS_API_KEY1
      ),
      'process.env.AIR_LABS_API_KEY2': JSON.stringify(
        process.env.AIR_LABS_API_KEY2
      ),
    }),
  ],
}
