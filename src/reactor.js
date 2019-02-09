import soda     from 'sodajs'
import snabbdom from './snabbdom'
import toVnode  from './snabbdom/tovnode'

soda.prefix('v-')
const SST = {}

const patch = snabbdom()

export default () => (Base) => {
    
    let vnode = toVnode(Base.elm)
    
    const template = Base.elm.outerHTML
        .replace(/<template*.>/g, '')
        .replace(/<\/template>/g, '')
    
    Base.reactor = ( state ) => {
        if (!state) return dup(SST)
        Object.assign(SST, state)
        const newstate = Object.assign({}, dup(SST), state)
        const html = soda(template, newstate) 
        const newelement = toVnode(createElementFromHTML( html ))
        vnode = patch(vnode, newelement)
    }

    return Base 
}

function createElementFromHTML( htmlString ) {
    const div = document.createElement('div')
    div.innerHTML = htmlString.trim()
    return div.firstChild
}

function dup(object) {
    return JSON.parse(JSON.stringify(object))
}