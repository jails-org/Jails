import { uuid, decodeHTML } from './utils'

const config = {
	tags: ['{{', '}}']
}

const templates  = {}
const booleanAttrs = /html-(allowfullscreen|async|autofocus|autoplay|checked|controls|default|defer|disabled|formnovalidate|inert|ismap|itemscope|loop|multiple|muted|nomodule|novalidate|open|playsinline|readonly|required|reversed|selected)="(.*?)"/g
const htmlAttr = /html-([^\s]*?)="(.*?)"/g
const tagExpr = () => new RegExp(`\\${config.tags[0]}(.+?)\\${config.tags[1]}`, 'g')

export const templateConfig = (newconfig) => {
	Object.assign( config, newconfig )
}

export const template = ( target, { components }) => {

	tagElements( target, [...Object.keys( components ), '[html-if]', 'template'], components )
	const clone = target.cloneNode( true )

	transformTemplate( clone )
	removeTemplateTagsRecursively( clone )
	setTemplates( clone, components )

	return templates
}

export const compile = ( html ) => {

	const parsedHtml = JSON.stringify( html )

	return new Function('$element', 'safe', '$g',`
		var $data = this;
		with( $data ){
			var output=${parsedHtml
				.replace(/%%_=(.+?)_%%/g, function(_, variable){
					return '"+safe(function(){return '+ decodeHTML(variable) +';})+"'
				})
				.replace(/%%_(.+?)_%%/g, function(_, variable){
					return '";' + decodeHTML(variable) +'\noutput+="'
				})};return output;
		}
	`)
}

const tagElements = (target, keys, components) => {
	const isComponent = key => key in components
	const selector = keys.join(',')

	target.querySelectorAll(selector).forEach(node => {
		if (node.localName === 'template') {
			tagElements(node.content, keys, components)
			return
		}
		if (node.hasAttribute('html-if') && !node.id) {
			node.id = uuid()
		}
		if (isComponent(node.localName)) {
			node.setAttribute('tplid', uuid())
		}
	})
}

const transformAttributes = (html) => {
	return html
		.replace(/jails___scope-id/g, '%%_=$scopeid_%%')
		.replace(tagExpr(), '%%_=$1_%%')
		.replace(booleanAttrs, `%%_if(safe(function(){ return $2 })){_%%$1%%_}_%%`)
		.replace(htmlAttr, (all, key, value) => {
			if (['key', 'model', 'scopeid'].includes(key)) return all
			if (value) {
				value = value.replace(/^{|}$/g, '')
				return `${key}="%%_=safe(function(){ return ${value} })_%%"`
			}
			return all
		})
}

const transformTemplate = ( clone ) => {

	clone.querySelectorAll('template, [html-for], [html-if], [html-inner], [html-class]')
		.forEach(( element ) => {

			const htmlFor 	= element.getAttribute('html-for')
			const htmlIf 	= element.getAttribute('html-if')
			const htmlInner = element.getAttribute('html-inner')
			const htmlClass = element.getAttribute('html-class')

			if ( htmlFor ) {

				element.removeAttribute('html-for')

				const split 	 = htmlFor.match(/(.*)\sin\s(.*)/) || ''
				const varname 	 = split[1]
				const object 	 = split[2]
				const objectname = object.split(/\./).shift()
				const open 		 = document.createTextNode(`%%_ ;(function(){ var $index = 0; for(var $key in safe(function(){ return ${object} }) ){ var $scopeid = Math.random().toString(36).substring(2, 9); var ${varname} = ${object}[$key]; $g.scope[$scopeid] = Object.assign({}, { ${objectname}: ${objectname} }, { ${varname} :${varname}, $index: $index, $key: $key }); _%%`)
				const close 	 = document.createTextNode(`%%_ $index++; } })() _%%`)

				wrap(open, element, close)
			}

			if (htmlIf) {
				element.removeAttribute('html-if')
				const open = document.createTextNode(`%%_ if ( safe(function(){ return ${htmlIf} }) ){ _%%`)
				const close = document.createTextNode(`%%_ }  _%%`)
				wrap(open, element, close)
			}

			if (htmlInner) {
				element.removeAttribute('html-inner')
				element.innerHTML = `%%_=${htmlInner}_%%`
			}

			if (htmlClass) {
				element.removeAttribute('html-class')
				element.className = (element.className + ` %%_=${htmlClass}_%%`).trim()
			}

			if( element.localName === 'template' ) {
				transformTemplate(element.content)
			}
		})
}

const setTemplates = ( clone, components ) => {

	Array.from(clone.querySelectorAll('[tplid]'))
		.reverse()
		.forEach((node) => {

			const tplid = node.getAttribute('tplid')
			const name  = node.localName
			node.setAttribute('html-scopeid', 'jails___scope-id')

			if( name in components && components[name].module.template ) {
				const children = node.innerHTML
				const html = components[name].module.template({ elm:node, children })
				node.innerHTML = html
				transformTemplate(node)
				removeTemplateTagsRecursively(node)
			}

			const html = transformAttributes(node.outerHTML)

			templates[ tplid ] = {
				template: html,
				render	: compile(html)
			}
		})
}

const removeTemplateTagsRecursively = (node) => {
	const walker = document.createTreeWalker(node, NodeFilter.SHOW_ELEMENT, {
		acceptNode: el => el.tagName === 'TEMPLATE' ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
	})

	const templatesToRemove = []

	while (walker.nextNode()) {
		const tpl = walker.currentNode
		if (!tpl.hasAttribute('html-if') && !tpl.hasAttribute('html-inner')) {
			templatesToRemove.push(tpl)
		}
	}

	for (const template of templatesToRemove) {
		const parent = template.parentNode
		if (!parent) continue

		const frag = document.createDocumentFragment()
		frag.append(...template.content.childNodes)
		parent.replaceChild(frag, template)
	}
}

const wrap = (open, node, close) => {
	node.parentNode?.insertBefore(open, node)
	node.parentNode?.insertBefore(close, node.nextSibling)
}
