import { type Module } from '..'
import { templateConfig, buildtemplates } from './template-system'
import Element from './element'

const templates = {}
const components = {}
const $scopes = {}

export default {

	templateConfig,

	register( name:string, module: Module, dependencies: object ) {
		components[name] = { name, module, dependencies }
	},

	start() {
		const body = document.body
		buildtemplates( body, components, templates, $scopes )
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
