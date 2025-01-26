import { Component } from './component'

export const Element = ({ component, templates }) => {

	const { name, module, dependencies } = component
	const abortController = new AbortController()

	return class extends HTMLElement {

		constructor() {
			super()
		}

		connectedCallback() {

			Component({
				node:this,
				name,
				module,
				dependencies,
				templates,
				signal: abortController.signal
			})

			requestAnimationFrame(() => {
				this.dispatchEvent( new CustomEvent(':mount') )
			})
		}

		disconnectedCallback() {
			this.dispatchEvent( new CustomEvent(':unmount') )
			abortController.abort()
		}
	}
}
