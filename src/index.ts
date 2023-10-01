import { type Module } from '..'
import { templateConfig, buildtemplates } from './template-system'
import { publish, subscribe } from './utils/pubsub'
import Element from './element'

const templates = {}
const components = {}
const $scopes = {}
const $initialStates = {}

export default {

	templateConfig,

	publish,
	subscribe,

	register( name:string, module: Module, dependencies: object ) {
		components[name] = { name, module, dependencies }
	},

	start( target = document.body ) {
		buildtemplates( target, components, templates, $scopes, $initialStates )
		registerComponents()
	}
}

const registerComponents = () => {
	Object
		.values( components )
		.forEach( (component) => {
			const { name, module, dependencies } = component as any
			const Base = Element(module, dependencies, templates, components, $scopes, $initialStates)
			customElements.define(name, Base)
		})
}
