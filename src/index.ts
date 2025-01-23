import { Element } from './element'
import { Idiomorph } from 'idiomorph/dist/idiomorph.esm'

const textarea = document.createElement('textarea')
const components = {}
const templates = {}

export const register = ( name, module, dependencies ) => {
	components[ name ] = { name, module, dependencies }
}

export const start = ( target = document.body ) => {
	scan( target )
}

const scan = ( target ) => {

}

const decodeHTML = ( text ) => {
	textarea.innerHTML = text
	return textarea.value
}

const directives = {

	htmlIf( node ) {
		const expression = node.getAttribute('html-if')
		if( expression ) {
			node.removeAttribute('html-if')
			wrap(
				document.createTextNode(`{{ if(${expression}) { }}`),
				node,
				document.createTextNode(`{{ } }}`)
			)
		}
	},

	htmlInner( node ) {
		const expression = node.getAttribute('html-inner')
		if( expression ) {
			node.removeAttribute('html-inner')
			node.innerHTML = `{{= ${expression} }}`
		}
	}
}

const wrap = (open, node, close) => {
	node.parentNode?.insertBefore(open, node)
	node.parentNode?.insertBefore(close, node.nextSibling)
}
