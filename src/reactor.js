import morphdom from 'morphdom'
import sodajs from 'sodajs'

import Element from './element'

import { nextFrame, setIds, uuid, dup, getTemplate } from './utils'
import { fire } from './events'

import * as animation from './animation'

export default ( modules ) => {

	sodajs.prefix('v-')

	const root = document.documentElement
	const Template = setIds( getTemplate( root.innerHTML ) )
	const { dom, templates } = Template
	const SST = {}

	morphdom( root, sodajs(dom, {}) )

	const base = {

		templates,

		observe() {
			observe()
		},

		update( node, data = {} ){

			const cache = JSON.stringify(data)

			if( node.__cache__ && node.__cache__ == cache )
				return

			if( node ){
				const id = node.dataset.reactorId
				const template = templates[id]
				const newstate = dup(data)
				nextFrame( _ => morphdom(node, sodajs(template, newstate), lifecycle(node, data, SST)) )
				node.__cache__ = cache
			}
		},

		destroy(el){
			for( let ev in el.__events)
				el.removeEventListener(ev, el.__events[ev].listener)
			delete el.__events
			fire(el, ':destroy')
		},

		scan( root = document.documentElement ){

			const elements = Array
				.from(root.querySelectorAll('[data-component]'))
				.reverse()

			elements.forEach(element => {
				if ( element.__instances__ )
					return

				const components = element.dataset.component.split(/\s/)
				const El = Element( element, base )
				components.forEach(name => El.create({ name, module: modules[name] }))
			})
		},

		scanSingle(element){
			const newTemplate = setIds(getTemplate(element.outerHTML), 'div')
			Object.assign(templates, newTemplate.templates)
			morphdom(element, sodajs(newTemplate.dom, {}))
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
				base.scan()
			} else if (mutation.removedNodes.length) {
				mutatedComponents(mutation.removedNodes, base.destroy)
			}
		}
	}

	const mutatedComponents = (nodeList, callback) => {

		const nodes = Array.from(nodeList).reduce((acc, node) => {
			return node.querySelectorAll
				? [node].concat(Array.from(node.querySelectorAll('[data-component]')))
				: [node]
		}, []).reverse()

		nodes.forEach(node => {
			if (node.nodeType !== 3 && node.dataset.component)
				callback(node)
		})
	}

	return base
}

const lifecycle = ( elm, data, SST ) => ({

	getNodeKey( node ) {

		if( node.nodeType !== 3){
			return node.dataset.key || node.id || node.dataset.reactorId
		}
	},

	onBeforeElChildrenUpdated( node, tonode ){

		if( node.nodeType !== 3 ){
			if ( 'static' in node.dataset )
				return false
			if ( node !== elm && node.dataset.component && node.__update__ ) {
				node.__update__( Object.assign(SST, data) )
				return false
			}
		}
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
