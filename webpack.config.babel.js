const path = require('path')

module.exports = {	

	entry: {
		'jails': './index.js'
	},

	output: {
		path		  : path.resolve(__dirname, './dist'),
		filename	  : '[name].js',
		libraryTarget : 'umd',
		library		  : 'jails',
		umdNamedDefine: true
	}
}
