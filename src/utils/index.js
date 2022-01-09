
export const rAF = (fn) => {
	(requestAnimationFrame || setTimeout)(fn, 1000 / 60)
}

export const uuid = () => {
	return 'xxxxxxxx'.replace(/[xy]/g, (c) => {
		const r = Math.random() * 8 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
		return v.toString(8)
	})
}

export const stripTemplateTag = ( element ) => {
	const templates = Array.from(element.querySelectorAll('template'))
	// https://gist.github.com/harmenjanssen/07e425248779c65bc5d11b02fb913274
	templates.forEach( template => {
		template.parentNode.replaceChild(template.content, template )
	})
}

export const dup = (o) => {
	return JSON.parse( JSON.stringify(o) )
}

export const createTemplate = ( html, templates ) => {

	const vroot = document.createElement('div')
	vroot.innerHTML = html
	stripTemplateTag( vroot )

	Array
		.from(vroot.querySelectorAll('[data-component]'))
		.forEach( c => {
			const tplid = c.getAttribute('tplid')
			const cache = templates[tplid]
			if( cache )
				c.outerHTML = cache
		})

	return vroot.innerHTML
}
