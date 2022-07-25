(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("jails", [], factory);
	else if(typeof exports === 'object')
		exports["jails"] = factory();
	else
		root["jails"] = factory();
})(self, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/morphdom/dist/morphdom-esm.js":
/*!****************************************************!*\
  !*** ./node_modules/morphdom/dist/morphdom-esm.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var DOCUMENT_FRAGMENT_NODE = 11;

function morphAttrs(fromNode, toNode) {
    var toNodeAttrs = toNode.attributes;
    var attr;
    var attrName;
    var attrNamespaceURI;
    var attrValue;
    var fromValue;

    // document-fragments dont have attributes so lets not do anything
    if (toNode.nodeType === DOCUMENT_FRAGMENT_NODE || fromNode.nodeType === DOCUMENT_FRAGMENT_NODE) {
      return;
    }

    // update attributes on original DOM element
    for (var i = toNodeAttrs.length - 1; i >= 0; i--) {
        attr = toNodeAttrs[i];
        attrName = attr.name;
        attrNamespaceURI = attr.namespaceURI;
        attrValue = attr.value;

        if (attrNamespaceURI) {
            attrName = attr.localName || attrName;
            fromValue = fromNode.getAttributeNS(attrNamespaceURI, attrName);

            if (fromValue !== attrValue) {
                if (attr.prefix === 'xmlns'){
                    attrName = attr.name; // It's not allowed to set an attribute with the XMLNS namespace without specifying the `xmlns` prefix
                }
                fromNode.setAttributeNS(attrNamespaceURI, attrName, attrValue);
            }
        } else {
            fromValue = fromNode.getAttribute(attrName);

            if (fromValue !== attrValue) {
                fromNode.setAttribute(attrName, attrValue);
            }
        }
    }

    // Remove any extra attributes found on the original DOM element that
    // weren't found on the target element.
    var fromNodeAttrs = fromNode.attributes;

    for (var d = fromNodeAttrs.length - 1; d >= 0; d--) {
        attr = fromNodeAttrs[d];
        attrName = attr.name;
        attrNamespaceURI = attr.namespaceURI;

        if (attrNamespaceURI) {
            attrName = attr.localName || attrName;

            if (!toNode.hasAttributeNS(attrNamespaceURI, attrName)) {
                fromNode.removeAttributeNS(attrNamespaceURI, attrName);
            }
        } else {
            if (!toNode.hasAttribute(attrName)) {
                fromNode.removeAttribute(attrName);
            }
        }
    }
}

var range; // Create a range object for efficently rendering strings to elements.
var NS_XHTML = 'http://www.w3.org/1999/xhtml';

var doc = typeof document === 'undefined' ? undefined : document;
var HAS_TEMPLATE_SUPPORT = !!doc && 'content' in doc.createElement('template');
var HAS_RANGE_SUPPORT = !!doc && doc.createRange && 'createContextualFragment' in doc.createRange();

function createFragmentFromTemplate(str) {
    var template = doc.createElement('template');
    template.innerHTML = str;
    return template.content.childNodes[0];
}

function createFragmentFromRange(str) {
    if (!range) {
        range = doc.createRange();
        range.selectNode(doc.body);
    }

    var fragment = range.createContextualFragment(str);
    return fragment.childNodes[0];
}

function createFragmentFromWrap(str) {
    var fragment = doc.createElement('body');
    fragment.innerHTML = str;
    return fragment.childNodes[0];
}

/**
 * This is about the same
 * var html = new DOMParser().parseFromString(str, 'text/html');
 * return html.body.firstChild;
 *
 * @method toElement
 * @param {String} str
 */
function toElement(str) {
    str = str.trim();
    if (HAS_TEMPLATE_SUPPORT) {
      // avoid restrictions on content for things like `<tr><th>Hi</th></tr>` which
      // createContextualFragment doesn't support
      // <template> support not available in IE
      return createFragmentFromTemplate(str);
    } else if (HAS_RANGE_SUPPORT) {
      return createFragmentFromRange(str);
    }

    return createFragmentFromWrap(str);
}

/**
 * Returns true if two node's names are the same.
 *
 * NOTE: We don't bother checking `namespaceURI` because you will never find two HTML elements with the same
 *       nodeName and different namespace URIs.
 *
 * @param {Element} a
 * @param {Element} b The target element
 * @return {boolean}
 */
function compareNodeNames(fromEl, toEl) {
    var fromNodeName = fromEl.nodeName;
    var toNodeName = toEl.nodeName;
    var fromCodeStart, toCodeStart;

    if (fromNodeName === toNodeName) {
        return true;
    }

    fromCodeStart = fromNodeName.charCodeAt(0);
    toCodeStart = toNodeName.charCodeAt(0);

    // If the target element is a virtual DOM node or SVG node then we may
    // need to normalize the tag name before comparing. Normal HTML elements that are
    // in the "http://www.w3.org/1999/xhtml"
    // are converted to upper case
    if (fromCodeStart <= 90 && toCodeStart >= 97) { // from is upper and to is lower
        return fromNodeName === toNodeName.toUpperCase();
    } else if (toCodeStart <= 90 && fromCodeStart >= 97) { // to is upper and from is lower
        return toNodeName === fromNodeName.toUpperCase();
    } else {
        return false;
    }
}

/**
 * Create an element, optionally with a known namespace URI.
 *
 * @param {string} name the element name, e.g. 'div' or 'svg'
 * @param {string} [namespaceURI] the element's namespace URI, i.e. the value of
 * its `xmlns` attribute or its inferred namespace.
 *
 * @return {Element}
 */
function createElementNS(name, namespaceURI) {
    return !namespaceURI || namespaceURI === NS_XHTML ?
        doc.createElement(name) :
        doc.createElementNS(namespaceURI, name);
}

/**
 * Copies the children of one DOM element to another DOM element
 */
function moveChildren(fromEl, toEl) {
    var curChild = fromEl.firstChild;
    while (curChild) {
        var nextChild = curChild.nextSibling;
        toEl.appendChild(curChild);
        curChild = nextChild;
    }
    return toEl;
}

function syncBooleanAttrProp(fromEl, toEl, name) {
    if (fromEl[name] !== toEl[name]) {
        fromEl[name] = toEl[name];
        if (fromEl[name]) {
            fromEl.setAttribute(name, '');
        } else {
            fromEl.removeAttribute(name);
        }
    }
}

var specialElHandlers = {
    OPTION: function(fromEl, toEl) {
        var parentNode = fromEl.parentNode;
        if (parentNode) {
            var parentName = parentNode.nodeName.toUpperCase();
            if (parentName === 'OPTGROUP') {
                parentNode = parentNode.parentNode;
                parentName = parentNode && parentNode.nodeName.toUpperCase();
            }
            if (parentName === 'SELECT' && !parentNode.hasAttribute('multiple')) {
                if (fromEl.hasAttribute('selected') && !toEl.selected) {
                    // Workaround for MS Edge bug where the 'selected' attribute can only be
                    // removed if set to a non-empty value:
                    // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/12087679/
                    fromEl.setAttribute('selected', 'selected');
                    fromEl.removeAttribute('selected');
                }
                // We have to reset select element's selectedIndex to -1, otherwise setting
                // fromEl.selected using the syncBooleanAttrProp below has no effect.
                // The correct selectedIndex will be set in the SELECT special handler below.
                parentNode.selectedIndex = -1;
            }
        }
        syncBooleanAttrProp(fromEl, toEl, 'selected');
    },
    /**
     * The "value" attribute is special for the <input> element since it sets
     * the initial value. Changing the "value" attribute without changing the
     * "value" property will have no effect since it is only used to the set the
     * initial value.  Similar for the "checked" attribute, and "disabled".
     */
    INPUT: function(fromEl, toEl) {
        syncBooleanAttrProp(fromEl, toEl, 'checked');
        syncBooleanAttrProp(fromEl, toEl, 'disabled');

        if (fromEl.value !== toEl.value) {
            fromEl.value = toEl.value;
        }

        if (!toEl.hasAttribute('value')) {
            fromEl.removeAttribute('value');
        }
    },

    TEXTAREA: function(fromEl, toEl) {
        var newValue = toEl.value;
        if (fromEl.value !== newValue) {
            fromEl.value = newValue;
        }

        var firstChild = fromEl.firstChild;
        if (firstChild) {
            // Needed for IE. Apparently IE sets the placeholder as the
            // node value and vise versa. This ignores an empty update.
            var oldValue = firstChild.nodeValue;

            if (oldValue == newValue || (!newValue && oldValue == fromEl.placeholder)) {
                return;
            }

            firstChild.nodeValue = newValue;
        }
    },
    SELECT: function(fromEl, toEl) {
        if (!toEl.hasAttribute('multiple')) {
            var selectedIndex = -1;
            var i = 0;
            // We have to loop through children of fromEl, not toEl since nodes can be moved
            // from toEl to fromEl directly when morphing.
            // At the time this special handler is invoked, all children have already been morphed
            // and appended to / removed from fromEl, so using fromEl here is safe and correct.
            var curChild = fromEl.firstChild;
            var optgroup;
            var nodeName;
            while(curChild) {
                nodeName = curChild.nodeName && curChild.nodeName.toUpperCase();
                if (nodeName === 'OPTGROUP') {
                    optgroup = curChild;
                    curChild = optgroup.firstChild;
                } else {
                    if (nodeName === 'OPTION') {
                        if (curChild.hasAttribute('selected')) {
                            selectedIndex = i;
                            break;
                        }
                        i++;
                    }
                    curChild = curChild.nextSibling;
                    if (!curChild && optgroup) {
                        curChild = optgroup.nextSibling;
                        optgroup = null;
                    }
                }
            }

            fromEl.selectedIndex = selectedIndex;
        }
    }
};

var ELEMENT_NODE = 1;
var DOCUMENT_FRAGMENT_NODE$1 = 11;
var TEXT_NODE = 3;
var COMMENT_NODE = 8;

function noop() {}

function defaultGetNodeKey(node) {
  if (node) {
      return (node.getAttribute && node.getAttribute('id')) || node.id;
  }
}

function morphdomFactory(morphAttrs) {

    return function morphdom(fromNode, toNode, options) {
        if (!options) {
            options = {};
        }

        if (typeof toNode === 'string') {
            if (fromNode.nodeName === '#document' || fromNode.nodeName === 'HTML' || fromNode.nodeName === 'BODY') {
                var toNodeHtml = toNode;
                toNode = doc.createElement('html');
                toNode.innerHTML = toNodeHtml;
            } else {
                toNode = toElement(toNode);
            }
        }

        var getNodeKey = options.getNodeKey || defaultGetNodeKey;
        var onBeforeNodeAdded = options.onBeforeNodeAdded || noop;
        var onNodeAdded = options.onNodeAdded || noop;
        var onBeforeElUpdated = options.onBeforeElUpdated || noop;
        var onElUpdated = options.onElUpdated || noop;
        var onBeforeNodeDiscarded = options.onBeforeNodeDiscarded || noop;
        var onNodeDiscarded = options.onNodeDiscarded || noop;
        var onBeforeElChildrenUpdated = options.onBeforeElChildrenUpdated || noop;
        var childrenOnly = options.childrenOnly === true;

        // This object is used as a lookup to quickly find all keyed elements in the original DOM tree.
        var fromNodesLookup = Object.create(null);
        var keyedRemovalList = [];

        function addKeyedRemoval(key) {
            keyedRemovalList.push(key);
        }

        function walkDiscardedChildNodes(node, skipKeyedNodes) {
            if (node.nodeType === ELEMENT_NODE) {
                var curChild = node.firstChild;
                while (curChild) {

                    var key = undefined;

                    if (skipKeyedNodes && (key = getNodeKey(curChild))) {
                        // If we are skipping keyed nodes then we add the key
                        // to a list so that it can be handled at the very end.
                        addKeyedRemoval(key);
                    } else {
                        // Only report the node as discarded if it is not keyed. We do this because
                        // at the end we loop through all keyed elements that were unmatched
                        // and then discard them in one final pass.
                        onNodeDiscarded(curChild);
                        if (curChild.firstChild) {
                            walkDiscardedChildNodes(curChild, skipKeyedNodes);
                        }
                    }

                    curChild = curChild.nextSibling;
                }
            }
        }

        /**
         * Removes a DOM node out of the original DOM
         *
         * @param  {Node} node The node to remove
         * @param  {Node} parentNode The nodes parent
         * @param  {Boolean} skipKeyedNodes If true then elements with keys will be skipped and not discarded.
         * @return {undefined}
         */
        function removeNode(node, parentNode, skipKeyedNodes) {
            if (onBeforeNodeDiscarded(node) === false) {
                return;
            }

            if (parentNode) {
                parentNode.removeChild(node);
            }

            onNodeDiscarded(node);
            walkDiscardedChildNodes(node, skipKeyedNodes);
        }

        // // TreeWalker implementation is no faster, but keeping this around in case this changes in the future
        // function indexTree(root) {
        //     var treeWalker = document.createTreeWalker(
        //         root,
        //         NodeFilter.SHOW_ELEMENT);
        //
        //     var el;
        //     while((el = treeWalker.nextNode())) {
        //         var key = getNodeKey(el);
        //         if (key) {
        //             fromNodesLookup[key] = el;
        //         }
        //     }
        // }

        // // NodeIterator implementation is no faster, but keeping this around in case this changes in the future
        //
        // function indexTree(node) {
        //     var nodeIterator = document.createNodeIterator(node, NodeFilter.SHOW_ELEMENT);
        //     var el;
        //     while((el = nodeIterator.nextNode())) {
        //         var key = getNodeKey(el);
        //         if (key) {
        //             fromNodesLookup[key] = el;
        //         }
        //     }
        // }

        function indexTree(node) {
            if (node.nodeType === ELEMENT_NODE || node.nodeType === DOCUMENT_FRAGMENT_NODE$1) {
                var curChild = node.firstChild;
                while (curChild) {
                    var key = getNodeKey(curChild);
                    if (key) {
                        fromNodesLookup[key] = curChild;
                    }

                    // Walk recursively
                    indexTree(curChild);

                    curChild = curChild.nextSibling;
                }
            }
        }

        indexTree(fromNode);

        function handleNodeAdded(el) {
            onNodeAdded(el);

            var curChild = el.firstChild;
            while (curChild) {
                var nextSibling = curChild.nextSibling;

                var key = getNodeKey(curChild);
                if (key) {
                    var unmatchedFromEl = fromNodesLookup[key];
                    // if we find a duplicate #id node in cache, replace `el` with cache value
                    // and morph it to the child node.
                    if (unmatchedFromEl && compareNodeNames(curChild, unmatchedFromEl)) {
                        curChild.parentNode.replaceChild(unmatchedFromEl, curChild);
                        morphEl(unmatchedFromEl, curChild);
                    } else {
                      handleNodeAdded(curChild);
                    }
                } else {
                  // recursively call for curChild and it's children to see if we find something in
                  // fromNodesLookup
                  handleNodeAdded(curChild);
                }

                curChild = nextSibling;
            }
        }

        function cleanupFromEl(fromEl, curFromNodeChild, curFromNodeKey) {
            // We have processed all of the "to nodes". If curFromNodeChild is
            // non-null then we still have some from nodes left over that need
            // to be removed
            while (curFromNodeChild) {
                var fromNextSibling = curFromNodeChild.nextSibling;
                if ((curFromNodeKey = getNodeKey(curFromNodeChild))) {
                    // Since the node is keyed it might be matched up later so we defer
                    // the actual removal to later
                    addKeyedRemoval(curFromNodeKey);
                } else {
                    // NOTE: we skip nested keyed nodes from being removed since there is
                    //       still a chance they will be matched up later
                    removeNode(curFromNodeChild, fromEl, true /* skip keyed nodes */);
                }
                curFromNodeChild = fromNextSibling;
            }
        }

        function morphEl(fromEl, toEl, childrenOnly) {
            var toElKey = getNodeKey(toEl);

            if (toElKey) {
                // If an element with an ID is being morphed then it will be in the final
                // DOM so clear it out of the saved elements collection
                delete fromNodesLookup[toElKey];
            }

            if (!childrenOnly) {
                // optional
                if (onBeforeElUpdated(fromEl, toEl) === false) {
                    return;
                }

                // update attributes on original DOM element first
                morphAttrs(fromEl, toEl);
                // optional
                onElUpdated(fromEl);

                if (onBeforeElChildrenUpdated(fromEl, toEl) === false) {
                    return;
                }
            }

            if (fromEl.nodeName !== 'TEXTAREA') {
              morphChildren(fromEl, toEl);
            } else {
              specialElHandlers.TEXTAREA(fromEl, toEl);
            }
        }

        function morphChildren(fromEl, toEl) {
            var curToNodeChild = toEl.firstChild;
            var curFromNodeChild = fromEl.firstChild;
            var curToNodeKey;
            var curFromNodeKey;

            var fromNextSibling;
            var toNextSibling;
            var matchingFromEl;

            // walk the children
            outer: while (curToNodeChild) {
                toNextSibling = curToNodeChild.nextSibling;
                curToNodeKey = getNodeKey(curToNodeChild);

                // walk the fromNode children all the way through
                while (curFromNodeChild) {
                    fromNextSibling = curFromNodeChild.nextSibling;

                    if (curToNodeChild.isSameNode && curToNodeChild.isSameNode(curFromNodeChild)) {
                        curToNodeChild = toNextSibling;
                        curFromNodeChild = fromNextSibling;
                        continue outer;
                    }

                    curFromNodeKey = getNodeKey(curFromNodeChild);

                    var curFromNodeType = curFromNodeChild.nodeType;

                    // this means if the curFromNodeChild doesnt have a match with the curToNodeChild
                    var isCompatible = undefined;

                    if (curFromNodeType === curToNodeChild.nodeType) {
                        if (curFromNodeType === ELEMENT_NODE) {
                            // Both nodes being compared are Element nodes

                            if (curToNodeKey) {
                                // The target node has a key so we want to match it up with the correct element
                                // in the original DOM tree
                                if (curToNodeKey !== curFromNodeKey) {
                                    // The current element in the original DOM tree does not have a matching key so
                                    // let's check our lookup to see if there is a matching element in the original
                                    // DOM tree
                                    if ((matchingFromEl = fromNodesLookup[curToNodeKey])) {
                                        if (fromNextSibling === matchingFromEl) {
                                            // Special case for single element removals. To avoid removing the original
                                            // DOM node out of the tree (since that can break CSS transitions, etc.),
                                            // we will instead discard the current node and wait until the next
                                            // iteration to properly match up the keyed target element with its matching
                                            // element in the original tree
                                            isCompatible = false;
                                        } else {
                                            // We found a matching keyed element somewhere in the original DOM tree.
                                            // Let's move the original DOM node into the current position and morph
                                            // it.

                                            // NOTE: We use insertBefore instead of replaceChild because we want to go through
                                            // the `removeNode()` function for the node that is being discarded so that
                                            // all lifecycle hooks are correctly invoked
                                            fromEl.insertBefore(matchingFromEl, curFromNodeChild);

                                            // fromNextSibling = curFromNodeChild.nextSibling;

                                            if (curFromNodeKey) {
                                                // Since the node is keyed it might be matched up later so we defer
                                                // the actual removal to later
                                                addKeyedRemoval(curFromNodeKey);
                                            } else {
                                                // NOTE: we skip nested keyed nodes from being removed since there is
                                                //       still a chance they will be matched up later
                                                removeNode(curFromNodeChild, fromEl, true /* skip keyed nodes */);
                                            }

                                            curFromNodeChild = matchingFromEl;
                                        }
                                    } else {
                                        // The nodes are not compatible since the "to" node has a key and there
                                        // is no matching keyed node in the source tree
                                        isCompatible = false;
                                    }
                                }
                            } else if (curFromNodeKey) {
                                // The original has a key
                                isCompatible = false;
                            }

                            isCompatible = isCompatible !== false && compareNodeNames(curFromNodeChild, curToNodeChild);
                            if (isCompatible) {
                                // We found compatible DOM elements so transform
                                // the current "from" node to match the current
                                // target DOM node.
                                // MORPH
                                morphEl(curFromNodeChild, curToNodeChild);
                            }

                        } else if (curFromNodeType === TEXT_NODE || curFromNodeType == COMMENT_NODE) {
                            // Both nodes being compared are Text or Comment nodes
                            isCompatible = true;
                            // Simply update nodeValue on the original node to
                            // change the text value
                            if (curFromNodeChild.nodeValue !== curToNodeChild.nodeValue) {
                                curFromNodeChild.nodeValue = curToNodeChild.nodeValue;
                            }

                        }
                    }

                    if (isCompatible) {
                        // Advance both the "to" child and the "from" child since we found a match
                        // Nothing else to do as we already recursively called morphChildren above
                        curToNodeChild = toNextSibling;
                        curFromNodeChild = fromNextSibling;
                        continue outer;
                    }

                    // No compatible match so remove the old node from the DOM and continue trying to find a
                    // match in the original DOM. However, we only do this if the from node is not keyed
                    // since it is possible that a keyed node might match up with a node somewhere else in the
                    // target tree and we don't want to discard it just yet since it still might find a
                    // home in the final DOM tree. After everything is done we will remove any keyed nodes
                    // that didn't find a home
                    if (curFromNodeKey) {
                        // Since the node is keyed it might be matched up later so we defer
                        // the actual removal to later
                        addKeyedRemoval(curFromNodeKey);
                    } else {
                        // NOTE: we skip nested keyed nodes from being removed since there is
                        //       still a chance they will be matched up later
                        removeNode(curFromNodeChild, fromEl, true /* skip keyed nodes */);
                    }

                    curFromNodeChild = fromNextSibling;
                } // END: while(curFromNodeChild) {}

                // If we got this far then we did not find a candidate match for
                // our "to node" and we exhausted all of the children "from"
                // nodes. Therefore, we will just append the current "to" node
                // to the end
                if (curToNodeKey && (matchingFromEl = fromNodesLookup[curToNodeKey]) && compareNodeNames(matchingFromEl, curToNodeChild)) {
                    fromEl.appendChild(matchingFromEl);
                    // MORPH
                    morphEl(matchingFromEl, curToNodeChild);
                } else {
                    var onBeforeNodeAddedResult = onBeforeNodeAdded(curToNodeChild);
                    if (onBeforeNodeAddedResult !== false) {
                        if (onBeforeNodeAddedResult) {
                            curToNodeChild = onBeforeNodeAddedResult;
                        }

                        if (curToNodeChild.actualize) {
                            curToNodeChild = curToNodeChild.actualize(fromEl.ownerDocument || doc);
                        }
                        fromEl.appendChild(curToNodeChild);
                        handleNodeAdded(curToNodeChild);
                    }
                }

                curToNodeChild = toNextSibling;
                curFromNodeChild = fromNextSibling;
            }

            cleanupFromEl(fromEl, curFromNodeChild, curFromNodeKey);

            var specialElHandler = specialElHandlers[fromEl.nodeName];
            if (specialElHandler) {
                specialElHandler(fromEl, toEl);
            }
        } // END: morphChildren(...)

        var morphedNode = fromNode;
        var morphedNodeType = morphedNode.nodeType;
        var toNodeType = toNode.nodeType;

        if (!childrenOnly) {
            // Handle the case where we are given two DOM nodes that are not
            // compatible (e.g. <div> --> <span> or <div> --> TEXT)
            if (morphedNodeType === ELEMENT_NODE) {
                if (toNodeType === ELEMENT_NODE) {
                    if (!compareNodeNames(fromNode, toNode)) {
                        onNodeDiscarded(fromNode);
                        morphedNode = moveChildren(fromNode, createElementNS(toNode.nodeName, toNode.namespaceURI));
                    }
                } else {
                    // Going from an element node to a text node
                    morphedNode = toNode;
                }
            } else if (morphedNodeType === TEXT_NODE || morphedNodeType === COMMENT_NODE) { // Text or comment node
                if (toNodeType === morphedNodeType) {
                    if (morphedNode.nodeValue !== toNode.nodeValue) {
                        morphedNode.nodeValue = toNode.nodeValue;
                    }

                    return morphedNode;
                } else {
                    // Text node to something else
                    morphedNode = toNode;
                }
            }
        }

        if (morphedNode === toNode) {
            // The "to node" was not compatible with the "from node" so we had to
            // toss out the "from node" and use the "to node"
            onNodeDiscarded(fromNode);
        } else {
            if (toNode.isSameNode && toNode.isSameNode(morphedNode)) {
                return;
            }

            morphEl(morphedNode, toNode, childrenOnly);

            // We now need to loop over any keyed nodes that might need to be
            // removed. We only do the removal if we know that the keyed node
            // never found a match. When a keyed node is matched up we remove
            // it out of fromNodesLookup and we use fromNodesLookup to determine
            // if a keyed node has been matched up or not
            if (keyedRemovalList) {
                for (var i=0, len=keyedRemovalList.length; i<len; i++) {
                    var elToRemove = fromNodesLookup[keyedRemovalList[i]];
                    if (elToRemove) {
                        removeNode(elToRemove, elToRemove.parentNode, false);
                    }
                }
            }
        }

        if (!childrenOnly && morphedNode !== fromNode && fromNode.parentNode) {
            if (morphedNode.actualize) {
                morphedNode = morphedNode.actualize(fromNode.ownerDocument || doc);
            }
            // If we had to swap out the from node with a new node because the old
            // node was not compatible with the target node then we need to
            // replace the old DOM node in the original DOM tree. This is only
            // possible if the original DOM node was part of a DOM tree which
            // we know is the case if it has a parent node.
            fromNode.parentNode.replaceChild(morphedNode, fromNode);
        }

        return morphedNode;
    };
}

var morphdom = morphdomFactory(morphAttrs);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (morphdom);


/***/ }),

