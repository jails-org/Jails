
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
