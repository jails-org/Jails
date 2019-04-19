
export const onBeforeAdd = ( node ) => {
    
    if (node.getAttribute) {
        
        const animation = node.getAttribute('data-animation')
        
        if (animation) {
            const enter = `${animation}-enter`
            const enterActive = `${animation}-enter-active` 
            const addClassNames = addClass(node)
            addClassNames(`${enter} ${enterActive}`)
        }
    }
}

export const onAdd = (node) => {
    
    if (node.getAttribute) {
        
        const animation = node.getAttribute('data-animation')
        
        if (animation) {
            
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
    }
}

export const onRemove = ( node ) => {
    
    if (node.getAttribute) {
    
        const animation = node.getAttribute('data-animation')
        
        if (animation) {
            
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

            return false
        }
    }
}

function rAF(fn) {
    (requestAnimationFrame || setTimeout)(fn, 1000/60)
}

function nextFrame(fn){
    rAF(() => rAF(fn))
}

const addClass = (element) => (string) => 
    string.split(/\s/).map( item => element.classList.add(item) )

const removeClass = (element) => (string) => 
    string.split(/\s/).map( item => element.classList.remove(item) )

const getPrefix = (object) => {
    for (let key in object)
        if (key in document.body.style)
            return object[key]
}

const animationEnd = getPrefix({
    animation: 'animationend',
    OAnimation: 'oAnimationEnd',
    MozAnimation: 'animationend',
    WebkitAnimation: 'webkitAnimationEnd'
})

const transitionEnd = getPrefix({
    transition: 'transitionend',
    OTransition: 'oTransitionEnd',
    MozTransition: 'transitionend',
    WebkitTransition: 'webkitTransitionEnd'
})