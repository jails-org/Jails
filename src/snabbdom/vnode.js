export function vnode(
    sel,
    data,
    children,
    text,
    elm){
    let key = (elm && elm.id) || data === undefined ? undefined : data.key
    return {
        sel: sel, data: data, children: children,
        text: text, elm: elm, key: key
    }
}

export default vnode