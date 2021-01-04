import morphdom from 'morphdom'
import sodajs from 'sodajs'

import * as animation from './animation'
import { dup, createTemplates, setIds } from './utils'
import repeatDirective from './repeat'

const STATIC = 'static'
const COMPONENT = '[data-component]'

export default function View( callback ) {

	const root = document.body
	const { templates, html } = createTemplates(root.innerHTML, 'html')
	const models = {}
	const SST = {}

	sodajs.prefix('v-')
	repeatDirective({ sodajs, models })

	return {

		mode : 'production',
		templates,
		models,
		SST,

		update( element, data ){
			if (element) {
				const id = element.dataset.reactorId
				const template = templates[id]
				const newstate = Object.assign({}, element.__model__, dup(data))
				const newhtml = sodajs(template, newstate)
				morphdom( element, newhtml, lifecycle(element, data, SST))
				if( element.__model__ ){
					Object.assign( element.__model__, newstate )
				}
			}
		},

		observe() {
			const observer = observe( callback )
			root.innerHTML = sodajs(html, {})
			return observer
		},

		setNewElement(element){
			setIds(templates, element)
		}
	}
}

const observe = ( callback ) => {
	const observer = new MutationObserver(mutations => mutations.forEach(onMutation(callback)))
	observer.observe(document.body, { childList: true, subtree: true })
	return observer;
}

const onMutation = (callback) => (mutation) => {
	if (mutation.type === 'childList') {
		if (mutation.addedNodes.length) {
			callback.onAdd(scan())
		} else if (mutation.removedNodes.length) {
			callback.onRemove(mutation.removedNodes)
		}
	}
}

const scan = () => {
	return Array
		.from( document.querySelectorAll(COMPONENT) )
		.reverse()
}

const lifecycle = (elm, data, SST) => ({

	getNodeKey(node) {
		if (node.nodeType === 1) {
			return node.dataset.key || node.dataset.reactorId
		}
		return false
	},

	onBeforeElUpdated(node) {
		return update( elm, data, SST, node )
	},

	onBeforeElChildrenUpdated(node, tonode) {
		return update( elm, data, SST, node )
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

const update = (elm, data, SST, node) => {

	if (node.nodeType === 1) {
		// If element has static property, don't update
		if ( STATIC in node.dataset )
			return false

		// If element is child and a component, don't update
		if (node !== elm && node.dataset.component && node.__update__) {

			const newdata = Object.assign(SST, data)
			node.__update__(newdata)

			Array.from(node.querySelectorAll(COMPONENT)).forEach(el => {
				if (el.dataset.component && el.__update__)
					el.__update__(newdata)
			})

			return false
		}
	}
}