/***/ "./node_modules/template7/dist/template7.esm.js":
/*!******************************************************!*\
  !*** ./node_modules/template7/dist/template7.esm.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Template7 1.4.2
 * Mobile-first HTML template engine
 * 
 * http://www.idangero.us/template7/
 * 
 * Copyright 2019, Vladimir Kharlampidi
 * The iDangero.us
 * http://www.idangero.us/
 * 
 * Licensed under MIT
 * 
 * Released on: June 14, 2019
 */

let t7ctx;
if (typeof window !== 'undefined') {
  t7ctx = window;
} else if (typeof __webpack_require__.g !== 'undefined') {
  t7ctx = __webpack_require__.g;
} else {
  t7ctx = undefined;
}

const Template7Context = t7ctx;

const Template7Utils = {
  quoteSingleRexExp: new RegExp('\'', 'g'),
  quoteDoubleRexExp: new RegExp('"', 'g'),
  isFunction(func) {
    return typeof func === 'function';
  },
  escape(string = '') {
    return string
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },
  helperToSlices(string) {
    const { quoteDoubleRexExp, quoteSingleRexExp } = Template7Utils;
    const helperParts = string.replace(/[{}#}]/g, '').trim().split(' ');
    const slices = [];
    let shiftIndex;
    let i;
    let j;
    for (i = 0; i < helperParts.length; i += 1) {
      let part = helperParts[i];
      let blockQuoteRegExp;
      let openingQuote;
      if (i === 0) slices.push(part);
      else if (part.indexOf('"') === 0 || part.indexOf('\'') === 0) {
        blockQuoteRegExp = part.indexOf('"') === 0 ? quoteDoubleRexExp : quoteSingleRexExp;
        openingQuote = part.indexOf('"') === 0 ? '"' : '\'';
        // Plain String
        if (part.match(blockQuoteRegExp).length === 2) {
          // One word string
          slices.push(part);
        } else {
          // Find closed Index
          shiftIndex = 0;
          for (j = i + 1; j < helperParts.length; j += 1) {
            part += ` ${helperParts[j]}`;
            if (helperParts[j].indexOf(openingQuote) >= 0) {
              shiftIndex = j;
              slices.push(part);
              break;
            }
          }
          if (shiftIndex) i = shiftIndex;
        }
      } else if (part.indexOf('=') > 0) {
        // Hash
        const hashParts = part.split('=');
        const hashName = hashParts[0];
        let hashContent = hashParts[1];
        if (!blockQuoteRegExp) {
          blockQuoteRegExp = hashContent.indexOf('"') === 0 ? quoteDoubleRexExp : quoteSingleRexExp;
          openingQuote = hashContent.indexOf('"') === 0 ? '"' : '\'';
        }
        if (hashContent.match(blockQuoteRegExp).length !== 2) {
          shiftIndex = 0;
          for (j = i + 1; j < helperParts.length; j += 1) {
            hashContent += ` ${helperParts[j]}`;
            if (helperParts[j].indexOf(openingQuote) >= 0) {
              shiftIndex = j;
              break;
            }
          }
          if (shiftIndex) i = shiftIndex;
        }
        const hash = [hashName, hashContent.replace(blockQuoteRegExp, '')];
        slices.push(hash);
      } else {
        // Plain variable
        slices.push(part);
      }
    }
    return slices;
  },
  stringToBlocks(string) {
    const blocks = [];
    let i;
    let j;
    if (!string) return [];
    const stringBlocks = string.split(/({{[^{^}]*}})/);
    for (i = 0; i < stringBlocks.length; i += 1) {
      let block = stringBlocks[i];
      if (block === '') continue;
      if (block.indexOf('{{') < 0) {
        blocks.push({
          type: 'plain',
          content: block,
        });
      } else {
        if (block.indexOf('{/') >= 0) {
          continue;
        }
        block = block
          .replace(/{{([#/])*([ ])*/, '{{$1')
          .replace(/([ ])*}}/, '}}');
        if (block.indexOf('{#') < 0 && block.indexOf(' ') < 0 && block.indexOf('else') < 0) {
          // Simple variable
          blocks.push({
            type: 'variable',
            contextName: block.replace(/[{}]/g, ''),
          });
          continue;
        }
        // Helpers
        const helperSlices = Template7Utils.helperToSlices(block);
        let helperName = helperSlices[0];
        const isPartial = helperName === '>';
        const helperContext = [];
        const helperHash = {};
        for (j = 1; j < helperSlices.length; j += 1) {
          const slice = helperSlices[j];
          if (Array.isArray(slice)) {
            // Hash
            helperHash[slice[0]] = slice[1] === 'false' ? false : slice[1];
          } else {
            helperContext.push(slice);
          }
        }

        if (block.indexOf('{#') >= 0) {
          // Condition/Helper
          let helperContent = '';
          let elseContent = '';
          let toSkip = 0;
          let shiftIndex;
          let foundClosed = false;
          let foundElse = false;
          let depth = 0;
          for (j = i + 1; j < stringBlocks.length; j += 1) {
            if (stringBlocks[j].indexOf('{{#') >= 0) {
              depth += 1;
            }
            if (stringBlocks[j].indexOf('{{/') >= 0) {
              depth -= 1;
            }
            if (stringBlocks[j].indexOf(`{{#${helperName}`) >= 0) {
              helperContent += stringBlocks[j];
              if (foundElse) elseContent += stringBlocks[j];
              toSkip += 1;
            } else if (stringBlocks[j].indexOf(`{{/${helperName}`) >= 0) {
              if (toSkip > 0) {
                toSkip -= 1;
                helperContent += stringBlocks[j];
                if (foundElse) elseContent += stringBlocks[j];
              } else {
                shiftIndex = j;
                foundClosed = true;
                break;
              }
            } else if (stringBlocks[j].indexOf('else') >= 0 && depth === 0) {
              foundElse = true;
            } else {
              if (!foundElse) helperContent += stringBlocks[j];
              if (foundElse) elseContent += stringBlocks[j];
            }
          }
          if (foundClosed) {
            if (shiftIndex) i = shiftIndex;
            if (helperName === 'raw') {
              blocks.push({
                type: 'plain',
                content: helperContent,
              });
            } else {
              blocks.push({
                type: 'helper',
                helperName,
                contextName: helperContext,
                content: helperContent,
                inverseContent: elseContent,
                hash: helperHash,
              });
            }
          }
        } else if (block.indexOf(' ') > 0) {
          if (isPartial) {
            helperName = '_partial';
            if (helperContext[0]) {
              if (helperContext[0].indexOf('[') === 0) helperContext[0] = helperContext[0].replace(/[[\]]/g, '');
              else helperContext[0] = `"${helperContext[0].replace(/"|'/g, '')}"`;
            }
          }
          blocks.push({
            type: 'helper',
            helperName,
            contextName: helperContext,
            hash: helperHash,
          });
        }
      }
    }
    return blocks;
  },
  parseJsVariable(expression, replace, object) {
    return expression.split(/([+ \-*/^()&=|<>!%:?])/g).reduce((arr, part) => {
      if (!part) {
        return arr;
      }
      if (part.indexOf(replace) < 0) {
        arr.push(part);
        return arr;
      }
      if (!object) {
        arr.push(JSON.stringify(''));
        return arr;
      }

      let variable = object;
      if (part.indexOf(`${replace}.`) >= 0) {
        part.split(`${replace}.`)[1].split('.').forEach((partName) => {
          if (partName in variable) variable = variable[partName];
          else variable = undefined;
        });
      }
      if (
        (typeof variable === 'string')
        || Array.isArray(variable)
        || (variable.constructor && variable.constructor === Object)
      ) {
        variable = JSON.stringify(variable);
      }
      if (variable === undefined) variable = 'undefined';

      arr.push(variable);
      return arr;
    }, []).join('');

  },
  parseJsParents(expression, parents) {
    return expression.split(/([+ \-*^()&=|<>!%:?])/g).reduce((arr, part) => {
      if (!part) {
        return arr;
      }

      if (part.indexOf('../') < 0) {
        arr.push(part);
        return arr;
      }

      if (!parents || parents.length === 0) {
        arr.push(JSON.stringify(''));
        return arr;
      }

      const levelsUp = part.split('../').length - 1;
      const parentData = levelsUp > parents.length ? parents[parents.length - 1] : parents[levelsUp - 1];

      let variable = parentData;
      const parentPart = part.replace(/..\//g, '');
      parentPart.split('.').forEach((partName) => {
        if (typeof variable[partName] !== 'undefined') variable = variable[partName];
        else variable = 'undefined';
      });
      if (variable === false || variable === true) {
        arr.push(JSON.stringify(variable));
        return arr;
      }
      if (variable === null || variable === 'undefined') {
        arr.push(JSON.stringify(''));
        return arr;
      }
      arr.push(JSON.stringify(variable));
      return arr;
    }, []).join('');
  },
  getCompileVar(name, ctx, data = 'data_1') {
    let variable = ctx;
    let parts;
    let levelsUp = 0;
    let newDepth;
    if (name.indexOf('../') === 0) {
      levelsUp = name.split('../').length - 1;
      newDepth = variable.split('_')[1] - levelsUp;
      variable = `ctx_${newDepth >= 1 ? newDepth : 1}`;
      parts = name.split('../')[levelsUp].split('.');
    } else if (name.indexOf('@global') === 0) {
      variable = 'Template7.global';
      parts = name.split('@global.')[1].split('.');
    } else if (name.indexOf('@root') === 0) {
      variable = 'root';
      parts = name.split('@root.')[1].split('.');
    } else {
      parts = name.split('.');
    }
    for (let i = 0; i < parts.length; i += 1) {
      const part = parts[i];
      if (part.indexOf('@') === 0) {
        let dataLevel = data.split('_')[1];
        if (levelsUp > 0) {
          dataLevel = newDepth;
        }
        if (i > 0) {
          variable += `[(data_${dataLevel} && data_${dataLevel}.${part.replace('@', '')})]`;
        } else {
          variable = `(data_${dataLevel} && data_${dataLevel}.${part.replace('@', '')})`;
        }
      } else if (Number.isFinite ? Number.isFinite(part) : Template7Context.isFinite(part)) {
        variable += `[${part}]`;
      } else if (part === 'this' || part.indexOf('this.') >= 0 || part.indexOf('this[') >= 0 || part.indexOf('this(') >= 0) {
        variable = part.replace('this', ctx);
      } else {
        variable += `.${part}`;
      }
    }
    return variable;
  },
  getCompiledArguments(contextArray, ctx, data) {
    const arr = [];
    for (let i = 0; i < contextArray.length; i += 1) {
      if (/^['"]/.test(contextArray[i])) arr.push(contextArray[i]);
      else if (/^(true|false|\d+)$/.test(contextArray[i])) arr.push(contextArray[i]);
      else {
        arr.push(Template7Utils.getCompileVar(contextArray[i], ctx, data));
      }
    }

    return arr.join(', ');
  },
};

/* eslint no-eval: "off" */

const Template7Helpers = {
  _partial(partialName, options) {
    const ctx = this;
    const p = Template7Class.partials[partialName];
    if (!p || (p && !p.template)) return '';
    if (!p.compiled) {
      p.compiled = new Template7Class(p.template).compile();
    }
    Object.keys(options.hash).forEach((hashName) => {
      ctx[hashName] = options.hash[hashName];
    });
    return p.compiled(ctx, options.data, options.root);
  },
  escape(context) {
    if (typeof context === 'undefined' || context === null) return '';
    if (typeof context !== 'string') {
      throw new Error('Template7: Passed context to "escape" helper should be a string');
    }
    return Template7Utils.escape(context);
  },
  if(context, options) {
    let ctx = context;
    if (Template7Utils.isFunction(ctx)) { ctx = ctx.call(this); }
    if (ctx) {
      return options.fn(this, options.data);
    }

    return options.inverse(this, options.data);
  },
  unless(context, options) {
    let ctx = context;
    if (Template7Utils.isFunction(ctx)) { ctx = ctx.call(this); }
    if (!ctx) {
      return options.fn(this, options.data);
    }

    return options.inverse(this, options.data);
  },
  each(context, options) {
    let ctx = context;
    let ret = '';
    let i = 0;
    if (Template7Utils.isFunction(ctx)) { ctx = ctx.call(this); }
    if (Array.isArray(ctx)) {
      if (options.hash.reverse) {
        ctx = ctx.reverse();
      }
      for (i = 0; i < ctx.length; i += 1) {
        ret += options.fn(ctx[i], { first: i === 0, last: i === ctx.length - 1, index: i });
      }
      if (options.hash.reverse) {
        ctx = ctx.reverse();
      }
    } else {
      // eslint-disable-next-line
      for (const key in ctx) {
        i += 1;
        ret += options.fn(ctx[key], { key });
      }
    }
    if (i > 0) return ret;
    return options.inverse(this);
  },
  with(context, options) {
    let ctx = context;
    if (Template7Utils.isFunction(ctx)) { ctx = context.call(this); }
    return options.fn(ctx);
  },
  join(context, options) {
    let ctx = context;
    if (Template7Utils.isFunction(ctx)) { ctx = ctx.call(this); }
    return ctx.join(options.hash.delimiter || options.hash.delimeter);
  },
  js(expression, options) {
    const data = options.data;
    let func;
    let execute = expression;
    ('index first last key').split(' ').forEach((prop) => {
      if (typeof data[prop] !== 'undefined') {
        const re1 = new RegExp(`this.@${prop}`, 'g');
        const re2 = new RegExp(`@${prop}`, 'g');
        execute = execute
          .replace(re1, JSON.stringify(data[prop]))
          .replace(re2, JSON.stringify(data[prop]));
      }
    });
    if (options.root && execute.indexOf('@root') >= 0) {
      execute = Template7Utils.parseJsVariable(execute, '@root', options.root);
    }
    if (execute.indexOf('@global') >= 0) {
      execute = Template7Utils.parseJsVariable(execute, '@global', Template7Context.Template7.global);
    }
    if (execute.indexOf('../') >= 0) {
      execute = Template7Utils.parseJsParents(execute, options.parents);
    }
    if (execute.indexOf('return') >= 0) {
      func = `(function(){${execute}})`;
    } else {
      func = `(function(){return (${execute})})`;
    }
    return eval(func).call(this);
  },
  js_if(expression, options) {
    const data = options.data;
    let func;
    let execute = expression;
    ('index first last key').split(' ').forEach((prop) => {
      if (typeof data[prop] !== 'undefined') {
        const re1 = new RegExp(`this.@${prop}`, 'g');
        const re2 = new RegExp(`@${prop}`, 'g');
        execute = execute
          .replace(re1, JSON.stringify(data[prop]))
          .replace(re2, JSON.stringify(data[prop]));
      }
    });
    if (options.root && execute.indexOf('@root') >= 0) {
      execute = Template7Utils.parseJsVariable(execute, '@root', options.root);
    }
    if (execute.indexOf('@global') >= 0) {
      execute = Template7Utils.parseJsVariable(execute, '@global', Template7Context.Template7.global);
    }
    if (execute.indexOf('../') >= 0) {
      execute = Template7Utils.parseJsParents(execute, options.parents);
    }
    if (execute.indexOf('return') >= 0) {
      func = `(function(){${execute}})`;
    } else {
      func = `(function(){return (${execute})})`;
    }
    const condition = eval(func).call(this);
    if (condition) {
      return options.fn(this, options.data);
    }

    return options.inverse(this, options.data);
  },
};
Template7Helpers.js_compare = Template7Helpers.js_if;

const Template7Options = {};
const Template7Partials = {};

class Template7Class {
  constructor(template) {
    const t = this;
    t.template = template;
  }
  compile(template = this.template, depth = 1) {
    const t = this;
    if (t.compiled) return t.compiled;

    if (typeof template !== 'string') {
      throw new Error('Template7: Template must be a string');
    }
    const { stringToBlocks, getCompileVar, getCompiledArguments } = Template7Utils;

    const blocks = stringToBlocks(template);
    const ctx = `ctx_${depth}`;
    const data = `data_${depth}`;
    if (blocks.length === 0) {
      return function empty() { return ''; };
    }

    function getCompileFn(block, newDepth) {
      if (block.content) return t.compile(block.content, newDepth);
      return function empty() { return ''; };
    }
    function getCompileInverse(block, newDepth) {
      if (block.inverseContent) return t.compile(block.inverseContent, newDepth);
      return function empty() { return ''; };
    }

    let resultString = '';
    if (depth === 1) {
      resultString += `(function (${ctx}, ${data}, root) {\n`;
    } else {
      resultString += `(function (${ctx}, ${data}) {\n`;
    }
    if (depth === 1) {
      resultString += 'function isArray(arr){return Array.isArray(arr);}\n';
      resultString += 'function isFunction(func){return (typeof func === \'function\');}\n';
      resultString += 'function c(val, ctx) {if (typeof val !== "undefined" && val !== null) {if (isFunction(val)) {return val.call(ctx);} else return val;} else return "";}\n';
      resultString += 'root = root || ctx_1 || {};\n';
    }
    resultString += 'var r = \'\';\n';
    let i;
    for (i = 0; i < blocks.length; i += 1) {
      const block = blocks[i];
      // Plain block
      if (block.type === 'plain') {
        // eslint-disable-next-line
        resultString += `r +='${(block.content).replace(/\r/g, '\\r').replace(/\n/g, '\\n').replace(/'/g, '\\' + '\'')}';`;
        continue;
      }
      let variable;
      let compiledArguments;
      // Variable block
      if (block.type === 'variable') {
        variable = getCompileVar(block.contextName, ctx, data);
        resultString += `r += c(${variable}, ${ctx});`;
      }
      // Helpers block
      if (block.type === 'helper') {
        let parents;
        if (ctx !== 'ctx_1') {
          const level = ctx.split('_')[1];
          let parentsString = `ctx_${level - 1}`;
          for (let j = level - 2; j >= 1; j -= 1) {
            parentsString += `, ctx_${j}`;
          }
          parents = `[${parentsString}]`;
        } else {
          parents = `[${ctx}]`;
        }
        let dynamicHelper;
        if (block.helperName.indexOf('[') === 0) {
          block.helperName = getCompileVar(block.helperName.replace(/[[\]]/g, ''), ctx, data);
          dynamicHelper = true;
        }
        if (dynamicHelper || block.helperName in Template7Helpers) {
          compiledArguments = getCompiledArguments(block.contextName, ctx, data);
          resultString += `r += (Template7Helpers${dynamicHelper ? `[${block.helperName}]` : `.${block.helperName}`}).call(${ctx}, ${compiledArguments && (`${compiledArguments}, `)}{hash:${JSON.stringify(block.hash)}, data: ${data} || {}, fn: ${getCompileFn(block, depth + 1)}, inverse: ${getCompileInverse(block, depth + 1)}, root: root, parents: ${parents}});`;
        } else if (block.contextName.length > 0) {
          throw new Error(`Template7: Missing helper: "${block.helperName}"`);
        } else {
          variable = getCompileVar(block.helperName, ctx, data);
          resultString += `if (${variable}) {`;
          resultString += `if (isArray(${variable})) {`;
          resultString += `r += (Template7Helpers.each).call(${ctx}, ${variable}, {hash:${JSON.stringify(block.hash)}, data: ${data} || {}, fn: ${getCompileFn(block, depth + 1)}, inverse: ${getCompileInverse(block, depth + 1)}, root: root, parents: ${parents}});`;
          resultString += '}else {';
          resultString += `r += (Template7Helpers.with).call(${ctx}, ${variable}, {hash:${JSON.stringify(block.hash)}, data: ${data} || {}, fn: ${getCompileFn(block, depth + 1)}, inverse: ${getCompileInverse(block, depth + 1)}, root: root, parents: ${parents}});`;
          resultString += '}}';
        }
      }
    }
    resultString += '\nreturn r;})';

    if (depth === 1) {
      // eslint-disable-next-line
      t.compiled = eval(resultString);
      return t.compiled;
    }
    return resultString;
  }
  static get options() {
    return Template7Options;
  }
  static get partials() {
    return Template7Partials;
  }
  static get helpers() {
    return Template7Helpers;
  }
}

function Template7(...args) {
  const [template, data] = args;
  if (args.length === 2) {
    let instance = new Template7Class(template);
    const rendered = instance.compile()(data);
    instance = null;
    return (rendered);
  }
  return new Template7Class(template);
}
Template7.registerHelper = function registerHelper(name, fn) {
  Template7Class.helpers[name] = fn;
};
Template7.unregisterHelper = function unregisterHelper(name) {
  Template7Class.helpers[name] = undefined;
  delete Template7Class.helpers[name];
};
Template7.registerPartial = function registerPartial(name, template) {
  Template7Class.partials[name] = { template };
};
Template7.unregisterPartial = function unregisterPartial(name) {
  if (Template7Class.partials[name]) {
    Template7Class.partials[name] = undefined;
    delete Template7Class.partials[name];
  }
};
Template7.compile = function compile(template, options) {
  const instance = new Template7Class(template, options);
  return instance.compile();
};

Template7.options = Template7Class.options;
Template7.helpers = Template7Class.helpers;
Template7.partials = Template7Class.partials;

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Template7);


/***/ }),

/***/ "./src/component.ts":
/*!**************************!*\
  !*** ./src/component.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Component)
/* harmony export */ });
/* harmony import */ var morphdom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! morphdom */ "./node_modules/morphdom/dist/morphdom-esm.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./src/utils/index.js");
/* harmony import */ var _utils_events__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/events */ "./src/utils/events.js");
/* harmony import */ var _utils_pubsub__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils/pubsub */ "./src/utils/pubsub.js");




