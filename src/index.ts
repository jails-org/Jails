import { type Module } from '..'
import { templateConfig, buildtemplates } from './template-system'
import { publish, subscribe } from './utils/pubsub'
import { html } from './utils'
import Element from './element'

const templates = {}
const components = {}

export { html }

export default {

	templateConfig,

	publish,
	subscribe,

	register( name:string, module: Module, dependencies: object ) {
		components[name] = { name, module, dependencies }
	},

	start( target = document.body ) {
		const selector = Object.keys(components).toString()
		buildtemplates( target, selector, templates )
		registerComponents()
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
