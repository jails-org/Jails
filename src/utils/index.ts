const textarea = document.createElement('textarea')

export const decodeHTML = (text) => {
	textarea.innerHTML = text
	return textarea.value
}

export const rAF = (fn) => {
	if (requestAnimationFrame)
		return requestAnimationFrame(fn)
	else
		return setTimeout(fn, 1000 / 60)
}

export const uuid = () => {
	return 'xxxxxxxx'.replace(/[xy]/g, (c) => {
		const r = Math.random() * 8 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
		return v.toString(8)
	})
}

export const dup = (o) => {
	return JSON.parse(JSON.stringify(o))
}

// http://crockford.com/javascript/memory/leak.html
export const purge = (d) => {
	var a = d.attributes, i, l, n
	if (a) {
		for (i = a.length - 1; i >= 0; i -= 1) {
			n = a[i].name
			if (typeof d[n] === 'function') {
				d[n] = null
			}
		}
	}
	a = d.childNodes
	if (a) {
		l = a.length
		for (i = 0; i < l; i += 1) {
			purge(d.childNodes[i])
		}
	}
}

export const safe = (execute, val) => {
	try{return execute()}catch(err){return val || ''}
}
