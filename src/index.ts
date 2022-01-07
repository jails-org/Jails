import { createElement, disposeElement } from './Element'
import { Scanner } from './Scanner'

export default {

	start() {

		const body: HTMLElement = document.body

		Scanner.observe( body, createElement, disposeElement )
		Scanner.scan( body, createElement )
	}
}
