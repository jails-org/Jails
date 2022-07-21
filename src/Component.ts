import { rAF, dup, stripTemplateTag, buildtemplates } from './utils'
import { on, off, trigger } from './utils/events'
import { publish, subscribe, unsubscribe } from './utils/pubsub'
import morphdom from 'morphdom'

type MainArgs = () => Array<Function>

export default function WebComponent(module, dependencies, templates, components) {

	return class extends HTMLElement {

		constructor() {

			super()
			stripTemplateTag(this)
			buildtemplates(this, components, templates)

			const tplid = this.getAttribute('tplid')
			const template = templates[tplid]

			this.__internal__ = {
				main: () => null,
				unmount: () => null,
				mount: () => null,
				onupdate: () => null,
				methods: {},
				state: module.model
					? dup(module.model)
					: (this.dataset.initialState ? JSON.parse(this.dataset.initialState) : {})
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
					this.__internal__.state = Object.assign(this.__internal__.state, data)
					const newdata = dup(this.__internal__.state)
					const newhtml = this.base.template(newdata)
					morphdom(this, newhtml, morphdomOptions(this, data))
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
			rAF(_ => {
				this.__internal__.main().forEach(f => f(this.base))
				this.__internal__.mount(this.base)
				this.base.render()
			})
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

		onNodeAdded: scopeElement(_parent),
		onElUpdated: scopeElement(_parent),

		onBeforeElChildrenUpdated(node) {

			if ('static' in node.dataset) {
				return false
			}

			return true
		},

		getNodeKey(node) {
			if (node.nodeType === 1 && node.getAttribute('tplid'))
				return node.dataset.key || node.getAttribute('tplid')
			return false
		}
	}
}

const scopeElement = (_parent) => (node) => {
	if (node.nodeType === 1) {
		if ('static' in node.dataset) {
			return false
		}
		if (node.getAttribute && node.getAttribute('scope')) {
			const scope = JSON.parse(node.getAttribute('scope').replace(/\'/g, '\"'))
			Array.from(node.querySelectorAll('*'))
				.filter(el => el.__internal__)
				.map(el => {
					const data = Object.assign(el.__internal__.state, _parent.__internal__.state, scope)
					el.__internal__.onupdate(data)
					return el
				})
			node.removeAttribute('scope')
		}
	}
}
