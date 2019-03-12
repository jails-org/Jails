import morphdom from 'morphdom'
import soda from 'sodajs'
import * as animation from './animation'

export {
    morphdom,
    soda
}

let id = 0

const REACTORID = 'data-reactor-id'
const templates = {}
const instances = {}
const SST = {}
const model = {}

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
   
                const newstate = dup(Object.assign({}, model[tid], state))
                Object.assign(SST, newstate)
                delete SST.parent
                newstate.parent = SST 
                
                let status = { hascomponent: false, pageload }

                morphdom(Base.elm, soda(html, newstate), lifecycle(status))

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
                model[tid] = newstate
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
                    if ( 'static' in node.dataset && node != Base.elm)
                        return false
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
                return animation.onAdd(node)
            },

            onNodeDiscarded(node) {
                if (node.getAttribute && node.getAttribute('data-component') && node.j) {
                    Base.jails.destroy(node)
                }
            },

            onBeforeNodeAdded(node) {
                return animation.onBeforeAdd(node)
            },

            onBeforeNodeDiscarded(node) {
                return animation.onRemove(node)
            }
        })

        return Base
    }
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
