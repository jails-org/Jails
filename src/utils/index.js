
export const rAF = (fn) => {
	(requestAnimationFrame || setTimeout)(fn, 1000 / 60)
}

export const nextFrame = (fn) => {
	rAF(() => rAF(fn))
}

export const uuid = () => {
	return 'xxxxxxxx'.replace(/[xy]/g, (c) => {
		const r = Math.random() * 8 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
		return v.toString(8)
	})
}

export const stripTemplateTags = ( html ) => {
	return html.replace(/<template.*?>|<\/template>/g, '')
}

export const stripTemplateTag = ( element ) => {
	const templates = Array.from(element.querySelectorAll('template'))
	// https://gist.github.com/harmenjanssen/07e425248779c65bc5d11b02fb913274
	templates.forEach( template => {
		template.parentNode.replaceChild(template.content, template )
	})
}
