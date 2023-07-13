import Transpile from './Transpile'
import { uuid } from './utils'

const textarea = document.createElement('textarea')

export const templateConfig = {
	tags: ['${', '}']
}

export default function Template(element) {
	//

	element.initialState = getInitialState( element )

	const html = Transpile(element.outerHTML, templateConfig)
	textarea.innerHTML = html

	return new Function(`
		var Model = this;
		function safe(execute){
			try{return execute()}catch(err){return ''}
		}
		with( Model ){
			var output = '${textarea.value
				.replace(/<%=(.+?)%>/g, `'+safe(function(){return $1;})+'`)
				.replace(/<%(.+?)%>/g, `';$1\noutput+='`)}'

			return output
		}
	`)
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

const createTemplateId = (element, templates ) => {
	const tplid = element.getAttribute('tplid')
	if (!tplid) {
		const id = uuid()
		element.setAttribute('tplid', id)
		templates[id] = Template(element)
	}
}

const getInitialState = (element) => {
	const initialState = element.getAttribute('html-model')
	if( !initialState ) return null
	element.removeAttribute('html-model')
	return JSON.stringify((new Function(`return ${initialState}`))())
}
