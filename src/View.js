import morphdom from 'morphdom'
import sodajs from 'sodajs'

export default function View () {

	const root = document.body

	const start = () => {
		render()
	}

	const render = () => {
		root.innerHTML =
	}

	const getTemplate = ( html, type = 'html' ) => {

		const virtual = document.createElement(type)
		virtual.innerHTML = html.replace(/<template*.>/g, '').replace(/<\/template>/g, '')

		const elements = virtual.querySelectorAll('[data-component]:not([data-reactor-id])')
		const templates = Array.from(elements).reverse().reduce(createTemplate, {})

		return { templates, html: virtual.innerHTML }
	}

	return {
		start
	}
}