function Component(elm, { module, dependencies, templates, components }) {
    const options = getOptions(module);
    (0,_utils__WEBPACK_IMPORTED_MODULE_1__.buildtemplates)(elm, components, templates);
    const tplid = elm.getAttribute('tplid');
    const template = templates[tplid];
    const state = { data: module.model ? (0,_utils__WEBPACK_IMPORTED_MODULE_1__.dup)(module.model) : {} };
    let batchUpdates = [];
    const base = {
        template,
        elm,
        dependencies,
        publish: _utils_pubsub__WEBPACK_IMPORTED_MODULE_3__.publish,
        subscribe: _utils_pubsub__WEBPACK_IMPORTED_MODULE_3__.subscribe,
        unsubscribe: _utils_pubsub__WEBPACK_IMPORTED_MODULE_3__.unsubscribe,
        main(fn) {
            options.main = fn;
        },
        unmount(fn) {
            options.unmount = fn;
        },
        onupdate(fn) {
            options.onupdate = fn;
        },
        on(eventName, selectorOrCallback, callback) {
            (0,_utils_events__WEBPACK_IMPORTED_MODULE_2__.on)(elm, eventName, selectorOrCallback, callback);
        },
        off(eventName, callback) {
            (0,_utils_events__WEBPACK_IMPORTED_MODULE_2__.off)(elm, eventName, callback);
        },
        trigger(eventName, target, args) {
            if (target.constructor === String)
                (0,_utils_events__WEBPACK_IMPORTED_MODULE_2__.trigger)(elm.querySelector(target), eventName, { args: args });
            else
                (0,_utils_events__WEBPACK_IMPORTED_MODULE_2__.trigger)(elm, eventName, { args: target });
        },
        emit: (...args) => {
            (0,_utils_events__WEBPACK_IMPORTED_MODULE_2__.trigger)(elm, args.shift(), { args: args });
        },
        state: {
            set(data) {
                if (data.constructor === Function) {
                    const newstate = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.dup)(state.data);
                    data(newstate);
                    base.render(newstate);
                }
                else {
                    base.render(data);
                }
                return new Promise((resolve) => (0,_utils__WEBPACK_IMPORTED_MODULE_1__.rAF)(_ => (0,_utils__WEBPACK_IMPORTED_MODULE_1__.rAF)(resolve)));
            },
            get() {
                return (0,_utils__WEBPACK_IMPORTED_MODULE_1__.dup)(state.data);
            }
        },
        render(data = state.data) {
            if (!document.body.contains(elm))
                return;
            batchUpdates.push(options.view(data));
            (0,_utils__WEBPACK_IMPORTED_MODULE_1__.rAF)(() => {
                if (batchUpdates.length) {
                    const batchData = {};
                    batchUpdates.forEach(d => Object.assign(batchData, d));
                    batchUpdates = [];
                    state.data = Object.assign(state.data, batchData);
                    const newdata = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.dup)(state.data);
                    const newhtml = base.template(newdata);
                    (0,morphdom__WEBPACK_IMPORTED_MODULE_0__["default"])(elm, newhtml, morphdomOptions(elm, options));
                    Array
                        .from(elm.querySelectorAll('[tplid]'))
                        .map(el => {
                        (0,_utils__WEBPACK_IMPORTED_MODULE_1__.rAF)(_ => {
                            el.options.onupdate(newdata);
                            el.base.render(newdata);
                        });
                    });
                }
            });
        }
    };
    return { base, options };
}
const getOptions = (module) => ({
    main: _ => _,
    unmount: _ => _,
    onupdate: _ => _,
    view: module.view ? module.view : _ => _
});
const morphdomOptions = (_parent, options) => ({
    onNodeAdded: onUpdates(_parent, options),
    onElUpdated: onUpdates(_parent, options),
    onBeforeElChildrenUpdated: checkStatic,
    onBeforeElUpdated: checkStatic,
    getNodeKey(node) {
        if (node.nodeType === 1 && node.getAttribute('tplid'))
            return node.dataset.key || node.getAttribute('tplid');
        return false;
    }
});
const checkStatic = (node) => {
    if ('static' in node.dataset) {
        return false;
    }
};
const onUpdates = (_parent, options) => (node) => {
    if (node.nodeType === 1) {
        if (node.getAttribute && node.getAttribute('scope')) {
            const scope = JSON.parse(node.getAttribute('scope').replace(/\'/g, '\"'));
            Array.from(node.querySelectorAll('[tplid]'))
                .map(el => {
                const data = Object.assign({}, _parent.base.state.get(), scope);
                options.onupdate(data);
                el.base.render(data);
            });
            node.removeAttribute('scope');
        }
    }
};


/***/ }),

