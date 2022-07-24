import { rAF, dup, buildtemplates } from './utils'
import { on, off, trigger } from './utils/events'
import { publish, subscribe, unsubscribe } from './utils/pubsub'
import morphdom from 'morphdom'

type MainArgs = () => Array<Function>

export default function WebComponent(module, dependencies, templates, components) {

	return class extends HTMLElement {

		constructor() {

			super()

			let batchUpdates = []

			buildtemplates(this, components, templates)

			const tplid = this.getAttribute('tplid')
			const template = templates[tplid]

			this.__internal__ = {
				main: () => null,
				unmount: () => null,
				mount: () => null,
				onupdate: () => null,
				view: module.view ? module.view : _ => _,
				state: module.model ? dup(module.model) : {}
			}

			this.base = {
				template,
				dependencies,
				publish,
				subscribe,
				unsubscribe,
				elm: this,

				main: (fn: MainArgs) => { this.__internal__.main = fn },
				unmount: (fn: () => null) => { this.__internal__.unmount = fn },
				mount: (fn: () => null) => { this.__internal__.mount = fn },
				onupdate: (fn: () => null) => { this.__internal__.onupdate = fn },

				render: (data: any = this.__internal__.state) => {

					if (!document.body.contains(this))
						return


					batchUpdates.push(this.__internal__.view(data))

					rAF(_ => {

						if (batchUpdates.length) {

							const batchData = {}
							batchUpdates.forEach(d => Object.assign(batchData, d))
							batchUpdates = []

							this.__internal__.state = Object.assign(this.__internal__.state, batchData)

							const newdata = dup(this.__internal__.state)
							const newhtml = this.base.template(newdata)

							morphdom(this, newhtml, morphdomOptions(this, data))

							Array
								.from(this.querySelectorAll('*'))
								.filter(el => el.__internal__)
								.map(el => rAF(_ => el.base.render()))
						}
					})
				},

				state: {
					set: (data: any) => {
						if (data.constructor === Function) {
							const newstate = dup(this.__internal__.state)
							data(newstate)
							this.base.render(newstate)
						} else {
							this.base.render(data)
						}
						return new Promise((resolve) => rAF(_ => rAF(resolve)))
					},

					get: () => {
						return dup(this.__internal__.state)
					}
				},

				on: (eventName: string, selectorOrCallback: object | Function, callback: Function) => {
					on(this, eventName, selectorOrCallback, callback)
				},

				off: (eventName: string, callback: Function) => {
					off(this, eventName, callback)
				},

				trigger: (eventName: string, target: string, args: any) => {
					if (target.constructor === String)
						trigger(this.querySelector(target), eventName, { args: args })
					else trigger(this, eventName, { args: target })
				},

				emit: (...args) => {
					trigger(this, args.shift(), { args: args })
				}
			}

			module.default(this.base)
		}

		connectedCallback() {
			this.base.render()
			this.__internal__.mount(this.base)
			this.__internal__.main().forEach(f => f(this.base))
		}

		disconnectedCallback() {
			this.__internal__.unmount(this.base)
			delete this.__internal__
			delete this.base
			delete this.__events
		}

		attributeChangedCallback() {
			//TODO
		}
	}
}

const morphdomOptions = (_parent, data) => {

	return {

		onNodeAdded: onUpdates(_parent),
		onElUpdated: onUpdates(_parent),
		onBeforeElChildrenUpdated: checkStatic,
		onBeforeElUpdated: checkStatic,

		getNodeKey(node) {
			if (node.nodeType === 1 && node.getAttribute('tplid'))
				return node.dataset.key || node.getAttribute('tplid')
			return false
		}
	}
}

const checkStatic = (node) => {
	if ('static' in node.dataset) {
		return false
	}
}

const onUpdates = (_parent) => (node) => {

	if (node.nodeType === 1) {

		if (node.getAttribute && node.getAttribute('scope')) {

			const scope = JSON.parse(node.getAttribute('scope').replace(/\'/g, '\"'))

			Array.from(node.querySelectorAll('*'))
				.filter(el => el.__internal__)
				.map(el => {
					const data = Object.assign(el.__internal__.state, dup(_parent.__internal__.state), scope)
					el.base.render(Object.assign(data, el.__internal__.onupdate(data)))
					return el
				})

			node.removeAttribute('scope')
		}
	}
}
