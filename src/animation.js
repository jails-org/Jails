import {
	addClass,
	removeClass,
	animationEnd,
	transitionEnd,
	nextFrame
} from './utils'

export const onBeforeAdd = (node, animation) => {

    const enter = `${animation}-enter`
    const enterActive = `${animation}-enter-active`
    const addClassNames = addClass(node)

    addClassNames(`${enter} ${enterActive}`)
}

export const onAdd = (node, animation) => {

    const enter = `${animation}-enter`
    const enterActive = `${animation}-enter-active`
    const enterTo = `${animation}-enter-to`
    const removeClassNames = removeClass(node)
    const addClassNames = addClass(node)

    const remove = () => {
        removeClassNames(`${enter} ${enterActive} ${enterTo}`)
        node.removeEventListener(transitionEnd, remove)
        node.removeEventListener(animationEnd, remove)
    }

    node.addEventListener(transitionEnd, remove)
    node.addEventListener(animationEnd, remove)

    nextFrame(() => {
        addClassNames(enterTo)
        removeClassNames(enter)
    })
}

export const onRemove = (node, animation) => {

    const leave = `${animation}-leave`
    const leaveActive = `${animation}-leave-active`
    const leaveTo = `${animation}-leave-to`
    const removeClassNames = removeClass(node)
    const addClassNames = addClass(node)

    const remove = (e) => {
        removeClassNames(`${leaveActive} ${leaveTo}`)
        node.removeEventListener(transitionEnd, remove)
        node.removeEventListener(animationEnd, remove)
        node.parentNode ? node.parentNode.removeChild(node) : null
    }

    node.addEventListener(transitionEnd, remove)
    node.addEventListener(animationEnd, remove)

	addClassNames(`${leave} ${leaveActive}`)

    nextFrame(() => {
        removeClassNames(leave)
        addClassNames(leaveTo)
    })
}

export const animateNodes = (node, callback) => {

	const childnodes = node.nodeType == 1
		? Array.prototype.slice.call(node.querySelectorAll('[data-animation]'))
		: []

	const list = node.dataset && node.dataset.animation
		? [node].concat(childnodes)
		: childnodes

	list.forEach(n => callback(n, n.dataset.animation))

	return list.length > 0
}
