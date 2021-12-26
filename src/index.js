import morphdom from 'morphdom'
import sodajs from 'sodajs'

import { uuid, stripTemplateTags, stripTemplateTag, rAF, dup } from './utils'
import * as Pubsub from './utils/pubsub'
import sodaSetConfig from './soda-config'

import Component from './component'

sodaSetConfig( sodajs )

let SST = {}
const templates = {}
const components = {}

export default {

	start() {
		stripTemplateTag( document.body )
		Template.observe()
		Template.start()
	},

	register( name, module, dependencies = {} ) {
		components[name] = { name, module, dependencies }
	}
}

const Template = {

	start() {
		Template.scan( document.body, Element )
	},

	scan( root, callback ) {
		if( root.nodeType === 1 ) {
			const list = Array.from( root.querySelectorAll('[data-component]') )
			const components = root.dataset.component? [root].concat(list) : list
			if( components.length ) {
				components.reverse().forEach( callback )
			}
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
		if( node.__instance__)
			node.__instance__.dispose()
	}
}

const Element = ( element ) => {

	let tplid
	let template

	if( element.getAttribute('tplid') ) {
		tplid = element.getAttribute('tplid')
		template = templates[tplid]
	}else {
		tplid = uuid()
		element.setAttribute('tplid', tplid)
		templates[tplid] = createTemplate(element.outerHTML)
		template = templates[tplid]
	}

	const ElementInterface = {
		tplid,
		element,
		template,
		instances:{},
		destroyers:[],
		promises: [],
		view: data => data,
		parentUpdate: data => null,
		model: Object.assign({}, JSON.parse(element.getAttribute('initialState'))),
		dispose(){
			if( ElementInterface.promises.length ){
				Promise.all(ElementInterface.promises)
					.then(_ => this.destroyers.forEach( destroy => destroy(ElementInterface) ))
			}else {
				this.destroyers.forEach( destroy => destroy(ElementInterface) )
			}
		},
		update( data, isParentUpdate = false ) {

			if( !document.body.contains(element) ) {
				return
			}

			SST = saveGlobal(data)
			ElementInterface.model = Object.assign({ global: SST }, ElementInterface.model, data )

			if( isParentUpdate )
				ElementInterface.parentUpdate( ElementInterface.model )

			const newhtml = sodajs( ElementInterface.template, ElementInterface.view(ElementInterface.model) )

			morphdom( element, newhtml, {
				getNodeKey(node) {
					if( node.nodeType === 1 && node.dataset.tplid )
						return node.dataset.key || node.dataset.tplid
					return false
				},
				onNodeDiscarded(node) {
					Template.scan(node, Template.remove)
					return true
				},
				onBeforeElUpdated: update(element),
				onBeforeElChildrenUpdated: update(element)
			})

			Array
				.from(element.querySelectorAll('[data-component]'))
				.forEach( node => {
					if( !node.__instance__ ) return
					const { global, parent, ...model } = ElementInterface.model
					const attrInitialState = node.getAttribute('initialState')
					const finalState = attrInitialState? JSON.parse(attrInitialState) : {}
					const newmodel = Object.assign(finalState, { parent:model, global: SST })
					rAF( _ => node.__instance__.update(newmodel, true) )
				})
		}
	}

	element.__instance__ = ElementInterface

	element.dataset.component.split(/\s/).forEach( name => {

		const C = components[name]

		if( !C ) {
			console.warn(`Jails - Module ${name} not registered`)
			return
		}

		const { module, dependencies } = C
		ElementInterface.model = Object.assign({}, module.model, ElementInterface.model )

		const base = Component({ name, element, dependencies, Pubsub, ElementInterface })

		const promise = module.default(base)

		if( promise && promise.then ) {
			ElementInterface.promises.push(promise)
		}

		base.__initialize()
		ElementInterface.view = module.view || ElementInterface.view
		ElementInterface.instances[name] = { methods: {} }
	})

	rAF( _ => ElementInterface.update() )
}

const update = (element) => (node, toEl) => {
	if (node.isEqualNode(toEl))
		return false
	if( node.nodeType == 1 && 'static' in node.dataset )
		return false
	return true
}

const createTemplate = ( html ) => {
	const vhtml = stripTemplateTags( html )
	const vroot = document.createElement('div')
	vroot.innerHTML = vhtml
	const components = Array.from(vroot.querySelectorAll('[data-component]'))
	components.forEach( c => {
		const tplid = c.getAttribute('tplid')
		const cache = templates[tplid]
		if( cache )
			c.outerHTML = cache
	})
	return vroot.innerHTML
}

const saveGlobal = (data) => {
	Object.assign(SST, data)
	delete SST.parent
	delete SST.global
	return SST
}
