import morphdom from 'morphdom'
import sodajs from 'sodajs'

import Element from './element'

import { nextFrame, setIds, dup, getTemplate } from './utils'
import { fire } from './events'

import * as animation from './animation'
import repeatDirective from './repeat'

export default ( modules ) => {

	sodajs.prefix('v-')

	const root = document.body
	const Template = setIds( getTemplate( root.innerHTML ) )
	const { dom, templates } = Template
	const SST = {}
	const models = {}

	repeatDirective({ sodajs, models })

	root.innerHTML = sodajs(dom, {})

	const base = {

		templates,
		models,

		observe() {
			observe()
		},

		update( node, data = {} ){

			const cache = JSON.stringify(data)

			if( node.__cache__ && node.__cache__ === cache )
				return

			if( node ){
				const id = node.dataset.reactorId
				const template = templates[id]
				const newstate = dup(data)
				models[id] = Object.assign({}, models[id], newstate)
				morphdom(node, sodajs(template, models[id]), lifecycle(node, data, SST))
				node.__cache__ = cache
			}
		},

		destroy(el){

			for( let ev in el.__events)
				el.removeEventListener(ev, el.__events[ev].listener)

			if( el.dataset.modelId )
				delete models[el.dataset.modelId]

			fire(el, ':destroy')

			delete el.__events
			delete el.__instances__
		},

		scan( root = document.documentElement ){

			const elements = Array
				.from(root.querySelectorAll('[data-component]'))
				.reverse()

			elements.forEach(element => {

				// Shoudn't create template and start instance if there's no mixin registered
				const list = element.dataset.component.split(/\s/)
				const hasMixin = list.some(name => name in modules)

				if ( element.__instances__ || !hasMixin )
					return

				const components = element.dataset.component.split(/\s/)
				const El = Element( element, base )

				components.forEach(name => {
					if( modules[name] )
						nextFrame( _ => El.create({ name, module: modules[name] }) )
				})
			})
		},

		scanSingle(element){

			// Shoudn't create template and start instance if there's no mixin registered
			const list = element.dataset.component.split(/\s/)
			const hasMixin = list.some(name => name in modules)

			if (element.__instances__ || !hasMixin)
				return

			const newTemplate = setIds(getTemplate(element.outerHTML), 'div')
			Object.assign(templates, newTemplate.templates)

			morphdom(element, sodajs(newTemplate.dom, {}))

			const components = element.dataset.component.split(/\s/)
			const El = Element(element, base)

			components.forEach(name => {
				if (modules[name])
					El.create({ name, module: modules[name] })
			})
		}
	}

	const observe = () => {
		const observer = new MutationObserver( mutations => mutations.forEach(onMutation) )
		observer.observe( document.body, { childList: true, subtree: true })
		return observer;
	}

	const onMutation = (mutation) => {
		if (mutation.type == 'childList') {
			if (mutation.addedNodes.length) {
				mutatedComponents(mutation.addedNodes, base.scanSingle)
				// base.scan()
			} else if (mutation.removedNodes.length) {
				mutatedComponents(mutation.removedNodes, base.destroy, true)
			}
		}
	}

	const mutatedComponents = (nodeList, callback, isRemoving = false) => {

		const nodes = Array.from(nodeList).reduce((acc, node) => {
			return node.querySelectorAll
				? [node].concat(Array.from(node.querySelectorAll('[data-component]')))
				: [node]
		}, []).reverse()

		nodes.forEach(node => {
			// Bug when morphdom updates an element and fires a mutation event as if that elements was removed.
			// Trying to prevent that situation when element was fired as removed but it remains on document.
			if (isRemoving && document.body.contains(node))
				return
			if (node.nodeType === 1 && node.dataset.component)
				callback(node)
		})
	}

	return base
}

const lifecycle = ( elm, data, SST ) => ({

	getNodeKey( node ) {

		if( node.nodeType === 1 ){
			return node.dataset.key || node.id || node.dataset.reactorId
		}
	},

	onBeforeElUpdated(node){
		if (node.nodeType === 1) {
			if ('static' in node.dataset)
				return false
			if (node !== elm && node.dataset.component && node.__update__) {
				const newdata = Object.assign(SST, data)
				node.__update__(newdata)
				Array.from(node.querySelectorAll('[data-component]')).forEach(el => {
					if (el.dataset.component && el.__update__)
						el.__update__(newdata)
				})
				return false
			}
		}
	},

	onBeforeElChildrenUpdated( node, tonode ){

		if( node.nodeType === 1 ){
			if ( 'static' in node.dataset )
				return false
			if ( node !== elm && node.dataset.component && node.__update__ ) {
				const newdata = Object.assign(SST, data)
				node.__update__(newdata)
				Array.from(node.querySelectorAll('[data-component]')).forEach( el => {
					if( el.dataset.component && el.__update__)
						el.__update__(newdata)
				})
				return false
			}
		}
		return true
	},

	onNodeAdded(node) {
		animation.animateNodes(node, animation.onAdd)
	},

	onBeforeNodeAdded(node) {
		animation.animateNodes(node, animation.onBeforeAdd)
	},

	onBeforeNodeDiscarded(node) {
		return !animation.animateNodes(node, animation.onRemove)
	}
})
