import morphdom from 'morphdom'
import soda from 'sodajs'

export {
    morphdom,
    soda
}

let id = 0

const REACTORID = 'data-reactor-id'
const templates = {}
const instances = {}
const SST = {}

soda.prefix('v-')

export default (option) => {

    setTemplate()

    return Base => {

        if (Base.elm == document.body) {
            Base.reactor = () => console.warn('Reactor can`t be used on document.body')
        } else {

            let pageload = true
            const tid = +Base.elm.getAttribute(REACTORID)
            const html = templates[tid]

            instances[tid] = Base

            Base.reactor = (state) => {

                if (!state) return dup(SST)

                Object.assign(SST, state)
                delete SST.parent
                
                if( pageload ) state.parent = SST
                let status = { hascomponent: false, pageload }

                morphdom(Base.elm, soda(html, dup(state)), lifecycle(status))

                if (status.hascomponent) {
                    if (!Base.jails.observer)
                        Base.jails.start(Base.elm)
                    if (!Base.elm.getAttribute(REACTORID)) {
                        Base.elm.setAttribute(REACTORID, id++)
                        templates[id] = Base.elm.outerHTML
                            .replace(/<template*.>/g, '')
                            .replace(/<\/template>/g, '')
                    }
                }

                status.hascomponent = false
                pageload = false
            }
        }

        const lifecycle = (status) => ({

            getNodeKey(node) {
                const key = node.getAttribute && node.getAttribute('data-key')
                const id = node.getAttribute && node.getAttribute(REACTORID)
                return key || id
            },

            onBeforeElChildrenUpdated(node, tonode) {
                if (node.getAttribute) {
                    if (node.getAttribute('data-static') && node != Base.elm) {
                        return false
                    }
                    if (node.getAttribute('data-component') && node != Base.elm && !status.pageload) {
                        const ID = +node.getAttribute(REACTORID)
                        instances[ID].Msg.set(state => state.parent = SST)
                        return false
                    }
                }
            },

            onNodeAdded(node) {
                if (node.getAttribute && node.getAttribute('data-component') && !node.j) {
                    status.hascomponent = true
                }
            },

            onNodeDiscarded(node) {
                if (node.getAttribute && node.getAttribute('data-component') && node.j) {
                    Base.jails.destroy(node)
                }
            },

            onBeforeNodeAdded(node) {
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
            },

            onBeforeNodeDiscarded(node) {
                if (node.getAttribute) {
                    const animation = node.getAttribute('data-animation-leave')
                    if (animation) {
                        node.classList.add(animation)
                        const remove = () => {
                            node.removeEventListener(transitionEnd, remove)
                            node.removeEventListener(animationEnd, remove)
                            node.parentNode ? node.parentNode.removeChild(node) : null
                        }
                        node.addEventListener(transitionEnd, remove)
                        node.addEventListener(animationEnd, remove)
                        node.classList.add(animation)
                        return false
                    }
                }
            }
        })

        return Base
    }
}

function rAF(fn) {
    (requestAnimationFrame || setTimeout)(fn)
}

function dup(object) {
    return JSON.parse(JSON.stringify(object))
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