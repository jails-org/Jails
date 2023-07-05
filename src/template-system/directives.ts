//
import { wrap } from '../utils'

export const forLoop = (tag) => {
	const expression = tag.getAttribute('html-for').split(/\sin\s/)
	const varname = expression[0].trim()
	const objectname = expression[1].trim()
	const open = '${ Object.entries(' + objectname + ').map(function( args ){ var ' + varname + ' = args[1]; var $index = args[0]; var $key = args[0]; return `'
	const close = '`}).join("")}'

	tag.removeAttribute('html-for')
	tag.setAttribute('html-scope', '${JSON.stringify(' + varname + ').replace(/"/g, "\'")}')
	wrap(open, tag, close)
}

export const ifClause = (tag) => {
	const expression = tag.getAttribute('html-if')
	tag.removeAttribute('html-if')
	const newtag = '${' + expression + '?`' + tag.outerHTML + '`:"" }'
	tag.outerHTML = newtag
}

export const innerHTML = (tag) => {
	const instruction = tag.getAttribute('html-inner')
	tag.removeAttribute('html-inner')
	tag.innerHTML = '${' + instruction + '}'
}

export const classAttr = (tag) => {
	const instruction = tag.getAttribute('html-class').replace(/^{|}$/g, '')
	tag.removeAttribute('html-class')
	tag.className += ' ${' + instruction + '}'
}

export const modelAttr = (tag) => {
	const initialState = tag.getAttribute('html-model')
	tag.initialState = initialState ? JSON.stringify(new Function(`return ${initialState}`)()) : null
	tag.removeAttribute('html-model')
}
