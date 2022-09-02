
import { buildtemplates } from './utils'
import { templateConfig } from './template-system'
import Element from './element'

const templates = {}
const components = {}

export default {

	templateConfig,

	register( name:string, module:any, dependencies: object ) {
		components[name] = { name, module, dependencies }
	},

	start() {
		const body = document.body
		buildtemplates( body, components, templates )
		registerComponents()
	}
}

const registerComponents = () => {
	Object
		.values( components )
		.forEach( (component) => {
			const { name, module, dependencies } = component
			const Base = Element(module, dependencies, templates, components)
			customElements.define(name, Base)
		})
}
