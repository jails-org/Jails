import { Component } from './component'

export const Element = ({ component, templates, start }) => {

	const { name, module, dependencies } = component
	const abortController = new AbortController()

	let ismounted = false

	return class extends HTMLElement {

		constructor() {
			super()
		}

		connectedCallback() {

			if( !this.getAttribute('tplid') ) {
				start( this.parentNode )
			}

			if( ismounted ) {
				return
			}

			const rtrn = Component({
				node:this,
				name,
				module,
				dependencies,
				templates,
				signal: abortController.signal
			})

			if ( rtrn && rtrn.constructor === Promise ) {
				rtrn.then(() => this.dispatchEvent( new CustomEvent(':mount') ))
			} else {
				this.dispatchEvent( new CustomEvent(':mount') )
			}

			ismounted = true
		}

		disconnectedCallback() {
			this.dispatchEvent( new CustomEvent(':unmount') )
			abortController.abort()
			delete this.base
		}
	}
}
