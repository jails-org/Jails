import View from './view'
import { ismounted, create, destroy } from './element'

const modules = {}
const view = View()

export default {

	register( name, module, dependencies ){
		modules[ name ] = { name, module, dependencies }
	},

	start(){
		view.mode = 'production'
		view.observe({ onAdd, onRemove })
	},

	devStart(){
		console.time('jails')
		view.mode = 'development'
		view.observe({ onAdd, onRemove })
		console.timeEnd('jails')
	}
}

const onAdd = ( elements ) => {
	elements
		.filter( el => !ismounted(el) )
		.forEach( element => create({ element, view, modules }) )
}

const onRemove = ( removedNodes ) => {
	removedNodes.forEach( removedNode => {
		if( removedNode.nodeType === 1 ){
			const children = Array.from(removedNode.querySelectorAll('[data-component]'))
			children
				.concat( removedNode.dataset.component? removedNode : [] )
				.forEach( element => destroy({ element }) )
		}
	})
}

