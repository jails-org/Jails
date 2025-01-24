import { Element } from './element'
import { template } from './template-system'

const components = {}

export const register = ( name, module, dependencies ) => {
	components[ name ] = { name, module, dependencies }
}

export const start = ( target = document.body ) => {

	const templates = template( target, { components } )

	Object
		.values( components )
		.forEach(({ name, module, dependencies }) => {
			if( !customElements.get(name) ) {
				customElements.define( name, Element({ component: { name, module, dependencies }, templates }) )
			}
	})
}
