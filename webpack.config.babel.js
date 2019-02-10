module.exports = {
	
	mode :'production',

	entry: {
		main: './index.js'
	},

	output: {
		filename: 'jails.js',
		libraryTarget: 'umd',
		library: 'jails',
		umdNamedDefine: true
	}
}