/***/ "./src/element.ts":
/*!************************!*\
  !*** ./src/element.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Element)
/* harmony export */ });
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./component */ "./src/component.ts");

function Element(module, dependencies, templates, components) {
    return class extends HTMLElement {
        constructor() {
            super();
            const { base, options } = (0,_component__WEBPACK_IMPORTED_MODULE_0__["default"])(this, { module, dependencies, templates, components });
            this.base = base;
            this.options = options;
            module.default(base);
        }
        connectedCallback() {
            this.base.render();
            this.options.main().forEach(f => f(this.base));
        }
        disconnectedCallback() {
            this.options.unmount(this.base);
            delete this.options;
            delete this.base;
            delete this.__events;
        }
        attributeChangedCallback() {
            //TODO
        }
    };
}


/***/ }),

/***/ "./src/template-system.ts":
/*!********************************!*\
  !*** ./src/template-system.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ templateSystem)
/* harmony export */ });
/* harmony import */ var template7__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! template7 */ "./node_modules/template7/dist/template7.esm.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./src/utils/index.js");


function templateSystem(element) {
    const directives = [htmlRepeatAndIf];
    const vdom = element.cloneNode(true);
    (0,_utils__WEBPACK_IMPORTED_MODULE_1__.stripTemplateTag)(vdom);
    const newvdom = directives.reduce((_, directive) => directive(vdom), vdom);
    const html = newvdom.outerHTML.replace(/html-/g, '');
    const template = template7__WEBPACK_IMPORTED_MODULE_0__["default"].compile(html);
    return (data) => {
        return template(data);
    };
}
/**@Directives */
const htmlRepeatAndIf = (vdom) => {
    const nodes = Array
        .from(vdom.querySelectorAll('[html-repeat],[html-if]'))
        .reverse();
    if (nodes.length) {
        nodes.forEach(node => {
            if (node.getAttribute('html-repeat')) {
                const instruction = node.getAttribute('html-repeat');
                node.removeAttribute('html-repeat');
                node.setAttribute('scope', '{{scope this}}');
                const open = document.createTextNode(`{{#each ${instruction}}}`);
                const close = document.createTextNode('{{/each}}');
                node.parentNode.insertBefore(open, node);
                node.parentNode.insertBefore(close, node.nextSibling);
            }
            else if (node.getAttribute('html-if')) {
                const instruction = node.getAttribute('html-if');
                node.removeAttribute('html-if');
                node.setAttribute('scope', '{{scope this}}');
                const open = document.createTextNode(`{{#ifexp "${instruction}"}}`);
                const close = document.createTextNode('{{/ifexp}}');
                node.parentNode.insertBefore(open, node);
                node.parentNode.insertBefore(close, node.nextSibling);
            }
        });
    }
    return vdom;
};
/**@Global Settings */
template7__WEBPACK_IMPORTED_MODULE_0__["default"].global = {};
/**@Helpers */
template7__WEBPACK_IMPORTED_MODULE_0__["default"].registerHelper('scope', (context, options) => {
    const { data } = options;
    const { first, index, last, root } = data;
    const scope = Object.assign(Object.assign({}, context), { ['$first']: first, ['$index']: index, ['$last']: last, ['$parent']: root });
    return JSON.stringify(scope).replace(/\"/g, '\'');
});
template7__WEBPACK_IMPORTED_MODULE_0__["default"].registerHelper('ifexp', function (value, options) {
    const condition = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.decodeHtmlEntities)(value);
    const { root, data } = options;
    try {
        const expression = (new Function('root', `with(root){ return ${condition} }`)).call(root, root);
        return expression ? options.fn(this, data) : options.inverse(this, data);
    }
    catch (err) {
        return options.inverse(this, data);
    }
});


