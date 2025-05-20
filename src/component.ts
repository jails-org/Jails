import { safe, g, dup } from './utils'
import { Idiomorph } from 'idiomorph/dist/idiomorph.esm'
import { publish, subscribe } from './utils/pubsub'

export const Component = ({ name, module, dependencies, node, templates, signal, register }) => {

	let tick
	let preserve		= []

	const _model 		= module.model || {}
	const initialState 	= (new Function( `return ${node.getAttribute('html-model') || '{}'}`))()
	const tplid 		= node.getAttribute('tplid')
	const scopeid 		= node.getAttribute('html-scopeid')
	const tpl 			= templates[ tplid ]
	const scope 		= g.scope[ scopeid ]
	const model  		= dup(module?.model?.apply ? _model({ elm:node, initialState }) : _model)
	const state 		= Object.assign({}, scope, model, initialState)
	const view 			= module.view? module.view : (data) => data

	const base = {
		name,
		model,
		elm: node,
		template: tpl.template,
		dependencies,
		publish,
		subscribe,

		main(fn) {
			node.addEventListener(':mount', fn)
		},

		/**
		 * @State
		 */
		state : {

			protected( list ) {
				if( list ) {
					preserve = list
				} else {
					return preserve
				}
			},

			save(data) {
				if( data.constructor === Function ) {
					data( state )
				} else {
					Object.assign(state, data)
				}
			},

			set( data ) {

				if (!document.body.contains(node)) {
					return
				}
				if( data.constructor === Function ) {
					data(state)
				} else {
					Object.assign(state, data)
				}

				const newstate = Object.assign({}, state, scope)

				return new Promise((resolve) => {
					render(newstate, () => resolve(newstate))
				})
			},

			get() {
				return Object.assign({}, state)
			}
		},

		dataset( target, name ) {

			const el = name? target : node
			const key = name? name : target
			const value = el.dataset[key]

			if (value === 'true') return true
			if (value === 'false') return false
			if (!isNaN(value) && value.trim() !== '') return Number(value)

			try {
				return new Function('return (' + value + ')')()
			} catch {}

			try {
				return JSON.parse(value)
			} catch {}

			return value
		},

		attributes( target ) {

			let callbacks = []
			const elm = target || node

			const observer = new MutationObserver((mutationsList) => {
				for (const mutation of mutationsList) {
					if (mutation.type === 'attributes') {
						const attributeName = mutation.attributeName
						callbacks.forEach((item) => {
							if (item.name == attributeName) {
								item.callback(
									attributeName,
									elm.getAttribute(attributeName)
								)
							}
						})
					}
				}
			})

			observer.observe(node, { attributes: true })

			node.addEventListener(':unmount', () => {
				callbacks = null
				observer.disconnect()
			})

			return {

				onchange( name, callback ) {
					callbacks.push({ name, callback })
				},

				disconnect( callback ) {
					callbacks = callbacks.filter((item) => item.callback !== callback)
				}
			}
		},

		/**
		 * @Events
		 */
		on( ev, selectorOrCallback, callback ) {

			if( callback ) {
				callback.handler = (e) => {
					const detail = e.detail || {}
					let parent = e.target
					while (parent) {
						if (parent.matches(selectorOrCallback)) {
							e.delegateTarget = parent
							callback.apply(node, [e].concat(detail.args))
						}
						if (parent === node) break
						parent = parent.parentNode
					}
				}
				node.addEventListener(ev, callback.handler, {
					signal,
					capture: (ev == 'focus' || ev == 'blur' || ev == 'mouseenter' || ev == 'mouseleave')
				})

			} else {
				selectorOrCallback.handler = (e) => {
					e.delegateTarget = node
					selectorOrCallback.apply(node, [e].concat(e.detail.args))
				}
				node.addEventListener(ev, selectorOrCallback.handler, { signal })
			}

		},

		off( ev, callback ) {
			if( callback.handler ) {
				node.removeEventListener(ev, callback.handler)
			}
		},

		trigger(ev, selectorOrCallback, data) {
			if( selectorOrCallback.constructor === String ) {
				Array
					.from(node.querySelectorAll(selectorOrCallback))
					.forEach( children => {
						children.dispatchEvent(new CustomEvent(ev, { bubbles: true, detail: { args: data } }) )
					})
			} else {
				node.dispatchEvent(new CustomEvent(ev, { bubbles: true, detail:{ args: data } }))
			}
		},

		emit(ev, data) {
			node.dispatchEvent(new CustomEvent(ev, { bubbles: true, detail: { args: data } }))
		},

		unmount( fn ) {
			node.addEventListener(':unmount', fn)
		},

		innerHTML ( target, html_ ) {
			const element = html_? target : node
			const clone = element.cloneNode()
			const html = html_? html_ : target
			clone.innerHTML = html
			Idiomorph.morph(element, clone)
		}
	}

	const render = ( data, callback = (() => {}) ) => {
		clearTimeout( tick )
		tick = setTimeout(() => {
			const html = tpl.render.call({...data, ...view(data)}, node, safe, g )
			Idiomorph.morph( node, html, IdiomorphOptions(node, register) )
			Promise.resolve().then(() => {
				node.querySelectorAll('[tplid]')
					.forEach((element) => {
						const child = register.get(element)
						if(!child) return
						child.state.protected().forEach( key => delete data[key] )
						child.state.set(data)
					})
				Promise.resolve().then(() => {
					g.scope = {}
					callback()
				})
			})
		})
	}

	render( state )
	register.set( node, base )
	return module.default( base )
}

const IdiomorphOptions = ( parent, register ) => ({
	callbacks: {
		beforeNodeMorphed( node ) {
			if( node.nodeType === 1 ) {
				if( 'html-static' in node.attributes ) {
					return false
				}
				if( register.get(node) && node !== parent ) {
					return false
				}
			}
		}
	}
})
