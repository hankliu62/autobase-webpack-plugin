const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  devtool: 'cheap-source-map',
  entry: {
    index: './src/index.ts',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: `autobase.cjs${process.env.NODE_ENV === 'production' ? '.min' : ''}.js`,
    library: {
      name: 'AutoBase',
      type: 'commonjs2' // 类库加载方式
    }
  },
  resolve: {
    extensions: ['.js', '.ts', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.(t|j)s$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        },
        exclude: /node_modules/
      }
    ]
  },
  optimization: {
    minimize: process.env.NODE_ENV === 'production',
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          compress: {
            warnings: false
          },
        },
      })
    ]
  },
  externals: {
    // webpack 不需要编译
    'webpack': 'webpack',
  },
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
  ],
}


