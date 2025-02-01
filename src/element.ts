import { Component } from './component'

const register = new WeakMap()

export const Element = ({ component, templates, start }) => {

	const { name, module, dependencies } = component

	return class extends HTMLElement {

		constructor() {
			super()
		}

		connectedCallback() {

			this.abortController = new AbortController()

			if( !this.getAttribute('tplid') ) {
				start( this.parentNode )
			}

			const rtrn = Component({
				node:this,
				name,
				module,
				dependencies,
				templates,
				signal: this.abortController.signal,
				register
			})

			if ( rtrn && rtrn.constructor === Promise ) {
				rtrn.then(() => {
					this.dispatchEvent( new CustomEvent(':mount') )
				})
			} else {
				this.dispatchEvent( new CustomEvent(':mount') )
			}
		}

		disconnectedCallback() {
			this.dispatchEvent( new CustomEvent(':unmount') )
			this.abortController.abort()
		}
	}
}
