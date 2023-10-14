import { type Module } from '..'
import { templateConfig, buildtemplates } from './template-system'
import { publish, subscribe } from './utils/pubsub'
import { html } from './utils'
import Element from './element'

const templates = {}
const components = {}
const $scopes = {}

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
		buildtemplates( target, selector, templates, $scopes )
		registerComponents()
	}
}

const registerComponents = () => {
	Object
		.values( components )
		.forEach( (component) => {
			const { name, module, dependencies } = component as any
			const Base = Element(module, dependencies, templates, components, $scopes)
			customElements.define(name, Base)
		})
}
