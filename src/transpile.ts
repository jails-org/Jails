import { uuid } from "./utils"

const parser = new DOMParser()

export default function Transpile(html, config, $scopes) {

	const regexTags = new RegExp(`\\${config.tags[0]}(.+?)\\${config.tags[1]}`, 'g')
	const virtual = parser.parseFromString(html.replace(/<\/?template[^>]*>/g, ''), 'text/html')

	virtual.documentElement.innerHTML = html.replace(/<\/?template[^>]*>/g, '')

	virtual.querySelectorAll('[html-for], [html-if], [html-inner], [html-class]').forEach((element) => {

		const htmlFor 	= element.getAttribute('html-for')
		const htmlIf 	= element.getAttribute('html-if')
		const htmlInner = element.getAttribute('html-inner')
		const htmlClass = element.getAttribute('html-class')

		if (htmlFor) {
			const split = htmlFor.match(/(.*)\sin\s(.*)/) || ''
			const varname = split[1]
			const object = split[2]

			element.removeAttribute('html-for')

			const ids = Array.from(element.querySelectorAll('[tplid]:not([html-for] [tplid])')).map((cp) => {
				const tplid = cp.getAttribute('tplid')
				$scopes[tplid] = []
				return tplid
			})

			const open = document.createTextNode(`<% for(var $index in safe(function(){ return ${object} }) ){ var $key = $index; var ${varname} = ${object}[$index]; ${JSON.stringify(ids)}.map(function(id){ if($scopes[id]) { $scopes[id][$index] = { ${varname}: ${object}[$index], $index: +$index, $key: $index } } }); %>`)
			const close = document.createTextNode(`<% }; %>`)
			wrap(open, element, close)
		}
		if (htmlIf) {
			element.removeAttribute('html-if')
			const open = document.createTextNode(`<% if ( ${htmlIf} ){ %>`)
			const close = document.createTextNode(`<% } %>`)
			wrap(open, element, close)
		}
		if (htmlInner) {
			element.removeAttribute('html-inner')
			element.innerHTML = `<%=${htmlInner}%>`
		}
		if (htmlClass) {
			element.removeAttribute('html-class')
			element.className += ` <%=${htmlClass}%>`
		}
	})

	return (
		virtual.body.innerHTML
			.replace(regexTags, '<%=$1%>')
			// Booleans
			// https://meiert.com/en/blog/boolean-attributes-of-html/
			.replace(/html-(allowfullscreen|async|autofocus|autoplay|checked|controls|default|defer|disabled|formnovalidate|inert|ismap|itemscope|loop|multiple|muted|nomodule|novalidate|open|playsinline|readonly|required|reversed|selected)=\"(.*?)\"/g, `<%if($2){%>$1<%}%>`)
			// The rest
			.replace(/html-(.*?)=\"(.*?)\"/g, (all, key, value) => {
				if (key === 'key' || key === 'model' || key == 'scope') {
					return all
				}
				if (value) {
					value = value.replace(/^{|}$/g, '')
					return `<%if ( ${value} ) {%> ${key}="<%=${value}%>" <%}%>`
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
