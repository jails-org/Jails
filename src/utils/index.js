
export const rAF = (fn) => {
	(requestAnimationFrame || setTimeout)(fn, 1000 / 60)
}

export const nextFrame = (fn) => {
	rAF(() => rAF(fn))
}

export const addClass = (element) => (string) => {
	string.split(/\s/).map(item => element.classList.add(item))
}

export const removeClass = (element) => (string) => {
	string.split(/\s/).map(item => element.classList.remove(item))
}

export const getPrefix = (object) => {
	for (let key in object)
		if (key in document.body.style)
			return object[key]
}

export const animationEnd = getPrefix({
	animation: 'animationend',
	OAnimation: 'oAnimationEnd',
	MozAnimation: 'animationend',
	WebkitAnimation: 'webkitAnimationEnd'
})

export const transitionEnd = getPrefix({
	transition: 'transitionend',
	OTransition: 'oTransitionEnd',
	MozTransition: 'transitionend',
	WebkitTransition: 'webkitTransitionEnd'
})

export const uuid = () => {
	return 'xxxxxxxx'.replace(/[xy]/g, (c) => {
		const r = Math.random() * 8 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
		return v.toString(8)
	})
}

export const setIds = (acc, element) => {
	const id = uuid()
	element.setAttribute('data-reactor-id', id)
	acc[id] = element.outerHTML.replace(/<(x-)?template*.>|<\/(x-)?template>/g, '')
	return acc
}

export const createTemplates = ( html, type = 'div' ) => {

	const SELECTOR = '[data-component]:not([data-reactor-id])'
	const virtual = document.createElement(type)
	virtual.innerHTML = html.replace(/<template*.>/g, '<x-template>').replace(/<\/template>/g, '</x-template>')

	const elements = Array.from(virtual.querySelectorAll(SELECTOR))
	const templates = elements.reverse().reduce(setIds, {})

	return {
		templates,
		html: virtual.innerHTML.replace(/<x-template*.>/g, '<template>').replace(/<\/x-template>/g, '</template>')
	}
}

export const dup = (object) => {
	return JSON.parse(JSON.stringify(object))
}

export const getParent = (el, selector) => {
	let elem = el.parentNode
	for ( ; elem && elem !== document; elem = elem.parentNode ) {
		if ( elem.matches( selector ) ) return elem
	}
	return null
}
