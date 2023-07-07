import { compile, defaultConfig, filters } from 'squirrelly'
import { decodeHtmlEntities } from './utils'

defaultConfig.tags = ['{', '}']
defaultConfig.useWith = true

export default function templateSystem( element ) {

	const tree = document.createElement('template')
	const tagOpen = defaultConfig.tags[0]
	const tagClose = defaultConfig.tags[1]

	element.initialState = getInitialState(element)
	tree.innerHTML = element.outerHTML.replace(/<\/?template[^>]*>/g, '')

	directives(tree.content)

	const html = decodeHtmlEntities(
		tree.innerHTML
			// Booleans
			// https://meiert.com/en/blog/boolean-attributes-of-html/
			.replace(/html-(allowfullscreen|async|autofocus|autoplay|checked|controls|default|defer|disabled|formnovalidate|inert|ismap|itemscope|loop|multiple|muted|nomodule|novalidate|open|playsinline|readonly|required|reversed|selected)=\"(.*?)\"/g, `${tagOpen}@if ($2) ${tagClose}$1${tagOpen}/if${tagClose}`)
			// The rest
			.replace(/html-(.*?)=\"(.*?)\"/g, (all, key, value) => {
				if( key === 'key') {
					return all
				}
				if( value ) {
					value = value.replace(/^{|}$/g, '')
					return `${tagOpen}@if (${value}) ${tagClose} ${key}="${tagOpen}${value}${tagClose}" ${tagOpen}/if${tagClose}`
				}else {
					return all
				}
			})
	)

	const template = compile(html, defaultConfig)

	return ( data ) => {
		return template(data, defaultConfig)
	}
}

/**@Directives */

const directives = (vdom) => {

	const nodes = Array
		.from(vdom.querySelectorAll('[html-for],[html-if],[html-foreach],[html-inner],[html-model],[html-class]'))
		.reverse()

	if (nodes.length) {

		const tagOpen = defaultConfig.tags[0]
		const tagClose = defaultConfig.tags[1]

		nodes.forEach(( node ) => {
			if (node.getAttribute('html-foreach')) {
				const instruction = node.getAttribute('html-foreach') || ''
				const split = instruction.match(/(.*)\sin\s(.*)/) || ''
				const varname = split[1]
				const object = split[2]
				node.removeAttribute('html-foreach')
				node.setAttribute('scope', `${tagOpen}${varname} | JSON($key, '${varname}')${tagClose}`)
				const open = document.createTextNode(`${tagOpen}@foreach(${object}) => $key, ${varname}${tagClose}`)
				const close = document.createTextNode(`${tagOpen}/foreach${tagClose}`)
				wrap(open, node, close)
			} if (node.getAttribute('html-for')) {
				const instruction = node.getAttribute('html-for') || ''
				const split = instruction.match(/(.*)\sin\s(.*)/) || ''
				const varname = split[1]
				const object = split[2]
				node.removeAttribute('html-for')
				node.setAttribute('scope', `${tagOpen}${varname} | JSON($index, '${varname}')${tagClose}`)
				const open = document.createTextNode(`${tagOpen}@each(${object}) => ${varname}, $index${tagClose}`)
				const close = document.createTextNode(`${tagOpen}/each${tagClose}`)
				wrap(open, node, close)
			} if (node.getAttribute('html-if')) {
				const instruction = node.getAttribute('html-if')
				node.removeAttribute('html-if')
				const open = document.createTextNode(`${tagOpen}@if (${instruction}) ${tagClose}`)
				const close = document.createTextNode(`${tagOpen}/if${tagClose}`)
				wrap(open, node, close)
			} if (node.getAttribute('html-inner')) {
				const instruction = node.getAttribute('html-inner')
				node.removeAttribute('html-inner')
				node.innerHTML = `${tagOpen}${instruction} | safe${tagClose}`
			} if (node.getAttribute('html-class')) {
				const instruction = node.getAttribute('html-class').replace(/^{|}$/g, '')
				node.removeAttribute('html-class')
				node.className += ` ${tagOpen}${instruction}${tagClose}`
			}
		})
	}

	return vdom
}

export const templateConfig = (options) => {
	Object.assign(defaultConfig, options)
}

filters.define('JSON', (scope, index, varname) => {

	const key = index.constructor == String ? '$key' : '$index'
	const newobject = { $index: index } as any

	newobject[varname] = scope
	newobject[key] = index

	return JSON.stringify(newobject)
})

const wrap = (open, node, close) => {
	node.parentNode?.insertBefore(open, node)
	node.parentNode?.insertBefore(close, node.nextSibling)
}

const getInitialState = (element) => {
	const initialState = element.getAttribute('html-model')
	if( !initialState ) return null
	element.removeAttribute('html-model')
	return JSON.stringify((new Function(`return ${initialState}`))())
}
