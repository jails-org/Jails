import { uuid } from './utils'

const virtual = document.createElement('template')
const textarea = document.createElement('textarea')

export const templateConfig = {
	tags: ['{', '}']
}

export default function Template(element) {
	const regexTags = new RegExp(`${templateConfig.tags[0]}(.*?)${templateConfig.tags[1]}`, 'g')
	modelAttr(element)

	virtual.innerHTML = element.outerHTML
		.replace(/<\/?template[^>]*>/g, '')
		.replace(regexTags, '${$1}')

	// Directives
	Array.from(virtual.content.querySelectorAll('[html-for],[html-if],[html-inner],[html-class]')).forEach((node) => {
		if (node.getAttribute('html-inner')) {
			innerHTML(node)
		}
		if (node.getAttribute('html-for')) {
			forLoop(node)
		}
		if (node.getAttribute('html-if')) {
			ifClause(node)
		}
		if (node.getAttribute('html-class')) {
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

const forLoop = (tag) => {
	const expression = tag.getAttribute('html-for').split(/\sin\s/)
	const varname = expression[0].trim()
	const objectname = expression[1].trim()
	const open = '${ Object.entries(' + objectname + ').map(function( args ){ var ' + varname + ' = args[1]; var $index = args[0]; var $key = args[0]; var scope = {}; scope["'+varname+'"]=args[1]; scope.$index = $index; scope.$key= $key; return `'
	const close = '`}).join("")}'
	tag.removeAttribute('html-for')
	tag.setAttribute('html-scope', '${JSON.stringify(scope).replace(/"/g, "\'")}')
	wrap(open, tag, close)
}

const ifClause = (tag) => {
	const expression = tag.getAttribute('html-if')
	tag.removeAttribute('html-if')
	const newtag = '${' + expression + '?`' + tag.outerHTML + '`:"" }'
	tag.outerHTML = newtag
}

const innerHTML = (tag) => {
	const instruction = tag.getAttribute('html-inner')
	tag.removeAttribute('html-inner')
	tag.innerHTML = '${' + instruction + '}'
}

const classAttr = (tag) => {
	const instruction = tag.getAttribute('html-class').replace(/^{|}$/g, '')
	tag.removeAttribute('html-class')
	tag.className += ' ${' + instruction + '}'
}

const modelAttr = (tag) => {
	const initialState = tag.getAttribute('html-model')
	tag.initialState = initialState ? JSON.stringify(new Function(`return ${initialState}`)()) : null
	tag.removeAttribute('html-model')
}

const wrap = (open, node, close) => {
	node.parentNode?.insertBefore(document.createTextNode(open), node)
	node.parentNode?.insertBefore(document.createTextNode(close), node.nextSibling)
}

const createTemplateId = (element, templates ) => {

	const tplid = element.getAttribute('tplid')

	if (!tplid) {
		const id = uuid()
		element.setAttribute('tplid', id)
		templates[id] = Template(element)
	}
}

const decodeHtmlEntities = ( str ) => {
	textarea.innerHTML = str
	return textarea.value
}
