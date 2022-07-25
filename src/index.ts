import { buildtemplates, stripTemplateTag } from './utils'
import Element from './element'

export const templates = {}
export const components = {}

export default {

	register(name: string, module: any, dependencies: object = {}) {
		components[name] = { name, module, dependencies }
	},

	start() {
		const body = document.body
		stripTemplateTag(body)
		buildtemplates(body, components, templates)
		registerComponents()
	}
}

const registerComponents = () => {
	Object
		.values(components)
		.forEach(({ name, module, dependencies }) => {
			const Base = Element(module, dependencies, templates, components)
			customElements.define(name, Base)
		})
}
