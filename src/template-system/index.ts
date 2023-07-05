import { forLoop, ifClause, innerHTML, classAttr, modelAttr } from './directives'
import { decodeHtmlEntities } from '../utils'

const virtual = document.createElement('template')

export const templateConfig = {}

export default function Template(element) {

	modelAttr(element)

	virtual.innerHTML = element.outerHTML
		.replace(/<\/?template[^>]*>/g, '')
		.replace(/\{(.*?)\}/g, '${$1}')

	// Directives
	Array.from(virtual.content.querySelectorAll('[html-for],[html-if],[html-inner],[html-class]')).forEach((node) => {
		if (node.getAttribute('html-for')) {
			forLoop(node)
		} else if (node.getAttribute('html-if')) {
			ifClause(node)
		} else if (node.getAttribute('html-inner')) {
			innerHTML(node)
		} else if (node.getAttribute('html-class')) {
			classAttr(node)
		}
	})

	const html = virtual.innerHTML
		// Booleans
		// https://meiert.com/en/blog/boolean-attributes-of-html/
		.replace(/html-(allowfullscreen|async|autofocus|autoplay|checked|controls|default|defer|disabled|formnovalidate|inert|ismap|itemscope|loop|multiple|muted|nomodule|novalidate|open|playsinline|readonly|required|reversed|selected)=\"(.*?)\"/g, '${$2?"$1":""}')
		.replace(/html-(.*?)=\"(.*?)\"/g, (all, key, value) => {
			if (key == 'scope' || key == 'model') return all
			if (value) {
				value = value.replace(/^{|}$/g, '')
				return '${ (' + value + ') ? `' + key + '="${' + value + '}"`:""}'
			} else {
				return all
			}
		})

	return new Function('$_data_$', 'with($_data_$){ return `' + decodeHtmlEntities(html) + '`}')
}

