import { Component } from './component'

export const Element = ({ component }) => {

	const { name, module, dependencies } = component

	return class extends HTMLElement {

		constructor() {
			super()
		}

		connectedCallback() {

			Component({ name, module, dependencies, node:this })

			requestAnimationFrame(() => {
				this.dispatchEvent(new CustomEvent('ready'))
			})
		}

		disconnectedCallback() {

		}
	}
}
