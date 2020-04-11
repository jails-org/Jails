import View from './view'
import { ismounted, create, destroy } from './element'

const modules = {}

export default {

	register( name, module, dependencies ){
		modules[ name ] = { name, module, dependencies }
	},

	start(){
		view.mode = 'production'
		view.observe()
	},

	devStart(){
		console.time('jails')
		view.mode = 'development'
		view.observe()
		console.timeEnd('jails')
	}
}

const view = View({

	onAdd( elements ){
		elements
			.filter(el => !ismounted(el))
			.forEach(element => create({ element, view, modules }))
	},

	onRemove( removedNodes ){
		removedNodes.forEach(removedNode => {
			if (removedNode.nodeType === 1) {
				const children = Array.from(removedNode.querySelectorAll('[data-component]'))
				children
					.concat(removedNode.dataset.component ? removedNode : [])
					.forEach(element => destroy({ element }))
			}
		})
	}
})
