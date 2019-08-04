import morphdom from 'morphdom'
import sodajs from 'sodajs'

import Element from './element'

import { getTemplate, nextFrame, setIds } from './utils'
import { uuid } from './utils'
import { fire } from './events'

import * as animation from './animation'

export default ( modules ) => {

	sodajs.prefix('v-')

	const root = document.documentElement
	const Template = setIds( getTemplate( root ) )
	const { dom, templates } = Template
	const SST = {}

	morphdom( root, sodajs(dom, {}) )

	const base = {

		templates,

		observe() {
			observe()
		},

		update( id, data = {} ){
			const node = document.querySelector(`[data-reactor-id="${id}"]`)
			if( node ){
				const template = templates[id]
				nextFrame(_ => morphdom(node, sodajs(template, data), lifecycle(node, data, SST)))
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

			if( !element.dataset.reactorId){
				const id = uuid()
				element.setAttribute('data-reactor-id', id)
				templates[id] = element.outerHTML
			}

			const components = element.dataset.component.split(/\s/)
			const El = Element(element, base)
			components.forEach( name => El.create({ name, module: modules[name] }) )
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
			} else if (mutation.removedNodes.length) {
				mutatedComponents(mutation.removedNodes, base.destroy)
			}
		}
	}

	const mutatedComponents = (nodeList, callback) => {

		const nodes = Array.from(nodeList).reverse().reduce((acc, node) => {
			return node.querySelectorAll
				? [node].concat(Array.from(node.querySelectorAll('[data-component]')))
				: [node]
		}, [])

		nodes.forEach(node => {
			if (node.nodeType !== 3 && node.dataset.component)
				callback(node)
		})
	}

	return base
}


const lifecycle = ( elm, data, SST ) => ({

	getNodeKey( node ) {
		if( node.nodeType !== 3 ){
			return node.dataset.key || node.id || node.dataset.reactorId
		}
	},

	onBeforeElChildrenUpdated( node, tonode ){

		if( node.nodeType !== 3 ){
			if ( node.dataset.static )
				return false
			if ( node !== elm && node.dataset.component ) {
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