/***/ }),

/***/ "./src/utils/events.js":
/*!*****************************!*\
  !*** ./src/utils/events.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "on": () => (/* binding */ on),
/* harmony export */   "off": () => (/* binding */ off),
/* harmony export */   "trigger": () => (/* binding */ trigger)
/* harmony export */ });
const customEvent = (() => {
	return ('CustomEvent' in window && typeof window.CustomEvent === 'function')
		? (name, data) => new CustomEvent(name, data)
		: (name, data) => {
			const newEvent = document.createEvent('CustomEvent')
			newEvent.initCustomEvent(name, true, true, data)
			return newEvent
		}
})()

const handler = (node, ev) => {
	return function (e) {
		const scope = this
		const detail = e.detail || {}
		node.__events[ev].forEach(o => {
			o.handler.apply(scope, [e].concat(detail.args))
		})
	}
}

const removeListener = (node, ev) => {
	if (node.__events[ev] && node.__events[ev].listener) {
		node.removeEventListener(
			ev,
			node.__events[ev].listener,
			(ev == 'focus' || ev == 'blur' || ev == 'mouseenter' || ev == 'mouseleave'))
		delete node.__events[ev]
	}
}

const delegate = (node, selector, callback) => {
	return function (e) {

		const element = this
		const detail = e.detail || {}

		let parent = e.target

		while (parent) {
			if (parent.matches(selector)) {
				e.delegateTarget = parent
				callback.apply(element, [e].concat(detail.args))
			}
			if( parent === node ) break
			parent = parent.parentNode
		}
	}
}

