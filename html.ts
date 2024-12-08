// From
// https://2ality.com/2015/01/template-strings-html.html#comment-2078932192
export default function Html (literalSections, ...substs) {

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
