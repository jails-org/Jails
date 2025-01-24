import { Component } from './component'

export const Element = ({ component, templates }) => {

	const { name, module, dependencies } = component

	return class extends HTMLElement {

		constructor() {
			super()
		}

		connectedCallback() {

			Component({ name, module, dependencies, node:this, templates })

			requestAnimationFrame(() => {
				this.dispatchEvent(new CustomEvent('ready'))
			})
		}

		disconnectedCallback() {

		}
	}
}
