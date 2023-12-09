import Transpile from './transpile'
import { uuid, decodeHTML } from './utils'

const config = {
	tags: ['${', '}']
}

export const templateConfig = (newconfig) => {
	Object.assign(config, newconfig)
}

export default function Template(element) {

	const html = Transpile(element.outerHTML, config)
	const decodedHTML  = JSON.stringify(html)

	return new Function('$element', 'safe',`
		var $data = this;
		with( $data ){
			var output=${decodedHTML
				.replace(/%%_=(.+?)_%%/g, function(_, variable){
					return '"+safe(function(){return '+decodeHTML(variable)+';})+"'
				})
				.replace(/%%_(.+?)_%%/g, function(_, variable){
					return '";' + decodeHTML(variable) +'\noutput+="'
				})};return output;
		}
	`)
}

export const buildtemplates = ( target, selector, templates ) => {
	[]
		.concat( target.matches? (target.matches(selector)? target : []) : [] )
		.concat( Array.from(target.querySelectorAll( selector )) )
		.reverse()
		.forEach( (node:HTMLElement) => {
			node.querySelectorAll('template').forEach( template => buildtemplates(template.content, selector, templates ))
			createTemplateId(node, templates)
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

