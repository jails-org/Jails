import { stripTemplateTag, buildtemplates } from './utils'
import WebComponent from './component'

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
			const Element = WebComponent(module, dependencies, templates, components)
			customElements.define(name, Element)
		})
}
