import { uuid } from './utils'

const templates  = {}

const config = {
	tags: ['{{', '}}']
}

export const templateConfig = (newconfig) => {
	Object.assign( config, newconfig )
}

export const template = ( target, { components }) => {

	tagElements( target, [...Object.keys( components ), 'template'] )
	const clone = target.cloneNode( true )

	transformTemplate( clone )
	removeTemplateTagsRecursively( clone )
	transformAttributes( clone )
	setTemplates( clone, components )

	return templates
}

export const compile = ( html ) => {
	const parsedHtml = JSON.stringify(html)

	return new Function('$element', 'safe', '$g',`
		var $data = this;
		with( $data ){
			var output=${parsedHtml
				.replace(/%%_=(.+?)_%%/g, function(_, variable){
					return '"+safe(function(){return '+variable+';})+"'
				})
				.replace(/%%_(.+?)_%%/g, function(_, variable){
					return '";' + variable +'\noutput+="'
				})};return output;
		}
	`)
}

const tagElements = ( target, keys ) => {
	target
		.querySelectorAll( keys.toString() )
		.forEach((node) => {
			if( node.localName === 'template' ) {
				return tagElements( node.content, keys )
			}
			node.setAttribute('tplid', uuid())
		})
}

const transformAttributes = ( clone ) => {

	const regexTags = new RegExp(`\\${config.tags[0]}(.+?)\\${config.tags[1]}`, 'g')

	clone.innerHTML = clone.innerHTML
		.replace(regexTags, '%%_=$1_%%')
		// Booleans
		// https://meiert.com/en/blog/boolean-attributes-of-html/
		.replace(/html-(allowfullscreen|async|autofocus|autoplay|checked|controls|default|defer|disabled|formnovalidate|inert|ismap|itemscope|loop|multiple|muted|nomodule|novalidate|open|playsinline|readonly|required|reversed|selected)=\"(.*?)\"/g, `%%_if(safe(function(){ return $2 })){_%%$1%%_}_%%`)
		// The rest
		.replace(/html-(.*?)=\"(.*?)\"/g, (all, key, value) => {
			if (key === 'key' || key === 'model') {
				return all
			}
			if (value) {
				value = value.replace(/^{|}$/g, '')
				return `${key}="%%_=safe(function(){ return ${value} })_%%"`
			} else {
				return all
			}
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

				const split 	= htmlFor.match(/(.*)\sin\s(.*)/) || ''
				const varname 	= split[1]
				const object 	= split[2]
				const open 		= document.createTextNode(`%%_  ;(function(){ var $index = 0; for(var $key in safe(function(){ return ${object} }) ){ var $scopeid = Math.random().toString(36).substring(2, 9); var ${varname} = ${object}[$key]; $g.scope[$scopeid] = { ${varname} :${varname}, ${object}: ${object}, $index: $index, $key: $key }; _%%`)
				const close 	= document.createTextNode(`%%_ $index++; } })() _%%`)

				wrap(open, element, close)
			}

			if (htmlIf) {
				element.removeAttribute('html-if')
				const open = document.createTextNode(`%%_ if ( safe(function(){ return ${htmlIf} }) ){ _%%`)
				const close = document.createTextNode(`%%_ } _%%`)
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
			node.setAttribute('html-scope-id', '%%_=$scopeid_%%')

			if( name in components && components[name].module.template ) {
				const children = node.innerHTML
				const html = components[name].module.template({ elm:node, children })

				if( html.constructor === Promise ) {
					html.then( htmlstring => {
						node.innerHTML = htmlstring
						const html = node.outerHTML
						templates[tplid] = {
							template: html,
							render: compile(html)
						}
					})
				} else {
					node.innerHTML = html
				}
			}

			const html = node.outerHTML

			templates[ tplid ] = {
				template: html,
				render	: compile(html)
			}
		})
}

const removeTemplateTagsRecursively = (node) => {

	// Get all <template> elements within the node
	const templates = node.querySelectorAll('template')

	templates.forEach((template) => {

		if( template.getAttribute('html-if') || template.getAttribute('html-inner') ) {
			return
		}

		// Process any nested <template> tags within this <template> first
		removeTemplateTagsRecursively(template.content)

		// Get the parent of the <template> tag
		const parent = template.parentNode

		if (parent) {
			// Move all child nodes from the <template>'s content to its parent
			const content = template.content
			while (content.firstChild) {
				parent.insertBefore(content.firstChild, template)
			}
			// Remove the <template> tag itself
			parent.removeChild(template)
		}
	})
}

const wrap = (open, node, close) => {
	node.parentNode?.insertBefore(open, node)
	node.parentNode?.insertBefore(close, node.nextSibling)
}
