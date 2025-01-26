import { safe, rAF, g } from './utils'
import { Idiomorph } from 'idiomorph/dist/idiomorph.esm'
import { publish, subscribe } from './utils/pubsub'

export const Component = ({ name, module, dependencies, node, templates, signal }) => {

	const initialState = (new Function( `return ${node.getAttribute('html-model') || '{}'}`))()
	const tplid 	= node.getAttribute('tplid')
	const scopeid 	= node.getAttribute('html-scope-id')
	const tpl 		= templates[ tplid ]
	const data 		= g.scope[ scopeid ]
	const model  	= module?.model?.apply ? module.model({ elm:node, initialState }) : module.model
	const state 	= Object.assign({}, data, model, initialState)

	const base = {

		elm: node,
		dependencies,
		template: tpl.template,
		publish,
		subscribe,

		main(fn) {
			node.addEventListener(':mount', fn)
		},

		/**
		 * @State
		 */
		state : {

			save(data) {
				if( data.constructor === Function ) {
					data( state )
				} else {
					Object.assign(state, data)
				}
			},

			set( data ) {

				Object.assign(state, data)
				const dupdata = Object.assign({}, state)

				if( data.constructor === Function ) {
					data( dupdata )
				} else {
					Object.assign(dupdata, data)
				}

				const html = tpl.render.call( dupdata, node, safe, g )

				rAF(() => {
					Idiomorph.morph( node, html, IdiomorphOptions(node) )

					node.querySelectorAll('[tplid]').forEach((element) => {
						element.base.state.set(dupdata)
					})

					rAF(() => g.scope = {})
				})
			},

			get() {
				return Object.assign({}, state)
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
			const element = html_? target : elm
			const clone = element.cloneNode()
			const html = html_? html_ : target
			clone.innerHTML = html

			rAF( _ => Idiomorph.morph(element, clone, IdiomorphOptions) )
		}
	}

	node.base = base
	module.default( base )
}

const IdiomorphOptions = ( parent ) => ({
	callbacks: {
		beforeNodeMorphed( node ) {
			if( node.nodeType === 1 ) {
				if( 'html-static' in node.attributes ) {
					return false
				}
				if( node.base && node !== parent ) {
					return false
				}
			}
		}
	}
})
