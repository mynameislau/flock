const path = require('path');

module.exports = {
  entry: 'main.js',
  output: {
    path: path.resolve(__dirname),
    filename: 'bundle.js',
    publicPath: '/assets/',
  },
  // module: {
  //   rules: [{
  //       test: /\.jsx?$/,
  //       // include: [path.resolve(__dirname, 'app/js')]
  //       loader: 'babel-loader',
  //       options: {
  //         presets: ['es2015', 'react', 'stage-0']
  //       }
  //     },
  //     {
  //       test: /\.css$/,
  //       loader: 'style-loader'
  //     },
  //     {
  //       test: /\.json$/,
  //       loader: 'json-loader'
  //     },
  //     {
  //       test: /\.dmap$/,
  //       loader: 'raw-loader'
  //   }],
  // },
  resolve: {
    modules: ['node_modules', path.resolve(__dirname)],
    extensions: ['.js'],
  },
  devtool: 'sourcemap',
  context: __dirname,
  target: 'web',
};