const on = (node, ev, selectorOrCallback, callback) => {

	node.__events = node.__events || {}
	node.__events[ev] = (node.__events[ev] || [])

	if (!node.__events[ev].length) {
		const fn = handler(node, ev)
		node.addEventListener(
			ev,
			fn,
			(ev == 'focus' || ev == 'blur' || ev == 'mouseenter' || ev == 'mouseleave'))
		node.__events[ev].listener = fn
	}

	if (selectorOrCallback.call) {
		node.__events[ev].push({ handler: selectorOrCallback, callback: selectorOrCallback })
	} else {
		node.__events[ev].push({ handler: delegate(node, selectorOrCallback, callback), callback })
	}
}

const off = (node, ev, fn) => {

	if (fn && node.__events[ev] && node.__events[ev].length) {
		var old = node.__events[ev]
		node.__events[ev] = node.__events[ev].filter(function (o) { return o.callback != fn; })
		node.__events[ev].listener = old.listener
		if (!node.__events[ev].length)
			removeListener(node, ev)
	} else {
		removeListener(node, ev)
	}
}

const trigger = (node, name, args) => {
	node.dispatchEvent(customEvent(name, { bubbles: true, detail: args }))
}


/***/ }),

/***/ "./src/utils/index.js":
/*!****************************!*\
  !*** ./src/utils/index.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "rAF": () => (/* binding */ rAF),
