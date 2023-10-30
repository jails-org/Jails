const textarea = document.createElement('textarea')

export const $for = { scopes: {} }

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

// From
// https://2ality.com/2015/01/template-strings-html.html#comment-2078932192
export const html = (literalSections, ...substs) => {

	// Use raw literal sections: we don’t want
	// backslashes (\n etc.) to be interpreted
	let raw = literalSections.raw

	let result = ''

	substs.forEach((subst, i) => {
		// Retrieve the literal section preceding
		// the current substitution
		let lit = raw[i]

		// In the example, map() returns an array:
		// If substitution is an array (and not a string),
		// we turn it into a string
		if (Array.isArray(subst)) {
			subst = subst.join('')
		}

		result += lit
		result += subst
	})
	// Take care of last literal section
	// (Never fails, because an empty template string
	// produces one literal section, an empty string)
	result += raw[raw.length-1] // (A)

	return result
}
