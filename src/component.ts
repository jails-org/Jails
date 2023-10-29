import { type Component } from '..'
import morphdom from 'morphdom'

import { rAF, dup, safe } from './utils'
import { buildtemplates } from './template-system'
import { on, off, trigger } from './utils/events'
import { publish, subscribe } from './utils/pubsub'

export default function Component( elm, { module, dependencies, templates, components, $scopes }) {

	const tplid = elm.getAttribute('tplid')
	const options = getOptions( module )
	const initialState = (new Function( `return ${elm.getAttribute('html-model') || '{}'}`))()
	const selector = Object.keys(components).toString()
	buildtemplates( elm, selector, templates, $scopes )

	const template = tplid ? templates[tplid] : null
	const state = { data: module.model ? dup(module.model) : {} }
	const scope = $scopes[tplid] && $scopes[tplid].length? $scopes[tplid].shift() : {}
	state.data = Object.assign(scope, state.data, initialState)

	const base: Component = {
		template,
		elm,
		dependencies,
		publish,
		subscribe,

		main(fn) {
			options.main = fn
		},

		unmount(fn) {
			options.unmount = fn
		},

		onupdate(fn) {
			options.onupdate = fn
		},

		on(eventName, selectorOrCallback, callback) {
			on(elm, eventName, selectorOrCallback, callback)
		},

		off(eventName, callback) {
			off(elm, eventName, callback)
		},

		trigger(eventName, target, args) {
			if (target.constructor === String) {
				Array
					.from(elm.querySelectorAll(target))
					.forEach( children => trigger(children, eventName, { args: args }) )
			}
			else trigger(elm, eventName, { args: target })
		},

		emit: ( ...args ) => {
			trigger(elm, args.shift(), { args: args })
		},

		state: {
			set( data ) {
				if (data.constructor === Function) {
					const newstate = dup(state.data)
					data(newstate)
					base.render(newstate)
				} else {
					base.render(data)
				}
				return new Promise((resolve) => rAF(_ => rAF(() => resolve(state.data))))
			},
			get() {
				return dup(state.data)
			},

			getRaw(){
				return state.data
			}
		},

		render(data = state.data) {

			if (!document.body.contains(elm)) {
				return
			}

			state.data = Object.assign(state.data, data)

			const newdata = dup(state.data)
			const newhtml = base.template.call(options.view(newdata), elm, safe, $scopes)

			morphdom(elm, newhtml, morphdomOptions(elm))

			rAF(_ => {
				Array
					.from(elm.querySelectorAll('[tplid]'))
					.forEach((child: any) => {
						const data = Object.assign( child.base.state.getRaw(), newdata)
						child.options.onupdate(data)
						child.base.render(data)
					})
			})
		},

		innerHTML( html ) {
			const parser = new DOMParser()
			const virtual = parser.parseFromString(elm.outerHTML, 'text/html')
			virtual.body.firstElementChild.innerHTML = html
			rAF( _ => morphdom(elm, virtual.body.innerHTML, morphdomOptions(elm)))
		}
	}

	return { base, options }
}

const getOptions = (module) => ({
	main: (a) => a,
	unmount: (a) => a,
	onupdate: (a) => a,
	view: module.view ? module.view : (a) => a
})

const morphdomOptions = (_parent ) => ({
	onNodeAdded: onUpdates,
	onElUpdated: onUpdates,
	onBeforeElChildrenUpdated: checkStatic,
	onBeforeElUpdated: checkStatic
})

const checkStatic = (node) => {
	if ('html-static' in node.attributes) {
		return false
	}
}

const onUpdates = (node) => {
	if (node.nodeType === 1) {
		if ( node.getAttribute('tplid') ) {
			return false
		}
	}
	return node
}
