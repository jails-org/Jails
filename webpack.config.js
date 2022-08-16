const path = require('path')

module.exports = {

	devtool: 'source-map',

	resolve: {
		extensions: ['.ts', '.js', '.json']
	},

	entry: {
		index: './src/index.ts'
	},

	module: {
		rules: [
			{
				test: /\.ts$/,
				exclude: [/node_modules/],
				loader: 'ts-loader',
				options: {
					transpileOnly: true
				}
			}
		]
	},

	output: {
		path: path.resolve(__dirname, './dist'),
		filename: '[name].js',
		libraryTarget: 'umd',
		library: 'jails',
		umdNamedDefine: true
	}
}
