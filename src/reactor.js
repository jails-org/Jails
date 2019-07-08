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
            
            refreshTemplate( Base.elm )
            
            let pageload = true
            const tid = +Base.elm.getAttribute(REACTORID)
            const html = templates[tid]

            instances[tid] = Base

            Base.reactor = (state) => {

                if (!state) return dup(SST)
                
                const newstate = Object.assign({}, model[tid], state)
                Object.assign(SST, newstate)
                delete SST.parent
                newstate.parent = SST

                let status = { hascomponent: false, pageload }

                morphdom(Base.elm, soda(html, dup(newstate)), lifecycle(status))

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

            Base.reactor.SST = SST
        }

        const lifecycle = (status) => ({

            getNodeKey(node) {
                const key = node.nodeType != 3 && node.getAttribute('data-key')
                // const id = node.getAttribute && node.getAttribute(REACTORID)
                return key || node.id
            },

            onBeforeElChildrenUpdated(node, tonode) {
                if (node.nodeType != 3) {
                    if ( 'static' in node.dataset && node != Base.elm)
                        return false
                    if (node.getAttribute('data-component') && node != Base.elm ){ //&& !status.pageload) {
                        const ID = +node.getAttribute(REACTORID)
                        const instance = instances[ID]
                        if( instance )
                            instance.Msg.set(state => state.parent = SST)
                        return false
                    }
                }
            },

            onNodeAdded(node) {
                if (node.nodeType != 3 && node.getAttribute('data-component') && !node.j) {
                    status.hascomponent = true
                }
                animateNodes(node, animation.onAdd)
            },

            onNodeDiscarded(node) {
                if (node.nodeType != 3 && node.getAttribute('data-component') && node.j) {
                    Base.jails.destroy(node)
                }
            },

            onBeforeNodeAdded(node) {
                animateNodes(node, animation.onBeforeAdd) 
            },

            onBeforeNodeDiscarded(node) {
                return !animateNodes(node, animation.onRemove)
            }
        })

        return Base
    }
}

const animateNodes = (node, callback) => {

    const childnodes = node.nodeType != 3
        ? Array.prototype.slice.call(node.querySelectorAll('[data-animation]'))
        : []

    const list = node.dataset && node.dataset.animation
        ? [node].concat( childnodes )
        : childnodes

    list.forEach( n => callback(n, n.dataset.animation) )

    return list.length > 0
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

function refreshTemplate( elm ){

    if (elm.getAttribute(REACTORID) ) return 

    id = id + 1
    const newid = id
    elm.setAttribute(REACTORID, newid)

    templates[ newid ] = elm.outerHTML
        .replace(/<template*.>/g, '')
        .replace(/<\/template>/g, '')
}