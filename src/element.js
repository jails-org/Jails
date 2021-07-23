import Component 	from './component'
import { trigger } 	from './utils/events'
import { nextFrame } from './utils'

export const create = ({ element, view, modules }) => {

	element.__instances__ = {}
	element.__model__ = {}

	const names = element.dataset.component.split(/\s/)

	if(!element.dataset.reactorId){
		view.setNewElement(element)
	}

	names.forEach( name => {

		if( name in modules && (!element.__instances__[name]) ){

			const component = modules[name]

			nextFrame(_ => {
				if( element.__instances__ ) {
					const base = Component({ name, element, view, component })

					element.__instances__[name] = { base, methods: {} }

					element.__update__ = (state) => {
						for ( let name in element.__instances__ )
							element.__instances__[name].base.update(state)
					}

					component.module.default(base)
					base.__initialize(base)
					delete base.__initialize
				}
			})
		}
	})

}

export const ismounted = (element) => {
	return Boolean( element.__instances__ )
}

export const destroy = ({ element }) => {

	trigger(element, ':destroy')

	for (let ev in element.__events)
		element.removeEventListener(ev, element.__events[ev].listener)

	delete element.__events
	delete element.__instances__
	delete element.__model__
}
