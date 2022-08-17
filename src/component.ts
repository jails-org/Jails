import morphdom from 'morphdom'

import { rAF, dup, buildtemplates } from './utils'
import { on, off, trigger } from './utils/events'
import { publish, subscribe, unsubscribe } from './utils/pubsub'

type MainArgs = () => Array<Function>

export default function Component( elm:HTMLElement, { module, dependencies, templates, components }) {

	const options = getOptions( module )
	buildtemplates( elm, components, templates )

	const tplid:string|null = elm.getAttribute('tplid')
	const template = tplid ? templates[tplid] : null
	const state = { data: module.model ? dup(module.model) : {} }

	const base = {
		template,
		elm,
		dependencies,
		publish,
		subscribe,
		unsubscribe,

		main(fn: MainArgs) {
			options.main = fn
		},

		unmount(fn) {
			options.unmount = fn
		},

		onupdate(fn) {
			options.onupdate = fn
		},

		on(eventName: string, selectorOrCallback: object | Function, callback: Function) {
			on(elm, eventName, selectorOrCallback, callback)
		},

		off(eventName: string, callback: Function) {
			off(elm, eventName, callback)
		},

		trigger(eventName: string, target: string, args: any) {
			if (target.constructor === String) {
				Array
					.from(elm.querySelectorAll(target))
					.forEach( children => trigger(children, eventName, { args: args }) )
			}
			else trigger(elm, eventName, { args: target })
		},

		emit: (...args: any) => {
			trigger(elm, args.shift(), { args: args })
		},

		state: {
			set( data: any ) {
				if (data.constructor === Function) {
					const newstate = dup(state.data)
					data(newstate)
					base.render(newstate)
				} else {
					base.render(data)
				}
				return new Promise((resolve) => rAF(_ => rAF(resolve)))
			},
			get(): object {
				return dup(state.data)
			}
		},

		render(data: object = state.data) {

			if (!document.body.contains(elm))
				return

			state.data = Object.assign(state.data, data)

			const newdata = dup(state.data)
			const newhtml = base.template(options.view(newdata))

			morphdom(elm, newhtml, morphdomOptions(elm, options))

			rAF(_ => {
				Array
					.from(elm.querySelectorAll('[tplid]'))
					.forEach((child: any) => {
						child.options.onupdate(newdata)
						child.base.render(newdata)
					})
			})
		}
	}

	return { base, options }
}

const getOptions = (module: any) : any => ({
	main: (a:any) => a,
	unmount: (a:any) => a,
	onupdate: (a:any) => a,
	view: module.view ? module.view : (a:any) => a
})

const morphdomOptions = (_parent: HTMLElement, options: any) => ({

	onNodeAdded: onUpdates(_parent, options),
	onElUpdated: onUpdates(_parent, options),
	onBeforeElChildrenUpdated: checkStatic,
	onBeforeElUpdated: checkStatic,

	getNodeKey(node: HTMLElement) {
		if (node.nodeType === 1 && node.getAttribute('tplid'))
			return node.dataset.key || node.getAttribute('tplid')
		return false
	}
})

const checkStatic = (node: HTMLElement) => {
	if ('static' in node.dataset) {
		return false
	}
}

const onUpdates = (_parent: HTMLElement, options: any) => (node: HTMLElement) => {

	if (node.nodeType === 1) {

		if (node.getAttribute && node.getAttribute('scope')) {

			const scope = JSON.parse((node.getAttribute('scope') ||'').replace(/\'/g, '\"'))

			Array.from(node.querySelectorAll('[tplid]'))
				.map((el: any) => {
					const data = Object.assign({}, _parent.base.state.get(), scope)
					options.onupdate(data)
					el.base.render(data)
				})

			node.removeAttribute('scope')
		}
	}

	return node
}
