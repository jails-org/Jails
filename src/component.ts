import { safe, rAF, g } from './utils'
import { Idiomorph } from 'idiomorph/dist/idiomorph.esm'
import { publish, subscribe } from './utils/pubsub'

export const Component = ({ name, module, dependencies, node, templates, signal }) => {

	const _model 		= module.model || {}
	const initialState 	= (new Function( `return ${node.getAttribute('html-model') || '{}'}`))()
	const tplid 		= node.getAttribute('tplid')
	const scopeid 		= node.getAttribute('html-scope-id')
	const tpl 			= templates[ tplid ]
	const data 			= g.scope[ scopeid ]
	const model  		= module?.model?.apply ? _model({ elm:node, initialState }) : _model
	const state 		= Object.assign({}, data, model, initialState)
	const view 			= module.view? module.view : (data) => data

	let updates 		= []

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

				const newstate = Object.assign({}, state)

				updates.push(data)

				return new Promise((resolve) => {
					rAF(() => {
						Object.assign.apply(null, [newstate, ...updates ])
						if( updates.length ){
							render(newstate)
							resolve(newstate)
							updates = []
						}
					})
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

	const render = ( data ) => {

		const html = tpl.render.call( view(data), node, safe, g )
		Idiomorph.morph( node, html, IdiomorphOptions(node) )

		rAF(() => {
			node.querySelectorAll('[tplid]')
			.forEach((element) => {
				if(!element.base) return
				const base = element.base
				const props = Object.keys(base.model).reduce((acc, key) => {
					if( key in data ) {
						if( !acc ) acc = {}
						acc[key] = data[key]
					}
					return acc
				}, null)
				if( props ) {
					base.state.set( props )
				}
			})
			rAF(() => g.scope = {})
		})

	}

	node.base = base
	return module.default( base )
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
