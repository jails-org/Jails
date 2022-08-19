
import { buildtemplates } from './utils'
import Element from './element'

const templates = {} as any
const components = {} as any

export default {

	register( name: string, module, dependencies: object = {} ) {
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
			const { name, module, dependencies } = component as any
			const Base = Element(module, dependencies, templates, components)
			customElements.define(name, Base)
		})
}
