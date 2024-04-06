import { type Component } from '..'
import morphdom from 'morphdom'

import { rAF, dup, safe } from './utils'
import { buildtemplates } from './template-system'
import { on, off, trigger } from './utils/events'
import { publish, subscribe } from './utils/pubsub'

export default function Component( elm, { module, dependencies, templates, components }) {

	const options = getOptions( module )
	const initialState = (new Function( `return ${elm.getAttribute('html-model') || '{}'}`))()
	const selector = Object.keys(components).toString()

	buildtemplates( elm, selector, templates, components )

	const tplid = elm.getAttribute('tplid')
	const template = tplid ? templates[tplid] : null
	const state = { data: module.model ? dup(module.model) : {} }
	state.data = Object.assign( state.data, initialState)

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
			const newhtml = templates[tplid].call(Object.assign(options.view(newdata), elm.___scope___), elm, safe)

			morphdom(elm, newhtml, morphdomOptions(elm))

			rAF(_ => {
				Array
					.from(elm.querySelectorAll('[tplid]'))
					.forEach((child: any) => {
						const props = Object.assign( child.base.state.getRaw(), data )
						child.options.onupdate(props)
						child.base.render(props)
					})
			})
		},

		innerHTML( target, html_ ) {

			const element = html_? target : elm
			const parser = new DOMParser()
			const virtual = parser.parseFromString(element.outerHTML, 'text/html')
			const html = html_? html_ : target

			virtual.body.firstElementChild.innerHTML = html as string
			rAF( _ => morphdom(element, virtual.body.innerHTML, morphdomOptions(elm)))
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
		if( 'scope' in node.attributes ) {
			node.querySelectorAll('[tplid]').forEach( cp => {
				if( !cp.___scope___ ) {
					const script = node.lastElementChild
					cp.___scope___ = 'scope' in script.dataset? (new Function(`return ${script.text}`))() : {}
				}
			})
		}
		if ( node.getAttribute('tplid') ) {
			return false
		}
	}
	return node
}
