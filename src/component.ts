import morphdom from 'morphdom'

import { rAF, dup, buildtemplates } from './utils'
import { on, off, trigger } from './utils/events'
import { publish, subscribe, unsubscribe } from './utils/pubsub'

type MainArgs = () => Array<Function>

export default function Component(elm, { module, dependencies, templates, components }) {

	const options = getOptions(module)

	buildtemplates(elm, components, templates)

	const tplid = elm.getAttribute('tplid')

	const template = templates[tplid]
	const state = { data: module.model ? dup(module.model) : {} }

	let batchUpdates = []

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
			if (target.constructor === String)
				trigger(elm.querySelector(target), eventName, { args: args })
			else trigger(elm, eventName, { args: target })
		},

		emit: (...args) => {
			trigger(elm, args.shift(), { args: args })
		},

		state: {
			set(data: any) {
				if (data.constructor === Function) {
					const newstate = dup(state.data)
					data(newstate)
					base.render(newstate)
				} else {
					base.render(data)
				}
				return new Promise((resolve) => rAF(_ => rAF(resolve)))
			},
			get() {
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
				rAF(_ => {
					Array
						.from(elm.querySelectorAll('[tplid]'))
						.forEach(child => {
							child.options.onupdate(newdata)
							child.base.render(newdata)
						})
				})

			})

		}
	}

	return { base, options }
}

const getOptions = (module) => ({
	main: _ => _,
	unmount: _ => _,
	onupdate: _ => _,
	view: module.view ? module.view : _ => _
})

const morphdomOptions = (_parent, options) => ({

	onNodeAdded: onUpdates(_parent, options),
	onElUpdated: onUpdates(_parent, options),
	onBeforeElChildrenUpdated: checkStatic,
	onBeforeElUpdated: checkStatic,

	getNodeKey(node) {
		if (node.nodeType === 1 && node.getAttribute('tplid'))
			return node.dataset.key || node.getAttribute('tplid')
		return false
	}
})

const checkStatic = (node) => {
	if ('static' in node.dataset) {
		return false
	}
}

const onUpdates = (_parent, options) => (node) => {

	if (node.nodeType === 1) {

		if (node.getAttribute && node.getAttribute('scope')) {

			const scope = JSON.parse(node.getAttribute('scope').replace(/\'/g, '\"'))

			Array.from(node.querySelectorAll('[tplid]'))
				.map(el => {
					const data = Object.assign({}, _parent.base.state.get(), scope)
					options.onupdate(data)
					el.base.render(data)
				})

			node.removeAttribute('scope')
		}
	}
}
