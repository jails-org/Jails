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

export const getTemplate = (node) => {
    return node.innerHTML
        .replace(/<template*.>/g, '')
        .replace(/<\/template>/g, '')
}

export const uuid = () => {
    return 'xxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 8 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(8)
    })
}

export const setIds = (html) => {

    const virtual = document.createElement('html')
    virtual.innerHTML = html

    const components = virtual.querySelectorAll('[data-component]')
    const templates = Array.from(components).reverse().reduce(createTemplate, {})

    return { templates, dom: virtual.innerHTML }
}

export const createTemplate = (acc, element) => {
    const id = uuid()
    element.setAttribute('data-reactor-id', id)
    acc[id] = element.outerHTML
    return acc
}

export const dup = ( object ) => {
	return JSON.parse(JSON.stringify(object))
}
