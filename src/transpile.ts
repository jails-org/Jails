import { $for } from './utils'
const parser = new DOMParser()

export default function Transpile(html, config) {

	const regexTags = new RegExp(`\\${config.tags[0]}(.+?)\\${config.tags[1]}`, 'g')
	const virtual = parser.parseFromString(html.replace(/<\/?template[^>]*>/g, ''), 'text/html')

	virtual.querySelectorAll('[html-for], [html-if], [html-inner], [html-class], [html-model]').forEach((element) => {

		const htmlForeach = element.getAttribute('html-foreach')
		const htmlFor 	= element.getAttribute('html-for')
		const htmlIf 	= element.getAttribute('html-if')
		const htmlInner = element.getAttribute('html-inner')
		const htmlClass = element.getAttribute('html-class')
		const forEachInstruction = htmlFor || htmlForeach

		if ( forEachInstruction ) {
			const selector = htmlFor? 'html-for': 'html-foreach'
			const split = forEachInstruction.match(/(.*)\sin\s(.*)/) || ''
			const varname = split[1]
			const object = split[2]

			element.removeAttribute(selector)

			const ids = Array.from(element.querySelectorAll(`[tplid]:not([${selector}] [tplid])`)).map((cp) => {
				const tplid = cp.getAttribute('tplid')
				$for.scopes[tplid] = []
				return tplid
			})

			const open = document.createTextNode(`%%_(function(){ var $index = 0; for(var $key in safe(function(){ return ${object} }) ){ var ${varname} = ${object}[$key]; ${JSON.stringify(ids).replace(/\"/g, "'")}.map(function(id){ if($for.scopes[id]) { $for.scopes[id][$index] = { ${varname}: ${object}[$key], $index: $index, $key: $key } } }); _%%`)
			const close = document.createTextNode(`%%_ $index++;}})() _%%`)
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
	})


	return (
		virtual.body.innerHTML
			.replace(regexTags, '%%_=$1_%%')
			// Booleans
			// https://meiert.com/en/blog/boolean-attributes-of-html/
			.replace(/html-(allowfullscreen|async|autofocus|autoplay|checked|controls|default|defer|disabled|formnovalidate|inert|ismap|itemscope|loop|multiple|muted|nomodule|novalidate|open|playsinline|readonly|required|reversed|selected)=\"(.*?)\"/g, `%%_if(safe(function(){ return $2 })){_%%$1%%_}_%%`)
			// The rest
			.replace(/html-(.*?)=\"(.*?)\"/g, (all, key, value) => {
				if (key === 'key' || key === 'model' || key == 'scope') {
					return all
				}
				if (value) {
					value = value.replace(/^{|}$/g, '')
					return `${key}="%%_=safe(function(){ return ${value} })_%%"`
				} else {
					return all
				}
			})
	)
}

const wrap = (open, node, close) => {
	node.parentNode?.insertBefore(open, node)
	node.parentNode?.insertBefore(close, node.nextSibling)
}
