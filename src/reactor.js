import soda     from 'sodajs'
import snabbdom from './snabbdom'
import toVnode  from './snabbdom/tovnode'

soda.prefix('v-')

let id = 0

const REACTORID = 'data-reactor-id'
const templates = {}
const model = {}
const SST = {}

export default () =>  {
    
    setTemplate()

    return (Base) => {

        const tid = +Base.elm.getAttribute(REACTORID)
        const template = templates[tid]
        let vnode = toVnode(Base.elm)

        const patch = hooks( Base )
        
        Base.reactor = ( state ) => {
            
            if (!state) return dup(SST)
            Object.assign(SST, state)
            
            const newstate = Object.assign({}, dup(SST), state)
            const html = soda(template, newstate) 
            const newelement = toVnode(createElementFromHTML( html ))
            
            vnode = patch(vnode, newelement)
            model[tid] = newstate

            if (!Base.elm.getAttribute(REACTORID)) {
                Base.elm.setAttribute(REACTORID, id++)
                templates[id] = newnode.outerHTML
                    .replace(/<template*.>/g, '')
                    .replace(/<\/template>/g, '')
            }
        }

        Base.reactor.templates = templates
        Base.reactor.model = model
        Base.reactor.REACTORID = REACTORID
        Base.reactor.SST = SST

        return Base 
    }
}

function hooks(Base){
    return snabbdom({
        update(node, next) {
            if (node.getAttribute) {
                if (!(node.getAttribute('data-static') && node != Base.elm)) {
                    next()
                }
            }
        },
        add(node, next) {
            if (node.getAttribute) {
                const animation = node.getAttribute('data-animation-before-enter')
                if (animation) {
                    const afterEnter = node.getAttribute('data-animation-enter')
                    node.classList.add(animation)
                    rAF(() => {
                        node.classList.add(afterEnter)
                        rAF(() => {
                            node.classList.remove(animation)
                            node.classList.remove(afterEnter)
                        })
                    })
                }
            }
            next()
        },
        remove(node, next) {
            if (node.getAttribute) {
                const animation = node.getAttribute('data-animation-leave')
                if (animation) {
                    node.classList.add(animation)
                    const remove = () => {
                        node.removeEventListener(transitionEnd, remove)
                        node.removeEventListener(animationEnd, remove)
                        next()
                    }
                    node.addEventListener(transitionEnd, remove)
                    node.addEventListener(animationEnd, remove)
                    node.classList.add(animation)
                    
                }else {
                    next()
                }
            }else {
                next()
            }
        }
    })
}

function createElementFromHTML( htmlString ) {
    const div = document.createElement('div')
    div.innerHTML = htmlString.trim()
    return div.firstChild
}

function dup(object) {
    return JSON.parse(JSON.stringify(object))
}


function rAF(fn) {
    (requestAnimationFrame || setTimeout)(fn)
}

function setTemplate(context = document.body) {

    const virtual = document.createElement('div')
    const elements = Array.prototype.slice.call(context.querySelectorAll('[data-component]'))

    elements.forEach((elm, index) => elm.setAttribute(REACTORID, id++))

    virtual.innerHTML = context.innerHTML
        .replace(/<template*.>/g, '')
        .replace(/<\/template>/g, '')

    const virtualComponents = Array.prototype.slice.call(virtual.querySelectorAll('[data-component]'))
    const newItems = virtualComponents.filter(item => !item.getAttribute(REACTORID))

    newItems.forEach(elm => elm.setAttribute(REACTORID, id++))

    virtualComponents.forEach(elm => {
        const ID = +elm.getAttribute(REACTORID)
        if (!templates[ID])
            templates[ID] = elm.outerHTML
    })
}

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