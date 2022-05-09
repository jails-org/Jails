import { stripTemplateTag, dup, rAF, createTemplate, uuid } from './utils'
import morphdom from 'morphdom'
import { setSodaConfig } from './soda-config'
import { Instances } from './Instances'

const sodajs = setSodaConfig()
const templates = {}

export const Element = ( el:HTMLElement ) => {

	stripTemplateTag( el )

	let updates = []

	const model = Object.assign({}, JSON.parse(el.dataset.initialState || '{}'))
	const morphdomOptions = lifecycle(el)
	const { template, tplid } = getTemplateData(el)

	const api = {

		tplid,
		template,
		model,
		parent: {},
		view : _ => _,
		instances:{},
		destroyers:[],
		promises: [],
		parentUpdate: data => null,

		dispose(){
			if( api.promises.length ){
				Promise.all(api.promises)
					.then(_ => api.destroyers.forEach( destroy => destroy(api) ))
			}else {
				api.destroyers.forEach( destroy => destroy(api) )
			}
		},

		update( data = {}, isParentUpdate ) {

			if( !document.body.contains(el) )
				return

			updates.push( data )

			rAF( _ => {

				if( updates.length ) {

					const newdata = {}
					updates.forEach( d => Object.assign(newdata, d ) )
					updates = []

					api.model = Object.assign( api.model, newdata )

					if( isParentUpdate ) {
						api.parentUpdate( api.model )
					}

					const newhtml = sodajs(template, api.view(dup(api.model)))
					morphdom( el, newhtml, morphdomOptions )

					Array
						.from( el.querySelectorAll('[data-component]') )
						.forEach( node => {
							if( !Instances.get(node) ) return
							const { parent, ...model } = api.model
							const initialState = node.dataset.initialState? JSON.parse(node.dataset.initialState): {}
							const newmodel = Object.assign(initialState, { parent:{ ...model, ...parent} })
							Instances.get(node).update( newmodel, true )
						})
				}
			})
		}
	}

	Instances.set(el, api)

	return api
}

const lifecycle = ( element: HTMLElement ) => {
	return {
		onBeforeElUpdated: update(element),
		onBeforeElChildrenUpdated: update(element),
		getNodeKey(node) {
			if( node.nodeType === 1 && node.getAttribute('tplid') )
				return node.dataset.key || node.getAttribute('tplid')
			return false
		}
	}
}

const update = ( element: HTMLElement ) => ( node: HTMLElement, toEl: HTMLElement ) => {
	if( node.nodeType == 1 ) {
		if( 'static' in node.dataset)
			return false
		if( node.dataset.component && Instances.get(node) && node !== element )
			return false
	}
	return true
}

const getTemplateData = ( element: HTMLElement ) => {

	Array
		.from(element.querySelectorAll('[data-component]'))
		.forEach( setTemplate )

	return setTemplate( element )
}

const setTemplate = (element) => {
	if( element.getAttribute('tplid') ) {
		const tplid = element.getAttribute('tplid')
		const template = templates[tplid]
		return { tplid, template }
	}else {
		const tplid = uuid()
		element.setAttribute('tplid', tplid)
		templates[tplid] = createTemplate(element.outerHTML, templates)
		const template = templates[tplid]
		return { tplid, template }
	}
}
