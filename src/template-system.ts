import template7 from 'template7'

export default function templateSystem(element) {

	const directives = [htmlRepeatAndIf]
	const vdom = element.cloneNode(true)
	const newvdom = directives.reduce((_, directive) => directive(vdom), vdom)
	const html = newvdom.outerHTML.replace(/html-/g, '')
	const template = template7.compile(html)

	return (data) => template(data)
}

/**@Directives */

const htmlRepeatAndIf = (vdom) => {

	const nodes = Array.from(vdom.querySelectorAll('[html-repeat],[html-if]'))

	if (nodes.length) {
		nodes.forEach(node => {
			if (node.getAttribute('html-repeat')) {
				const instruction = node.getAttribute('html-repeat')
				node.removeAttribute('html-repeat')
				node.setAttribute('scope', '{{scope this}}')
				node.outerHTML = `{{#${instruction}}}${node.outerHTML}{{/${instruction}}}`
			} else if (node.getAttribute('html-if')) {
				const instruction = node.getAttribute('html-if')
				node.removeAttribute('html-if')
				node.setAttribute('scope', '{{scope this}}')
				node.outerHTML = `{{#${instruction}}}${node.outerHTML}{{/${instruction}}}`
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
