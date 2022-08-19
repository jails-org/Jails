import templateSystem from '../template-system'

const textarea = document.createElement('textarea')

export const rAF = (fn) => {
	if (requestAnimationFrame)
		return requestAnimationFrame(fn)
	else
		return setTimeout(fn, 1000 / 60)
}

export const uuid = () => {
	return 'xxxxxxxx'.replace(/[xy]/g, (c) => {
		const r = Math.random() * 8 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
		return v.toString(8)
	})
}

export const stripTemplateTag = ( element ) => {
	const templates = Array.from(element.querySelectorAll('template'))
	// https://gist.github.com/harmenjanssen/07e425248779c65bc5d11b02fb913274
	templates.forEach((template) => {
		template.parentNode?.replaceChild(template.content, template)
		stripTemplateTag(template.content)
	})
}

export const dup = (o) => {
	return JSON.parse(JSON.stringify(o))
}

export const createTemplateId = (element, templates ) => {

	const tplid = element.getAttribute('tplid')

	if (!tplid) {
		const id = uuid()
		element.setAttribute('tplid', id)
		templates[id] = templateSystem(element)
	}
}

export const buildtemplates = ( target, components, templates ) => {

	return Array
		.from(target.querySelectorAll('*'))
		.filter((node) => node.tagName.toLowerCase() in components)
		.reverse()
		.map((node) => {
			Array.from(node.querySelectorAll('template'))
				.map((template) => buildtemplates(template.content, components, templates))
			createTemplateId(node, templates)
			return node
		})
}

export const decodeHtmlEntities = ( str ) => {
	textarea.innerHTML = str
	return textarea.value
}
