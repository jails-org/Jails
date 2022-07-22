import template7 from 'template7'
import { stripTemplateTag } from './utils'

export default function templateSystem(element) {

	const directives = [htmlRepeatAndIf]
	const vdom = element.cloneNode(true)

	stripTemplateTag(vdom)

	const newvdom = directives.reduce((_, directive) => directive(vdom), vdom)
	const html = newvdom.outerHTML.replace(/html-/g, '')
	const template = template7.compile(html)

	return (data) => {
		return template(data)
	}
}

/**@Directives */

const htmlRepeatAndIf = (vdom) => {

	const nodes = Array.from(vdom.querySelectorAll('[html-repeat],[html-if], [html-ifnot]'))

	if (nodes.length) {
		nodes.forEach(node => {
			if (node.getAttribute('html-repeat')) {
				const instruction = node.getAttribute('html-repeat')
				node.removeAttribute('html-repeat')
				node.setAttribute('scope', '{{scope this}}')
				node.outerHTML = `{{#each ${instruction}}}${node.outerHTML}{{/each}}`
			} else if (node.getAttribute('html-if')) {
				const instruction = node.getAttribute('html-if')
				node.removeAttribute('html-if')
				node.setAttribute('scope', '{{scope this}}')
				node.outerHTML = `{{#if ${instruction}}}${node.outerHTML}{{/if}}`
			} else if (node.getAttribute('html-ifnot')) {
				const instruction = node.getAttribute('html-ifnot')
				node.removeAttribute('html-ifnot')
				node.setAttribute('scope', '{{scope this}}')
				node.outerHTML = `{{#unless ${instruction}}}${node.outerHTML}{{/unless}}`
			}
		})
	}

	return vdom
}

/**@Global Settings */
template7.global = {}

/**@Helpers */
template7.registerHelper('scope', (context, options) => {

	const scope = {
		...context,
		['$first']: options.data.first,
		['$index']: options.data.index,
		['$last']: options.data.last,
		['$parent']: options.root
	}

	return JSON.stringify(scope).replace(/\"/g, '\'')
})
