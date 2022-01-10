import { Element } from './Element'
import { Scanner } from './Scanner'
import { Component } from './Component'
import { stripTemplateTag } from './utils'

const components = {}

export default {

	start() {

		const body: HTMLElement = document.body

		stripTemplateTag( body )

		Scanner.scan( body, createElement )
		Scanner.observe( body, createElement, disposeElement )
	},

	register( name, module, dependencies = {} ) {
		components[name] = { name, module, dependencies }
	}
}

const createElement = ( element: HTMLElement ) => {

	const ElementInterface = Element( element )
	const names = element.dataset.component.split(/\s/)

	names.forEach( name => {

		const C = components[name]

		if( !C ) {
			console.warn(`Jails - Module ${name} not registered`)
			return
		}

		const { module, dependencies } = C
		ElementInterface.model = Object.assign({}, module.model, ElementInterface.model )

		const base = Component({ name, element, dependencies, ElementInterface })
		const promise = module.default(base)

		if( promise && promise.then ) {
			ElementInterface.promises.push(promise)
		}

		base.__initialize()
		ElementInterface.view = module.view || ElementInterface.view
		ElementInterface.instances[name] = { methods: {} }
	})

	ElementInterface.update()
}

const disposeElement = ( node ) => {
	if( node.__instance__)
		node.__instance__.dispose()
}