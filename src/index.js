import View from './View'

const modules = {}

export default {

	register( name, module, dependencies ){
		modules[ name ] = { name, module, dependencies }
	},

	devStart(){

	}
}

