
import { Element } from './element'
import { template, templateConfig as config } from './template-system'

export { publish, subscribe } from './utils/pubsub'

export const templateConfig = (options) => {
	config( options )
}

globalThis.__jails__ = globalThis.__jails__ || { components: {} }

export const register = ( name, module, dependencies ) => {
	const { components } = globalThis.__jails__
	components[ name ] = { name, module, dependencies }
}

export const start = ( target ) => {

	// If the code is running in a Node.js environment, do nothing
	if( typeof window === 'undefined' ) {
		return;
	}

	target = target || document.body
	const { components } = globalThis.__jails__
	const templates = template( target, { components } )

	Object
		.values( components )
		.forEach(({ name, module, dependencies }) => {
			if( !customElements.get(name) ) {
				customElements.define( name, Element({ component: { name, module, dependencies }, templates, start }))
			}
	})
}
