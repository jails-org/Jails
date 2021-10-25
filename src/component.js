import { on, off, trigger } from './utils/events'

export default function Component ({ name, element, module, dependencies, Pubsub, ElementInterface }) {

	const subscriptions = []
	const destroyers = []

	let resolver
	let promise = new Promise(resolve => resolver = resolve)
	let updater = () => null

	const base = {

		name,
		dependencies,
		elm: element,
		publish: Pubsub.publish,
		unsubscribe: Pubsub.unsubscribe,

		__initialize() {
			resolver(base)
			base.destroy( _ => {
				subscriptions.forEach(topic => Pubsub.unsubscribe(topic))
				destroyers.forEach(fn => element.removeEventListener(':destroy', fn))
			})
		},

		main(fn) {
			promise.then(() => fn().forEach(lambda => lambda(base)))
		},

		expose(methods) {

		},

		state: {
			set( state ) { ElementInterface.update(state) },
			get() { return ElementInterface.model }
		},

		destroy(callback) {
			destroyers.push(callback)
			element.addEventListener(':destroy', callback)
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

		get(name, query) {

			return function () {

				const args = Array.prototype.slice.call(arguments),
					method = args.shift(),
					selector = `[data-component*=${name}]`

				query = query ? selector + query : selector

				Array.from(element.querySelectorAll(query))
					.forEach(el => {
						const instance = el.__instances__[name]
						if (instance && (method in instance.methods))
							instance.methods[method].apply(null, args)
					})

				if (element.matches(query)) {
					const instance = element.__instances__[name]
					if (instance && method in instance.methods)
						instance.methods[method].apply(null, args)
				}
			}
		},

		subscribe(name, method) {
			subscriptions.push({ name, method })
			Pubsub.subscribe(name, method)
		}
	}

	return base
}
