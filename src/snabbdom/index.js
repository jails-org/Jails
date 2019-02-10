/* global module, document, Node */

import vnode from './vnode'
import * as is from './is'
import htmlDomApi from './htmldomapi'


export default ( hooks = {} ) => {

    const api = htmlDomApi

    function emptyNodeAt(elm) {
        const id = elm.id ? '#' + elm.id : ''
        const c = elm.className ? '.' + elm.className.split(' ').join('.') : ''
        return vnode(api.tagName(elm).toLowerCase() + id + c, {}, [], undefined, elm)
    }

    function createElm(vnode, insertedVnodeQueue){
        let i, data = vnode.data
        if (data !== undefined) {
            if (isDef(i = i.init)) {
                i(vnode)
                data = vnode.data
            }
        }
        let children = vnode.children, sel = vnode.sel
        if (sel === '!') {
            if (isUndef(vnode.text)) {
                vnode.text = ''
            }
            vnode.elm = api.createComment(vnode.text)
        } else if (sel !== undefined) {
            // Parse selector
            const hashIdx = sel.indexOf('#')
            const dotIdx = sel.indexOf('.', hashIdx)
            const hash = hashIdx > 0 ? hashIdx : sel.length
            const dot = dotIdx > 0 ? dotIdx : sel.length
            const tag = hashIdx !== -1 || dotIdx !== -1 ? sel.slice(0, Math.min(hash, dot)) : sel
            const elm = vnode.elm = isDef(data) && isDef(i = data.ns) ? api.createElementNS(i, tag) : api.createElement(tag)
            if (hash < dot) elm.setAttribute('id', sel.slice(hash + 1, dot))
            if (dotIdx > 0) elm.setAttribute('class', sel.slice(dot + 1).replace(/\./g, ' '))
            if (is.array(children)) {
                for (i = 0; i < children.length; ++i) {
                    const ch = children[i]
                    if (ch != null) {
                        api.appendChild(elm, createElm(ch, insertedVnodeQueue))
                    }
                }
            } else if (is.primitive(vnode.text)) {
                api.appendChild(elm, api.createTextNode(vnode.text))
            }
            if (isDef(i)) {
                if (i.create) i.create(emptyNode, vnode)
                if (i.insert) insertedVnodeQueue.push(vnode)
            }
        } else {
            vnode.elm = api.createTextNode(vnode.text)
        }
        return vnode.elm
    }

    function addVnodes(parentElm,
        before,
        vnodes,
        startIdx,
        endIdx,
        insertedVnodeQueue) {
        for (; startIdx <= endIdx; ++startIdx) {
            const ch = vnodes[startIdx]
            if (ch != null) {
                hooks.add 
                    ? hooks.add(ch.elm, () => api.insertBefore(parentElm, createElm(ch, insertedVnodeQueue), before))
                    : api.insertBefore(parentElm, createElm(ch, insertedVnodeQueue), before)
            }
        }
    }

    function removeVnodes(parentElm, vnodes, startIdx, endIdx){
        for (; startIdx <= endIdx; ++startIdx) {
            let ch = vnodes[startIdx]
            if (ch != null) {
                if (isDef(ch.sel)) {
                    const parent = api.parentNode(ch.elm)
                    hooks.remove 
                        ? hooks.remove(ch.elm, () => api.removeChild(parent, ch.elm))
                        : api.removeChild(parent, ch.elm)
                } else { // Text node
                    api.removeChild(parentElm, ch.elm)
                }
            }
        }
    }

    function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue) {
        let oldStartIdx = 0, newStartIdx = 0
        let oldEndIdx = oldCh.length - 1
        let oldStartVnode = oldCh[0]
        let oldEndVnode = oldCh[oldEndIdx]
        let newEndIdx = newCh.length - 1
        let newStartVnode = newCh[0]
        let newEndVnode = newCh[newEndIdx]
        let oldKeyToIdx
        let idxInOld
        let elmToMove
        let before

        while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
            if (oldStartVnode == null) {
                oldStartVnode = oldCh[++oldStartIdx] // Vnode might have been moved left
            } else if (oldEndVnode == null) {
                oldEndVnode = oldCh[--oldEndIdx]
            } else if (newStartVnode == null) {
                newStartVnode = newCh[++newStartIdx]
            } else if (newEndVnode == null) {
                newEndVnode = newCh[--newEndIdx]
            } else if (sameVnode(oldStartVnode, newStartVnode)) {
                patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue)
                oldStartVnode = oldCh[++oldStartIdx]
                newStartVnode = newCh[++newStartIdx]
            } else if (sameVnode(oldEndVnode, newEndVnode)) {
                patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue)
                oldEndVnode = oldCh[--oldEndIdx]
                newEndVnode = newCh[--newEndIdx]
            } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
                patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue)
                api.insertBefore(parentElm, oldStartVnode.elm, api.nextSibling(oldEndVnode.elm))
                oldStartVnode = oldCh[++oldStartIdx]
                newEndVnode = newCh[--newEndIdx]
            } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
                patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue)
                api.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)
                oldEndVnode = oldCh[--oldEndIdx]
                newStartVnode = newCh[++newStartIdx]
            } else {
                if (oldKeyToIdx === undefined) {
                    oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
                }
                idxInOld = oldKeyToIdx[newStartVnode.key]
                if (isUndef(idxInOld)) { // New element
                    api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm)
                    newStartVnode = newCh[++newStartIdx]
                } else {
                    elmToMove = oldCh[idxInOld]
                    if (elmToMove.sel !== newStartVnode.sel) {
                        api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm)
                    } else {
                        patchVnode(elmToMove, newStartVnode, insertedVnodeQueue)
                        oldCh[idxInOld] = undefined;
                        api.insertBefore(parentElm, elmToMove.elm, oldStartVnode.elm)
                    }
                    newStartVnode = newCh[++newStartIdx]
                }
            }
        }
        if (oldStartIdx <= oldEndIdx || newStartIdx <= newEndIdx) {
            if (oldStartIdx > oldEndIdx) {
                before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm
                addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx, insertedVnodeQueue)
            } else {
                removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx)
            }
        }
    }

    function patchVnode(oldVnode, vnode, insertedVnodeQueue) {
        const elm = vnode.elm = oldVnode.elm
        let oldCh = oldVnode.children
        let ch = vnode.children
        if (oldVnode === vnode) return
        if (isUndef(vnode.text)) {
            if (isDef(oldCh) && isDef(ch)) {
                if (oldCh !== ch) {
                    hooks.update
                        ? hooks.update(elm, () => updateChildren(elm, oldCh, ch, insertedVnodeQueue))
                        : updateChildren(elm, oldCh, ch, insertedVnodeQueue)
                }
            } else if (isDef(ch)) {
                if (isDef(oldVnode.text)) api.setTextContent(elm, '')
                addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)
            } else if (isDef(oldCh)) {
                removeVnodes(elm, oldCh, 0, oldCh).length - 1
            } else if (isDef(oldVnode.text)) {
                api.setTextContent(elm, '')
            }
        } else if (oldVnode.text !== vnode.text) {
            if (isDef(oldCh)) {
                removeVnodes(elm, oldCh, 0, oldCh.length - 1)
            }
            api.setTextContent(elm, vnode.text)
        }
    }

    return function patch(oldVnode, vnode){
        let elm, parent;
        const insertedVnodeQueue = [];
        if (!isVnode(oldVnode)) {
            oldVnode = emptyNodeAt(oldVnode)
        }
        if (sameVnode(oldVnode, vnode)) {
            patchVnode(oldVnode, vnode, insertedVnodeQueue)
        } else {
            elm = oldVnode.elm
            parent = api.parentNode(elm)
            createElm(vnode, insertedVnodeQueue)
            if (parent !== null) {
                api.insertBefore(parent, vnode.elm, api.nextSibling(elm))
                removeVnodes(parent, [oldVnode], 0, 0)
            }
        }
        return vnode
    };
}

function isUndef(s) { return s === undefined }
function isDef(s) { return s !== undefined }

const emptyNode = vnode('', {}, [], undefined, undefined)

function sameVnode(vnode1, vnode2) {
    return vnode1.key === vnode2.key && vnode1.sel === vnode2.sel
}

function isVnode(vnode) {
    return vnode.sel !== undefined
}

function createKeyToOldIdx(children, beginIdx, endIdx) {
    let i, map = {}, key, ch
    for (i = beginIdx; i <= endIdx; ++i) {
        ch = children[i]
        if (ch != null) {
            key = ch.key
            if (key !== undefined) map[key] = i
        }
    }
    return map
}