import Component from './component'

export default function Element(module, dependencies, templates, components) {

	return class extends HTMLElement {

		constructor() {

			super()

			const { base, options } = Component(this, { module, dependencies, templates, components })

			this.base = base
			this.options = options

			module.default(base)
		}

		connectedCallback() {
			this.base.render()
			this.options.main().forEach(f => f(this.base))
		}

		disconnectedCallback() {
			this.options.unmount(this.base)
			delete this.options
			delete this.base
			delete this.__events
		}

		attributeChangedCallback() {
			//TODO
		}
	}
}
