
export default function Transpile(html, config) {

	const regexTags = new RegExp(`\\${config.tags[0]}(.+?)\\${config.tags[1]}`, 'g')
	const virtual = document.createElement('template')

	virtual.innerHTML = html.replace(/<\/?template[^>]*>/g, '')

	Array.from(virtual.content.querySelectorAll('[html-for], [html-if], [html-inner], [html-class]')).forEach((element) => {

		const htmlFor = element.getAttribute('html-for')
		const htmlIf = element.getAttribute('html-if')
		const htmlInner = element.getAttribute('html-inner')
		const htmlClass = element.getAttribute('html-class')

		if (htmlFor) {
			const split = htmlFor.match(/(.*)\sin\s(.*)/) || ''
			const varname = split[1]
			const object = split[2]
			element.removeAttribute('html-for')
			const open = document.createTextNode(`<% for(var $index in ${object}){ var $key = $index; var ${varname} = ${object}[$index]; var scope = ${varname}; scope.$index = $index; scope.$key = $key %>`)
			const close = document.createTextNode(`<%}%>`)
			element.setAttribute('html-scope', `<%=JSON.stringify(scope).replace(/\"/g, "'")%>`)
			wrap(open, element, close)
		}
		if (htmlIf) {
			element.removeAttribute('html-if')
			const open = document.createTextNode(`<% if ( safe(function(){return ${htmlIf};}) ){ %>`)
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
		virtual.innerHTML
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
					return `<%if (${value}) {%> ${key}="<%=${value}%>" <%}%>`
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
