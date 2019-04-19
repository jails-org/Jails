const path = require('path')

module.exports = {	
	
	mode :'production',

	entry: {
		'jails'		:'./index.js',
		'jails.lite':'./lite.js'
	},

	output: {
		path	: path.resolve(__dirname, './dist'),
		filename: '[name].js',
		libraryTarget: 'umd',
		library: 'jails',
		umdNamedDefine: true
	}
}
