import Transpile from './transpile'
import { uuid } from './utils'

const textarea = document.createElement('textarea')

const config = {
	tags: ['${', '}']
}

export const templateConfig = (newconfig) => {
	Object.assign(config, newconfig)
}

export default function Template(element, $scopes, $initialStates) {

	const html = Transpile(element.outerHTML, config, $scopes, $initialStates)
	textarea.innerHTML = html
	const decodedHTML  = JSON.stringify(textarea.value)

	return new Function('$element', 'safe', '$scopes',`
		var $data = this;
		with( $data ){
			var output=${decodedHTML
				.replace(/%%_=(.+?)_%%/g, '"+safe(function(){return $1;})+"')
				.replace(/%%_(.+?)_%%/g, '";$1\noutput+="')};return output;
		}
	`)
}

export const buildtemplates = ( target, components, templates, $scopes, $initialStates ) => {
	return Array
		.from(target.querySelectorAll('*'))
		.filter((node:HTMLElement) => node.tagName.toLowerCase() in components)
		.reverse()
		.map((node:HTMLElement) => {
			Array.from(node.querySelectorAll('template'))
				.map((template) => buildtemplates(template.content, components, templates, $scopes, $initialStates))
			createTemplateId(node, templates, $scopes, $initialStates)
			return node
		})
}

const createTemplateId = (element, templates, $scopes, $initialStates ) => {
	const tplid = element.getAttribute('tplid')
	if (!tplid) {
		const id = uuid()
		element.setAttribute('tplid', id)
		templates[id] = Template(element, $scopes, $initialStates)
	}
}

