
import { Element } from './element'
import { template, templateConfig as config } from './template-system'

export { publish, subscribe } from './utils/pubsub'

export const templateConfig = (options) => {
	config( options )
}

window.__jails__ = window.__jails__ || { components: {} }

export const register = ( name, module, dependencies ) => {
	const { components } = window.__jails__
	components[ name ] = { name, module, dependencies }
}

export const start = ( target = document.body ) => {

	const { components } = window.__jails__
	const templates = template( target, { components } )

	Object
		.values( components )
		.forEach(({ name, module, dependencies }) => {
			if( !customElements.get(name) ) {
				customElements.define( name, Element({ component: { name, module, dependencies }, templates, start }))
			}
	})
}

declare global {
	interface Window {
	  __jails__?: {
		components: Record<string, any>
	  }
	}
}