/* harmony export */   "uuid": () => (/* binding */ uuid),
/* harmony export */   "stripTemplateTag": () => (/* binding */ stripTemplateTag),
/* harmony export */   "dup": () => (/* binding */ dup),
/* harmony export */   "createTemplateId": () => (/* binding */ createTemplateId),
/* harmony export */   "buildtemplates": () => (/* binding */ buildtemplates),
/* harmony export */   "decodeHtmlEntities": () => (/* binding */ decodeHtmlEntities)
/* harmony export */ });
/* harmony import */ var _template_system__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../template-system */ "./src/template-system.ts");


const textarea = document.createElement('textarea')

const rAF = (fn) => {
	(requestAnimationFrame || setTimeout)(fn, 1000 / 60)
}

const uuid = () => {
	return 'xxxxxxxx'.replace(/[xy]/g, (c) => {
		const r = Math.random() * 8 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
		return v.toString(8)
	})
}

const stripTemplateTag = (element) => {
	const templates = Array.from(element.querySelectorAll('template'))
	// https://gist.github.com/harmenjanssen/07e425248779c65bc5d11b02fb913274
	templates.forEach(template => {
		template.parentNode.replaceChild(template.content, template)
		stripTemplateTag(template.content)
	})
}

const dup = (o) => {
	return JSON.parse(JSON.stringify(o))
}

