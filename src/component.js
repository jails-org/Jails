import { pandora, log } from 'jails.packages/pandora'
import { on, off, fire } from './events'

import * as Pubsub from './pubsub'

export default ( reactor, {module, injection} ) => ( name, node ) => {

	const store = State( node, name, module, reactor )
	const subscriptions = []
	const destroyers = []

	let resolver
	let promise = new Promise( resolve => resolver = resolve )
	let updater = () => null

	const base = {

		name,
		injection,
		elm :node,
		msg: store,
		publish: Pubsub.publish,
		unsubscribe: Pubsub.unsubscribe,

		__initialize( base ) {
			resolver(base)
			base.destroy( _ =>{
				subscriptions.forEach(topic => Pubsub.unsubscribe(topic))
				destroyers.forEach( fn => node.removeEventListener(':destroy', fn) )
			})
		},

		main( fn ) {
			promise.then(() => fn().forEach(lambda => lambda(base)))
		},

		render( data ){
			reactor.update( node, data )
		},

		expose(methods) {
			node.__instances__[name].methods = methods
		},

		update( data ){
			data.apply? updater = data : updater( data )
		},

		destroy( callback ){
			destroyers.push(callback)
			node.addEventListener(':destroy', callback)
		},

		on( name, selectorOrCallback, callback ) {
			on(node, name, selectorOrCallback, callback)
		},

		off( name, callback ) {
			off( node, name, callback )
		},

		trigger( el, name, data ) {
			fire(el, name, data)
		},

		emit(n, params) {
			const args = Array.prototype.slice.call(arguments)
			fire(node, args.shift(), { args: args })
		},

		get( name, query ) {

			return function () {

				const args = Array.prototype.slice.call(arguments),
					method = args.shift(),
					selector = `[data-component*=${name}]`

				query = query ? selector + query : selector

				Array.from(node.querySelectorAll(query))
					.forEach( el => {
						const instance = el.__instances__[name]
						if( instance && (method in instance.methods) )
							instance.methods[method].apply(null, args)
					})

				if ( node.matches(query) ){
					const instance = node.__instances__[name]
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

const State = ( node, name, module, reactor ) => {

	const view = module.view ? module.view : state => state
	const initialState = reactor.models[ node.dataset.modelId ]
	const model = Object.assign({}, module.model, initialState)

	const middlewares = reactor.mode == 'development'
		? [log(`Component ${name.charAt(0).toUpperCase()}${name.substring(1)}`)]
		: []

	const actions = module.actions || {}

	const store = pandora({
		model,
		actions,
		middlewares,
		autostart: false,

		callback( state ) {
			reactor.update( node, view(state) )
		}
	})

	if( module.model && Object.keys(module.model).length ){
		reactor.update(node, view(model))
	}

	return store
}
