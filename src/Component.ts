import * as Pubsub from './utils/pubsub'
import { on, off, trigger } from './utils/events'
import { rAF } from './utils'

export const Component = ({

	name,
	element,
	dependencies,
	ElementInterface

}) => {

	const subscriptions = []

	let stateSubscriptions = []
	let resolver
	let promise = new Promise(resolve => resolver = resolve)

	const base = {

		name,
		dependencies,
		elm: element,
		publish: Pubsub.publish,
		unsubscribe: Pubsub.unsubscribe,

		__initialize() {
			resolver(base)
		},

		main(fn) {
			promise
				.then( _ => fn().forEach(lambda => lambda(base)))
				.catch( err => console.error( err) )
		},

		expose(methods) {
			ElementInterface.instances[name].methods = methods
		},

		state: {
			set( state ) {
				if( state.constructor === Function ){
					const model = ElementInterface.model
					state(model)
					ElementInterface.update(model)
				} else {
					ElementInterface.update(state)
				}
				stateSubscriptions.forEach( fn => fn(ElementInterface.model) )
				return new Promise((resolve) => rAF(_ => rAF(resolve) ))
			},
			get() {
				return ElementInterface.model
			},
			subscribe(fn){
				stateSubscriptions.push(fn)
			},
			unsubscribe(fn){
				stateSubscriptions = stateSubscriptions.filter( item => item !== fn )
			}
		},

		destroy(callback) {
			ElementInterface.destroyers.push(callback)
		},

		on(name, selectorOrCallback, callback) {
			on(element, name, selectorOrCallback, callback)
		},

		off(name, callback) {
			off(element, name, callback)
		},

		trigger(ev, target, args) {
			if (target.constructor === String)
				trigger(element.querySelector(target), ev, { args: args })
			else trigger(element, ev, { args: target })
		},

		emit(n, params) {
			const args = Array.prototype.slice.call(arguments)
			trigger(element, args.shift(), { args: args })
		},

		update(fn) {
			ElementInterface.parentUpdate = fn
		},

		get(name, query) {

			return function () {
				rAF(_ => {
					const args = Array.prototype.slice.call(arguments),
					method = args.shift(),
					selector = `[data-component*=${name}]`
					query = query ? selector + query : selector

					Array.from(element.querySelectorAll(query))
						.forEach(el => {
							const instance = el.__instance__.instances[name]
							if (instance && (method in instance.methods))
								instance.methods[method].apply(null, args)
						})

					if (element.matches(query)) {
						const instance = element.__instance__.instances[name]
						if (instance && method in instance.methods)
							instance.methods[method].apply(null, args)
					}
				})
			}
		},

		subscribe(name, method) {
			subscriptions.push({ name, method })
			Pubsub.subscribe(name, method)
		}
	}

	return base
}
