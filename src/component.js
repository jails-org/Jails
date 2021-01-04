import { pandora, log } from 'jails.packages/pandora'
import { on, off, trigger } from './utils/events'
import * as Pubsub from './utils/pubsub'
import { getParent } from './utils'

export default function Component ({ name, element, view, component }) {

	const module = component.module
	const store = Store({ name, element, module, view })
	const subscriptions = []
	const destroyers = []

	let resolver
	let promise = new Promise(resolve => resolver = resolve)
	let updater = () => null

	const base = {

		name,
		injection: component.dependencies,
		elm: element,
		msg: store,
		publish: Pubsub.publish,
		unsubscribe: Pubsub.unsubscribe,

		__initialize(base) {
			resolver(base)
			base.destroy( _ => {
				subscriptions.forEach(topic => Pubsub.unsubscribe(topic))
				destroyers.forEach(fn => element.removeEventListener(':destroy', fn))
			})
		},

		main(fn) {
			promise.then(() => fn().forEach(lambda => lambda(base)))
		},

		render(data) {
			view.update(element, data)
		},

		expose(methods) {
			element.__instances__[name].methods = methods
		},

		update(data) {
			if( data.apply ){
				const _parent = getParent(element, '[data-component]')
				updater = data
				updater( _parent.__model__ )
			}else {
				updater( data )
			}
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

const Store = ({ element, name, module, view:View }) => {

	const view = module.view ? module.view : state => state
	const initialState = View.models[element.dataset.modelId]
	const model = Object.assign({}, module.model, initialState)
	const title = name.charAt(0).toUpperCase() + name.substring(1)

	const middlewares = View.mode === 'development'
		? [log(`Component ${title}`)]
		: []

	const actions = module.actions || {}

	const store = pandora({
		model,
		actions,
		middlewares,
		autostart: false,
		callback(state) {
			View.update(element, view(state))
		}
	})

	if (module.model && Object.keys(module.model).length) {
		View.update(element, view(model))
	}

	return store
}
