import { stripTemplateTag, dup, rAF, createTemplate, uuid } from './utils'
import sodajs from 'sodajs'
import morphdom from 'morphdom'
import { setSodaConfig } from './soda-config'

setSodaConfig( sodajs )

const templates = {}

export const Element = ( el:HTMLElement ) => {

	stripTemplateTag( el )

	let updates = []

	const model = Object.assign({}, JSON.parse(el.dataset.initialState || '{}'))
	const morphdomOptions = lifecycle(el)
	const { template, tplid } = getTemplateData(el)

	const api = {

		tplid,
		el,
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

		update( data ) {

			if( !document.body.contains(el) )
				return

			updates.push( data )

			rAF( _ => {

				if( updates.length ) {

					const originalData = {}
					updates.forEach( d => Object.assign(originalData, d ) )
					updates = []

					const newdata = Object.assign({}, dup(api.model), dup(originalData))
					morphdom( el, sodajs(template, newdata), morphdomOptions )

					api.model = Object.assign( api.model, originalData )

					Array
						.from( el.querySelectorAll('[data-component]') )
						.filter( node => Boolean( node.__instance__ ) )
						.forEach( node => {
							const initialState = JSON.parse(node.dataset.initialState || {})
							const parent = Object.assign({}, api.model )
							const newdata = Object.assign({}, initialState, { parent })
							node.__instance__.update(newdata)
						})
				}
			})
		}
	}

	el.__instance__ = api

	return api
}

const lifecycle = ( element: HTMLElement ) => {
	return {
		onBeforeElUpdated: update(element),
		onBeforeElChildrenUpdated: update(element),
		getNodeKey(node) {
			if( node.nodeType === 1 && node.dataset.tplid )
				return node.dataset.key || node.dataset.tplid
			return false
		}
	}
}

const update = ( element: HTMLElement ) => ( node: HTMLElement, toEl: HTMLElement ) => {
	if ( node.isEqualNode(toEl) )
		return false
	if( node.nodeType == 1 ) {
		if( 'static' in node.dataset )
			return false
	}
	return true
}

const getTemplateData = ( element: HTMLElement ) => {
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
