import morphdom from 'morphdom'
import { safe, g, dup } from './utils'
import { publish, subscribe } from './utils/pubsub'

export const Component = ({ name, module, dependencies, node, templates, signal, register }) => {

	let tick
	let preserve		= []
	let observer 		= null
	let observables 	= []
	let effect 			= null

	const _model 		= module.model || {}
	const initialState 	= (new Function( `return ${node.getAttribute('html-model') || '{}'}`))()
	const tplid 		= node.getAttribute('tplid')
	const scopeid 		= node.getAttribute('html-scopeid')
	const tpl 			= templates[ tplid ]
	const scope 		= g.scope[ scopeid ]
	const model  		= dup(module?.model?.apply ? _model({ elm:node, initialState, dependencies }) : _model)
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

		effect(fn) {
			if( fn ) {
				effect = fn
			} else {
				return effect
			}
		},

		query( selector) {
			const elements = Array.from(node.querySelectorAll(selector))
			return elements.map( (element: HTMLElement) => {
				return new Promise((resolve, reject) => {
					if (document.body.contains(element)) {
						element.addEventListener(':mount', () => resolve(element))
					} else {
						reject(element)
					}
				})
			})
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

				const newstate = Object.assign({}, state)

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

		/**
		 * @Events
		 */
		on( ev, selectorOrCallback, callback ) {

			const attribute = ev.match(/\[(.*)\]/)

			if( attribute ) {
				observables.push({
					target: callback? selectorOrCallback : null,
					callback: callback || selectorOrCallback
				})

				if( !observer ) {
					observer = new MutationObserver((mutationsList) => {
						for (const mutation of mutationsList) {
							if (mutation.type === 'attributes') {
								const attrname = mutation.attributeName
								if( attrname === attribute[1] ) {
									observables.forEach( item => {
										const target = item.target? node.querySelectorAll(item.target): [node]
										target.forEach( target => {
											if( target == mutation.target ) {
												item.callback({
													target: mutation.target,
													attribute: attrname,
													value: mutation.target.getAttribute(attrname)
												})
											}
										})
									})
								}
							}
						}
					})

					observer.observe(node, {
						attributes: true,
						subtree: true
					})

					node.addEventListener(':unmount', () => {
						observables = []
						observer.disconnect()
					})
				}
				return
			}

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

		trigger(ev, selectorOrCallback, data = {}) {
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
			morphdom(element, clone)
		}
	}

	const render = ( data, callback = (() => {}) ) => {
		clearTimeout( tick )
		tick = setTimeout(() => {
			const html = tpl.render.call({...data, ...view(data)}, node, safe, g )
			morphdom(node, html, morphOptions(node, register, data) )
			Promise.resolve().then(() => {
				node.querySelectorAll('[tplid]')
					.forEach((element) => {
						const child = register.get(element)
						const scope = { ...child.__scope__ }
						if(!child) return
						child.state.protected().forEach( key => delete data[key] )
						const useEffect = child.effect()
						if( useEffect ) {
							const promise = useEffect(data)
							if( promise && promise.then ) {
								promise.then(() => child.state.set({...data, ...scope }))
							} else {
								child.state.set({...data, ...scope })
							}
						} else {
							child.state.set({...data, ...scope })
						}
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

const morphOptions = ( parent, register, data ) => {

	return {
		getNodeKey(node) {
			if( node.nodeType === 1 ) {
				return node.id || node.getAttribute('key')
			}
		},
		onBeforeElUpdated: update(parent, register, data),
		onBeforeChildElUpdated: update(parent, register, data),
	}
}

const update = (parent, register, data) => (node, newnode) => {
	if( node.nodeType === 1 ) {
		if( 'html-static' in node.attributes ) {
			return false
		}
		if( register.get(node) && node !== parent ) {
			const scopeid 		= newnode.getAttribute('html-scopeid')
			const scope 		= g.scope[ scopeid ]
			const base = register.get(node)
			base.__scope__ = scope
			return false
		}
	}
}
