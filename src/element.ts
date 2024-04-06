import Component from './component'
import { purge, rAF } from './utils'

export default function Element(module, dependencies, templates, components) {
	return class extends HTMLElement {

		base: any
		options: any
		returns : any
		__events: any

		constructor() {

			super()
			const { base, options } = Component(this, { module, dependencies, templates, components })

			this.base = base
			this.options = options
			this.returns = module.default(base)
		}

		connectedCallback() {

			this.base.render()

			if( this.__template && this.__template.constructor === Promise ) {
				this.__template.then( _ => {
					if( this.base && this.options.main) {
						const array = this.options.main(this.base)
						if( array && array.length ){
							array.forEach(f => f(this.base))
						}
					}
				})
				return
			}

			if( this.returns && this.returns.constructor === Promise ) {
				this.returns.then( _ => {
					if( this.base && this.options.main) {
						const array = this.options.main(this.base)
						if( array && array.length ){
							array.forEach(f => f(this.base))
						}
					}
				})
			}else {
				if( this.base && this.options.main ){
					const array = this.options.main(this.base)
					if( array && array.length ) {
						array.forEach(f => f(this.base))
					}
				}
			}
		}

		disconnectedCallback() {
			this.options.unmount(this.base)
			rAF(() => {
				if(!document.body.contains(this) ) {
					this.__events? this.__events = null : null
					this.base? this.base.elm = null : null
					this.base? this.base = null : null
					purge(this)
				}
			})

		}

		attributeChangedCallback() {
			//TODO
		}
	}
}
