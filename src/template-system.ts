import Transpile from './Transpile'
import { uuid } from './utils'

const textarea = document.createElement('textarea')

const config = {
	tags: ['${', '}']
}

export const templateConfig = (newconfig) => {
	Object.assign(config, newconfig)
}

export default function Template(element, $scopes) {

	element.initialState = getInitialState( element )
	textarea.innerHTML = Transpile(element.outerHTML, config, $scopes)
	const decodedHTML = JSON.stringify(textarea.value)

	return new Function('$element', '$scopes',`
		var $data = this;

		function safe(execute, val){
			try{return execute()}catch(err){return val || ''}
		}

		with( $data ){
			var output=${decodedHTML
				.replace(/<%=(.+?)%>/g, '"+safe(function(){return $1;})+"')
				.replace(/<%(.+?)%>/g, '";$1\noutput+="')};return output;
		}
	`)
}

export const buildtemplates = ( target, components, templates, $scopes ) => {
	return Array
		.from(target.querySelectorAll('*'))
		.filter((node) => node.tagName.toLowerCase() in components)
		.reverse()
		.map((node) => {
			Array.from(node.querySelectorAll('template'))
				.map((template) => buildtemplates(template.content, components, templates, $scopes))
			createTemplateId(node, templates, $scopes)
			return node
		})
}

const createTemplateId = (element, templates, $scopes ) => {
	const tplid = element.getAttribute('tplid')
	if (!tplid) {
		const id = uuid()
		element.setAttribute('tplid', id)
		templates[id] = Template(element, $scopes)
	}
}

const getInitialState = (element) => {
	const initialState = element.getAttribute('html-model')
	if( !initialState ) return null
	element.removeAttribute('html-model')
	return JSON.stringify((new Function(`return ${initialState}`))())
}
