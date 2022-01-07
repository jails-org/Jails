import { stripTemplateTag, dup, rAF, createTemplate, uuid } from './utils'
import sodajs from 'sodajs'
import morphdom from 'morphdom'
import { setSodaConfig } from './soda-config'

setSodaConfig( sodajs )

const templates = {}

export const El = ( node: HTMLElement ) => {

	const element = Element( node )
	return element
}

export const createElement = ( node: HTMLElement ) => {

	const el = Element( node )
	el.__instance__ = el

	if( node.dataset.component == 'A' ) {
		console.log('A?')
		el.update({
			name: 'Eduardo',
			items: [
				{name:'Roger'},
				{name:'Marta'},
				{name:'Clark'}
			]
		})
		setTimeout( _ => {
			el.update({
				name: 'Teste',
				items: [{name: 'Mario'}]
			})
		}, 5000)
	}else if( node.dataset.component=='B') {
		el.update({name: 'B'})
	}

}

export const disposeElement = () => {

}

const Element = ( el ) => {

	stripTemplateTag( el )

	const model = Object.assign({}, JSON.parse(el.dataset.initialState || '{}'))
	el.removeAttribute('data-initial-state')
	const morphdomOptions = lifecycle(el)
	const { template, tplid } = getTemplateData(el)

	return {

		tplid,
		el,
		template,
		model,
		parent: {},

		update( data ) {

			const newdata = Object.assign({}, dup(this.model), dup(data))
			morphdom( el, sodajs(template, newdata), morphdomOptions )

			this.model = Object.assign( this.model, data )

			Array
				.from( el.querySelectorAll('[data-component]') )
				.filter( node => Boolean( node.__instance__ ) )
				.forEach( node => rAF( _ => node.__instance__.update( data ) ) )
		}
	}
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

const update = (element: HTMLElement ) => (node, toEl) => {
	if (node.isEqualNode(toEl))
		return false
	if( node.nodeType == 1 ) {
		if( 'static' in node.dataset )
			return false
		if ( node !== element && node.dataset.component && node.__instance__ )
			return false
	}
	return true
}

const getTemplateData = (el) => {
	if( el.getAttribute('tplid') ) {
		const tplid = el.getAttribute('tplid')
		const template = templates[tplid]
		return { tplid, template }
	}else {
		const tplid = uuid()
		el.setAttribute('tplid', tplid)
		templates[tplid] = createTemplate(el.outerHTML, templates)
		const template = templates[tplid]
		return { tplid, template }
	}
}
