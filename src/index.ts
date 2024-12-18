import { templateConfig, buildtemplates } from './template-system'
import { publish, subscribe } from './utils/pubsub'
import { html, attributes } from '../html'
import Element from './element'

const templates = {}
const components = {}

export { html, attributes }

export default {

	templateConfig,

	publish,
	subscribe,

	register( name, module, dependencies = {} ) {
		components[name] = { name, module, dependencies }
	},

	start( target = document.body ) {
		const keys = Object.keys(components)
		const selector = keys.toString()
		if( keys.length ) {
			buildtemplates( target, selector, templates, components )
			registerComponents()
		}
	}
}

const registerComponents = () => {
	Object
		.values( components )
		.forEach( (component) => {
			const { name, module, dependencies } = component as any
			if( !customElements.get(name) ){
				const Base = Element(module, dependencies, templates, components)
				customElements.define(name, Base)
			}
		})
}