const createTemplateId = (element, templates) => {

	const tplid = element.getAttribute('tplid')

	if (!tplid) {
		const id = uuid()
		element.setAttribute('tplid', id)
		templates[id] = (0,_template_system__WEBPACK_IMPORTED_MODULE_0__["default"])(element)
		return templates[id]
	}

	return templates[tplid]
}

const buildtemplates = (target, components, templates) => {

	return Array
		.from(target.querySelectorAll('*'))
		.filter(node => node.tagName.toLocaleLowerCase() in components)
		.reverse()
		.map(node => {
			createTemplateId(node, templates)
			return node
		})
}

const decodeHtmlEntities = (str) => {
	textarea.innerHTML = str
	return textarea.value
}


/***/ }),

/***/ "./src/utils/pubsub.js":
/*!*****************************!*\
  !*** ./src/utils/pubsub.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "publish": () => (/* binding */ publish),
/* harmony export */   "subscribe": () => (/* binding */ subscribe),
/* harmony export */   "unsubscribe": () => (/* binding */ unsubscribe)
/* harmony export */ });
const topics = {}
const _async = {}

const publish = (name, params) => {
	_async[name] = Object.assign({}, _async[name], params)
	if( topics[name] )
		topics[name].forEach(topic => topic(params))
}

const subscribe = (name, method) => {
	topics[name] = topics[name] || []
	topics[name].push(method)
	if ( name in _async ) {
		method(_async[name])
	}
}

const unsubscribe = (topic) => {
	topics[topic.name] = (topics[topic.name] || [])
		.filter(t => t != topic.method)
	if (!topics[topic.name].length) {
		delete topics[topic.name]
		delete _async[topic.name]
	}
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "templates": () => (/* binding */ templates),
/* harmony export */   "components": () => (/* binding */ components),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/utils/index.js");
/* harmony import */ var _element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./element */ "./src/element.ts");


const templates = {};
const components = {};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    register(name, module, dependencies = {}) {
        components[name] = { name, module, dependencies };
    },
    start() {
        const body = document.body;
        (0,_utils__WEBPACK_IMPORTED_MODULE_0__.stripTemplateTag)(body);
        (0,_utils__WEBPACK_IMPORTED_MODULE_0__.buildtemplates)(body, components, templates);
        registerComponents();
    }
});
const registerComponents = () => {
    Object
        .values(components)
        .forEach(({ name, module, dependencies }) => {
        const Base = (0,_element__WEBPACK_IMPORTED_MODULE_1__["default"])(module, dependencies, templates, components);
        customElements.define(name, Base);
    });
};

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=jails.js.map