import morphdom from 'morphdom'
import sodajs from 'sodajs'

import { uuid, stripTemplateTags, rAF } from './utils'
import * as Pubsub from './utils/pubsub'
import sodaSetConfig from './soda-config'

import Component from './component'

sodaSetConfig( sodajs )

let AST = []
const components = {}

export default {

	start() {
		Template.start()
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
		Template.scan( document.body, Element )
	},

	scan( root, callback ) {
		if( root.nodeType === 1 ) {
			const list = Array.from( root.querySelectorAll('[data-component]') )
			const components = root.dataset.component? [root].concat(list) : list
			components.reverse().forEach( callback )
		}
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
		const item = AST.find( item => item.element == node )
		if( item ){
			item.dispose()
		}
	}
}

const Element = ( element ) => {

	let tplid
	let template

	if( element.getAttribute('tplid') ) {
		tplid = element.getAttribute('tplid')
		const item = AST.find( item => item.tplid == tplid )
		template = item.template
	}else {
		tplid = uuid()
		element.setAttribute('tplid', tplid)
		template = createTemplate(element.outerHTML)
	}

	const ElementInterface = {
		tplid,
		element,
		template,
		instances:{},
		destroyers:[],
		promises: [],
		view: data => data,
		dispose(){
			if( ElementInterface.promises.length ){
				Promise.all(ElementInterface.promises).then(_ => {
					this.destroyers.forEach( destroy => destroy(ElementInterface) )
				})
			}else {
				this.destroyers.forEach( destroy => destroy(ElementInterface) )
			}
		},

		model: Object.assign({}, JSON.parse(element.getAttribute('initialState'))),

		update( data ) {

			this.model = Object.assign( {}, this.model, data )

			morphdom( element, sodajs( this.template, this.view(this.model) ), {
				onNodeDiscarded(node) {
					Template.scan(node, Template.remove)
					return true
				},
				onBeforeElUpdated(node, toEl) {
					if (node.isEqualNode(toEl))
						return false
					if( node.nodeType == 1 && 'static' in node.dataset )
						return false
					return true
				}
			})

			rAF(_ => {
				const elements = Array.from(element.querySelectorAll('[data-component]'))
				elements.forEach( node => {
					const initialState = JSON.parse(node.getAttribute('initialState')) || {}
					const item = AST.find( item => item.element == node )
					if( item ) {
						item.update( Object.assign(initialState, { parent:this.model }) )
					}
				})
			})
		}
	}

	AST.push( ElementInterface )

	element.dataset.component.split(/\s/).forEach( name => {

		const C = components[name]

		if( !C ) {
			console.warn(`Jails - Module ${name} not registered`)
			return
		}

		const { module, dependencies } = C
		ElementInterface.model = Object.assign({}, module.model, ElementInterface.model )

		const base = Component({ name, element, dependencies, Pubsub, ElementInterface, AST })

		const promise = module.default(base)

		if( promise && promise.then ) {
			ElementInterface.promises.push(promise)
		}

		base.__initialize()
		ElementInterface.view = module.view || ElementInterface.view
		ElementInterface.instances[name] = { methods: {} }
	})

	ElementInterface.update()
}

const createTemplate = ( html ) => {
	const vhtml = stripTemplateTags( html )
	const vroot = document.createElement('div')
	vroot.innerHTML = vhtml
	const components = Array.from(vroot.querySelectorAll('[data-component]'))
	components.forEach( c => {
		const cache = AST.find( item => item.tplid === c.getAttribute('tplid') )
		if( cache )
			c.outerHTML = cache.template
	})
	return vroot.innerHTML
}
