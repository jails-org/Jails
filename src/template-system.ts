import { compile, defaultConfig, filters } from 'squirrelly'
import { SqrlConfig } from 'squirrelly/dist/types/config'
import { decodeHtmlEntities } from './utils'

const defaultOptions: SqrlConfig = {
	...defaultConfig,
	tags: ['{', '}'],
	useWith: true
}

export default function templateSystem(element) {

	const tree = document.createElement('template')

	tree.innerHTML = element.outerHTML.replace(/<\/?template[^>]*>/g, '')

	directives(tree.content)

	const html = decodeHtmlEntities(
		tree.innerHTML
			.replace(/html-(selected|checked|readonly|disabled|autoplay)=\"(.*)\"/g, `{@if ($2) }$1{/if}`)
			.replace(/html-/g, '')
	)

	const template = compile(html, defaultOptions)

	return (data) => {
		return template(data, defaultOptions)
	}
}

/**@Directives */

const directives = (vdom) => {

	const nodes = Array
		.from(vdom.querySelectorAll('[html-for],[html-if],[html-foreach]'))
		.reverse()

	if (nodes.length) {

		nodes.forEach((node: HTMLElement) => {
			if (node.getAttribute('html-foreach')) {
				const instruction = node.getAttribute('html-foreach')
				const split = instruction.match(/(.*)\sin\s(.*)/)
				const varname = split[1]
				const object = split[2]
				node.removeAttribute('html-foreach')
				node.setAttribute('scope', `{${varname} | JSON($key, '${varname}')}`)
				const open = document.createTextNode(`{@foreach(${object}) => $key, ${varname}}`)
				const close = document.createTextNode('{/foreach}')
				wrap(open, node, close)
			} else if (node.getAttribute('html-for')) {
				const instruction = node.getAttribute('html-for')
				const split = instruction.match(/(.*)\sin\s(.*)/)
				const varname = split[1]
				const object = split[2]
				node.removeAttribute('html-for')
				node.setAttribute('scope', `{${varname} | JSON($index, '${varname}')}`)
				const open = document.createTextNode(`{@each(${object}) => ${varname}, $index}`)
				const close = document.createTextNode('{/each}')
				wrap(open, node, close)
			} else if (node.getAttribute('html-if')) {
				const instruction = node.getAttribute('html-if')
				node.removeAttribute('html-if')
				const open = document.createTextNode(`{@if (${instruction}) }`)
				const close = document.createTextNode('{/if}')
				wrap(open, node, close)
			}
		})
	}

	return vdom
}

filters.define('JSON', (scope, index, varname) => {

	const key = index.constructor == String ? '$key' : '$index'
	const newobject = { $index: index }

	newobject[varname] = scope
	newobject[key] = index

	return JSON.stringify(newobject)
})

const wrap = (open, node, close) => {
	node.parentNode.insertBefore(open, node)
	node.parentNode.insertBefore(close, node.nextSibling)
}
