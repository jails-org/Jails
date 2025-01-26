import { Component } from './component'

export const Element = ({ component, templates, start }) => {

	const { name, module, dependencies } = component
	const abortController = new AbortController()

	return class extends HTMLElement {

		constructor() {
			super()
		}

		connectedCallback() {

			if( !this.getAttribute('tplid') ) {
				start( this.parentNode )
			}

			Component({
				node:this,
				name,
				module,
				dependencies,
				templates,
				signal: abortController.signal
			})

			this.dispatchEvent( new CustomEvent(':mount') )
			this.base.state.set({})

		}

		disconnectedCallback() {
			this.dispatchEvent( new CustomEvent(':unmount') )
			abortController.abort()
			delete this.base
		}
	}
}
