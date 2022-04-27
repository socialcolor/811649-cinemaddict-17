const path = require('path')

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.reslove(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true
  },
  devtool: 'source-map'
}
