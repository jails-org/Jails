import morphdom from 'morphdom'
import sodajs from 'sodajs'

import { uuid, stripTemplateTags, rAF } from './utils'
import * as Pubsub from './utils/pubsub'
import sodaSetConfig from './sodaConfig'

import Component from './component'

sodaSetConfig( sodajs )

let AST = []
const components = {}

export default {

	start() {
		Template.start()
		Template.scan( document.body, Element )
		Template.observe()
	},

	register( name, module, dependencies = {} ) {
		components[name] = { name, module, dependencies }
	}
}

const Template = {

	start() {
		const body = document.body
		const html = stripTemplateTags( body.innerHTML )
		body.innerHTML = html
	},

	scan( root, callback ) {
		const list = Array.from( root.querySelectorAll('[data-component]') )
		const components = root.dataset.component? [root].concat(list) : list
		components.reverse().forEach( callback )
	},

	observe() {
		const observer = new MutationObserver(mutations => mutations.forEach( mutation => {
			if (mutation.type === 'childList') {
				if (mutation.addedNodes.length) {
					Array.from(mutation.addedNodes).forEach( node => Template.scan(node, Element) )
				} else if (mutation.removedNodes.length) {
					Array.from(mutation.removedNodes).forEach( node => Template.scan(node, Template.remove) )
				}
			}
		}))
		observer.observe(document.body, { childList: true, subtree: true })
	},

	remove( node ) {
		AST = AST.filter( item => item.element != node )
	}
}

const Element = ( element ) => {

	let tplid
	let template

	if( element.getAttribute('tplid') ) {
		tplid = element.getAttribute('tplid')
		template = AST.find( item => item.tplid == tplid ).template
	}else {
		tplid = uuid()
		element.setAttribute('tplid', tplid)
		template = stripTemplateTags( element.outerHTML )
	}

	const ElementInterface = {

		tplid,
		element,
		template,
		instances:{},
		view: data => data,

		model: Object.assign({}, JSON.parse(element.getAttribute('initialState'))),

		update( data ) {

			this.model = Object.assign( this.model, data )

			morphdom( element, sodajs( this.template, ElementInterface.view(this.model) ), {
				onBeforeElUpdated(node, toEl) {
					if (node.isEqualNode(toEl))
						return false
					return true
				}
			})

			rAF( _ => {
				const elements = Array.from(element.querySelectorAll('[data-component]'))
				elements.forEach( node => {
					const initialState = JSON.parse(node.getAttribute('initialState')) || {}
					const item = AST.find( item => item.element == node )
					item.update( Object.assign(initialState, { parent:ElementInterface.model }) )
				})
			})
		}
	}

	AST.push( ElementInterface )

	const cs = element.dataset.component.split(/\s/)

	cs.forEach( name => {

		const C = components[name]
		const { module, dependencies } = C
		const base = Component({ name, element, dependencies, Pubsub, ElementInterface, AST })

		Object.assign(ElementInterface.model, module.model)
		module.default(base)
		base.__initialize()

		ElementInterface.view = module.view || ElementInterface.view
		ElementInterface.update()
		ElementInterface.instances[name] = { methods: {} }
	})
}
