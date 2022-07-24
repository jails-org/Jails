import template7 from 'template7'
import { stripTemplateTag, decodeHtmlEntities } from './utils'

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

	const nodes = Array
		.from(vdom.querySelectorAll('[html-repeat],[html-if]'))
		.reverse()

	if (nodes.length) {

		nodes.forEach(node => {
			if (node.getAttribute('html-repeat')) {
				const instruction = node.getAttribute('html-repeat')
				node.removeAttribute('html-repeat')
				node.setAttribute('scope', '{{scope this}}')
				const open = document.createTextNode(`{{#each ${instruction}}}`)
				const close = document.createTextNode('{{/each}}')
				node.parentNode.insertBefore(open, node)
				node.parentNode.insertBefore(close, node.nextSibling)
			} else if (node.getAttribute('html-if')) {
				const instruction = node.getAttribute('html-if')
				node.removeAttribute('html-if')
				node.setAttribute('scope', '{{scope this}}')
				const open = document.createTextNode(`{{#ifexp "${instruction}"}}`)
				const close = document.createTextNode('{{/ifexp}}')
				node.parentNode.insertBefore(open, node)
				node.parentNode.insertBefore(close, node.nextSibling)
			}
		})
	}

	return vdom
}

/**@Global Settings */
template7.global = {}

/**@Helpers */
template7.registerHelper('scope', (context, options) => {

	const { data } = options
	const { first, index, last, root } = data

	const scope = {
		...context,
		['$first']: first,
		['$index']: index,
		['$last']: last,
		['$parent']: root
	}

	return JSON.stringify(scope).replace(/\"/g, '\'')
})

template7.registerHelper('ifexp', function (value, options) {

	const condition = decodeHtmlEntities(value)
	const { root, data } = options

	try {
		const expression = (new Function('root', `with(root){ return ${condition} }`)).call(root, root)
		return expression ? options.fn(this, data) : options.inverse(this, data)

	} catch (err) {
		return options.inverse(this, data)
	}

})
