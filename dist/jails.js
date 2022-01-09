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
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/morphdom/dist/morphdom-esm.js":
/*!****************************************************!*\
  !*** ./node_modules/morphdom/dist/morphdom-esm.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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

/***/ "./node_modules/sodajs/dist/soda.js":
/*!******************************************!*\
  !*** ./node_modules/sodajs/dist/soda.js ***!
  \******************************************/
/***/ (function(module) {

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else {}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __nested_webpack_require_531__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __nested_webpack_require_531__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__nested_webpack_require_531__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__nested_webpack_require_531__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__nested_webpack_require_531__.d = function(exports, name, getter) {
/******/ 		if(!__nested_webpack_require_531__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__nested_webpack_require_531__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__nested_webpack_require_531__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__nested_webpack_require_531__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__nested_webpack_require_531__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __nested_webpack_require_531__(__nested_webpack_require_531__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __nested_webpack_require_2808__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _const = __nested_webpack_require_2808__(1);

var _util = __nested_webpack_require_2808__(2);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var doc = typeof document !== 'undefined' ? document : {};

var Soda = function () {
    function Soda() {
        var prefix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'soda-';

        _classCallCheck(this, Soda);

        this._prefix = prefix;
    }

    _createClass(Soda, [{
        key: 'setDocument',
        value: function setDocument(_doc) {
            doc = _doc;
        }
    }, {
        key: 'run',
        value: function run(str, data) {
            var _this = this;

            // 解析模板DOM
            var div = doc.createElement("div");

            // 必须加入到body中去，不然自定义标签不生效
            if (doc.documentMode < 9) {
                div.style.display = 'none';
                doc.body.appendChild(div);
            }

            div.innerHTML = str;

            (0, _util.nodes2Arr)(div.childNodes).map(function (child) {
                _this.compileNode(child, data);
            });

            var innerHTML = div.innerHTML;

            if (doc.documentMode < 9) {
                doc.body.removeChild(div);
            }

            return innerHTML;
        }
    }, {
        key: 'prefix',
        value: function prefix(_prefix) {
            this._prefix = _prefix;
        }
    }, {
        key: '_getPrefixReg',
        value: function _getPrefixReg() {
            return new RegExp('^' + this._prefix);
        }
    }, {
        key: '_getPrefixedDirectiveMap',
        value: function _getPrefixedDirectiveMap() {
            var _this2 = this;

            var map = {};
            Soda.sodaDirectives.map(function (item) {
                var prefixedName = _this2._prefix + item.name;

                map[prefixedName] = item;
            });

            return map;
        }
    }, {
        key: '_removeSodaMark',
        value: function _removeSodaMark(node, name) {
            node.removeAttribute(name);
        }
    }, {
        key: 'compileNode',
        value: function compileNode(node, scope) {
            var _this3 = this;

            var prefixReg = this._getPrefixReg();

            var sodaDirectives = Soda.sodaDirectives;


            var prefixedDirectiveMap = this._getPrefixedDirectiveMap();

            var compile = function compile(node, scope) {

                // 如果只是文本
                // parseTextNode
                if (node.nodeType === (node.TEXT_NODE || 3)) {
                    node.nodeValue = node.nodeValue.replace(_const.VALUE_OUT_REG, function (item, $1) {
                        var value = _this3.parseSodaExpression($1, scope);
                        if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === "object") {
                            value = JSON.stringify(value, null, 2);
                        }
                        return value;
                    });
                }

                // parse Attributes
                if (node.attributes && node.attributes.length) {

                    // 指令优先处理
                    sodaDirectives.map(function (item) {
                        var name = item.name,
                            opt = item.opt;


                        var prefixedName = _this3._prefix + name;

                        // 这里移除了对parentNode的判断
                        // 允许使用无值的指令
                        if ((0, _util.exist)(node.getAttribute(prefixedName))) {
                            var expression = node.getAttribute(prefixedName);

                            opt.link.bind(_this3)({
                                expression: expression,
                                scope: scope,
                                el: node,
                                parseSodaExpression: _this3.parseSodaExpression.bind(_this3),
                                getValue: _this3.getValue.bind(_this3),
                                compileNode: _this3.compileNode.bind(_this3),
                                document: doc
                            });

                            // 移除标签
                            _this3._removeSodaMark(node, prefixedName);
                        }
                    });

                    // 处理输出 包含 prefix-*
                    (0, _util.nodes2Arr)(node.attributes)
                    // 过滤掉指令里包含的属性
                    .filter(function (attr) {
                        return !prefixedDirectiveMap[attr.name];
                    }).map(function (attr) {
                        if (prefixReg.test(attr.name)) {
                            var attrName = attr.name.replace(prefixReg, '');

                            if (attrName && (0, _util.exist)(attr.value)) {
                                var attrValue = _this3.parseComplexExpression(attr.value, scope);

                                if (attrValue !== false && (0, _util.exist)(attrValue)) {
                                    node.setAttribute(attrName, attrValue);
                                }

                                _this3._removeSodaMark(node, attr.name);
                            }

                            // 对其他属性里含expr 处理
                        } else {
                            if ((0, _util.exist)(attr.value)) {
                                attr.value = _this3.parseComplexExpression(attr.value, scope);
                            }
                        }
                    });
                }

                // parse childNodes
                (0, _util.nodes2Arr)(node.childNodes).map(function (child) {
                    compile(child, scope);
                });
            };

            compile(node, scope);
        }
    }, {
        key: 'getEvalFunc',
        value: function getEvalFunc(expr) {
            var evalFunc = new Function("getValue", "sodaFilterMap", "return function sodaExp(scope){ return " + expr + "}")(this.getValue, Soda.sodaFilterMap);

            return evalFunc;
        }
    }, {
        key: 'getValue',
        value: function getValue(_data, _attrStr) {
            _const.CONST_REGG.lastIndex = 0;
            var realAttrStr = _attrStr.replace(_const.CONST_REGG, function (r) {
                if (typeof _data[r] === "undefined") {
                    return r;
                } else {
                    return _data[r];
                }
            });

            if (_attrStr === 'true') {
                return true;
            }

            if (_attrStr === 'false') {
                return false;
            }

            var _getValue = function _getValue(data, attrStr) {
                var dotIndex = attrStr.indexOf(".");

                if (dotIndex > -1) {
                    var attr = attrStr.substr(0, dotIndex);
                    attrStr = attrStr.substr(dotIndex + 1);

                    // 检查attrStr是否属于变量并转换
                    if (typeof _data[attr] !== "undefined" && _const.CONST_REG.test(attr)) {
                        attr = _data[attr];
                    }

                    if (typeof data[attr] !== "undefined" && data[attr] !== null) {
                        return _getValue(data[attr], attrStr);
                    } else {
                        var eventData = {
                            name: realAttrStr,
                            data: _data
                        };

                        // 如果还有
                        return "";
                    }
                } else {
                    attrStr = attrStr.trim();

                    // 检查attrStr是否属于变量并转换
                    if (typeof _data[attrStr] !== "undefined" && _const.CONST_REG.test(attrStr)) {
                        attrStr = _data[attrStr];
                    }

                    var rValue;
                    if (typeof data[attrStr] !== "undefined") {
                        rValue = data[attrStr];
                    } else {
                        var eventData = {
                            name: realAttrStr,
                            data: _data
                        };

                        rValue = "";
                    }

                    return rValue;
                }
            };

            return _getValue(_data, _attrStr);
        }

        // 解析混合表达式

    }, {
        key: 'parseComplexExpression',
        value: function parseComplexExpression(str, scope) {
            var _this4 = this;

            var onlyResult = _const.ONLY_VALUE_OUT_REG.exec(str);
            if (onlyResult) {
                var sodaExp = onlyResult[1];

                return this.parseSodaExpression(sodaExp, scope);
            }

            return str.replace(_const.VALUE_OUT_REG, function (item, $1) {
                return _this4.parseSodaExpression($1, scope);
            });
        }
    }, {
        key: 'parseSodaExpression',
        value: function parseSodaExpression(str, scope) {
            var _this5 = this;

            // 将字符常量保存下来
            str = str.replace(_const.STRING_REG, function (r, $1, $2) {
                var key = (0, _util.getRandom)();
                scope[key] = $1 || $2;
                return key;
            });

            // 对filter进行处理
            str = str.replace(_const.OR_REG, _const.OR_REPLACE).split("|");

            for (var i = 0; i < str.length; i++) {
                str[i] = (str[i].replace(new RegExp(_const.OR_REPLACE, 'g'), "||") || '').trim();
            }

            var expr = str[0] || "";
            var filters = str.slice(1);

            while (_const.ATTR_REG_NG.test(expr)) {
                _const.ATTR_REG.lastIndex = 0;

                //对expr预处理
                expr = expr.replace(_const.ATTR_REG, function (r, $1) {
                    var key = (0, _util.getAttrVarKey)();
                    // 属性名称为字符常量
                    var attrName = _this5.parseSodaExpression($1, scope);

                    // 给一个特殊的前缀 表示是属性变量

                    scope[key] = attrName;

                    return "." + key;
                });
            }

            expr = expr.replace(_const.OBJECT_REG, function (value) {
                return "getValue(scope,'" + value.trim() + "')";
            });

            expr = this.parseFilter(filters, expr);

            return this.getEvalFunc(expr)(scope);
        }
    }, {
        key: 'parseFilter',
        value: function parseFilter(filters, expr) {
            var sodaFilterMap = Soda.sodaFilterMap;


            var parse = function parse() {
                var filterExpr = filters.shift();

                if (!filterExpr) {
                    return;
                }

                var filterExpr = filterExpr.split(":");
                var args = filterExpr.slice(1) || [];
                var name = (filterExpr[0] || "").trim();

                for (var i = 0; i < args.length; i++) {
                    //这里根据类型进行判断
                    if (_const.OBJECT_REG_NG.test(args[i])) {
                        args[i] = "getValue(scope,'" + args[i] + "')";
                    } else {}
                }

                if (sodaFilterMap[name]) {
                    args.unshift(expr);

                    args = args.join(",");

                    expr = "sodaFilterMap['" + name + "'](" + args + ")";
                }

                parse();
            };

            parse();

            return expr;
        }
    }], [{
        key: 'filter',
        value: function filter(name, func) {
            this.sodaFilterMap[name] = func;
        }
    }, {
        key: 'getFilter',
        value: function getFilter(name) {
            return this.sodaFilterMap[name];
        }
    }, {
        key: 'directive',
        value: function directive(name, opt) {
            // 按照顺序入
            var _opt$priority = opt.priority,
                priority = _opt$priority === undefined ? 0 : _opt$priority;

            var i = void 0;

            for (i = 0; i < this.sodaDirectives.length; i++) {
                var item = this.sodaDirectives[i];
                var _item$opt$priority = item.opt.priority,
                    itemPriority = _item$opt$priority === undefined ? 0 : _item$opt$priority;

                // 比他小 继续比下一个

                if (priority < itemPriority) {

                    // 发现比它大或者相等 就插大他前面
                } else if (priority >= itemPriority) {
                    break;
                }
            }

            this.sodaDirectives.splice(i, 0, {
                name: name,
                opt: opt
            });
        }
    }, {
        key: 'discribe',
        value: function discribe(name, funcOrStr) {
            var option = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : { compile: true };


            this.template[name] = {
                funcOrStr: funcOrStr,
                option: option
            };
        }
    }, {
        key: 'getTmpl',
        value: function getTmpl(name, args) {
            var template = this.template[name];
            var funcOrStr = template.funcOrStr,
                _template$option = template.option,
                option = _template$option === undefined ? {} : _template$option;


            var result = void 0;

            if (typeof funcOrStr === 'function') {
                result = funcOrStr.apply(null, args);
            } else {
                result = funcOrStr;
            }

            return {
                template: result,
                option: option
            };
        }
    }]);

    return Soda;
}();

Soda.sodaDirectives = [];
Soda.sodaFilterMap = {};
Soda.template = {};
exports["default"] = Soda;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
// 标识符
var IDENTOR_REG = exports.IDENTOR_REG = /[a-zA-Z_\$]+[\w\$]*/g;
var STRING_REG = exports.STRING_REG = /"([^"]*)"|'([^']*)'/g;
var NUMBER_REG = exports.NUMBER_REG = /\d+|\d*\.\d+/g;

var OBJECT_REG = exports.OBJECT_REG = /[a-zA-Z_\$]+[\w\$]*(?:\s*\.\s*(?:[a-zA-Z_\$]+[\w\$]*|\d+))*/g;

// 非global 做test用
var OBJECT_REG_NG = exports.OBJECT_REG_NG = /[a-zA-Z_\$]+[\w\$]*(?:\s*\.\s*(?:[a-zA-Z_\$]+[\w\$]*|\d+))*/;

var ATTR_REG = exports.ATTR_REG = /\[([^\[\]]*)\]/g;
var ATTR_REG_NG = exports.ATTR_REG_NG = /\[([^\[\]]*)\]/;
var ATTR_REG_DOT = exports.ATTR_REG_DOT = /\.([a-zA-Z_\$]+[\w\$]*)/g;

var NOT_ATTR_REG = exports.NOT_ATTR_REG = /[^\.|]([a-zA-Z_\$]+[\w\$]*)/g;

var OR_REG = exports.OR_REG = /\|\|/g;

var OR_REPLACE = exports.OR_REPLACE = "OR_OPERATOR\x1E";

var CONST_PRIFIX = exports.CONST_PRIFIX = "_$C$_";
var CONST_REG = exports.CONST_REG = /^_\$C\$_/;
var CONST_REGG = exports.CONST_REGG = /_\$C\$_[^\.]+/g;
var VALUE_OUT_REG = exports.VALUE_OUT_REG = /\{\{([^\}]*)\}\}/g;
var ONLY_VALUE_OUT_REG = exports.ONLY_VALUE_OUT_REG = /^\{\{([^\}]*)\}\}$/;

/***/ }),
/* 2 */
/***/ (function(module, exports, __nested_webpack_require_18762__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.assign = exports.nodes2Arr = exports.exist = exports.getRandom = exports.getAttrVarKey = undefined;

var _const = __nested_webpack_require_18762__(1);

var getAttrVarKey = exports.getAttrVarKey = function getAttrVarKey() {
	return _const.CONST_PRIFIX + ~~(Math.random() * 1E6);
};

var getRandom = exports.getRandom = function getRandom() {
	return "$$" + ~~(Math.random() * 1E6);
};

var exist = exports.exist = function exist(value) {
	return value !== null && value !== undefined && value !== "" && typeof value !== 'undefined';
};

var nodes2Arr = exports.nodes2Arr = function nodes2Arr(nodes) {
	var arr = [];

	for (var i = 0; i < nodes.length; i++) {
		arr.push(nodes[i]);
	}

	return arr;
};

var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

var toObject = function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
};

var assign = exports.assign = Object.assign || function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __nested_webpack_require_20533__) {

"use strict";


var _soda = __nested_webpack_require_20533__(0);

var _soda2 = _interopRequireDefault(_soda);

var _util = __nested_webpack_require_20533__(2);

__nested_webpack_require_20533__(4);

__nested_webpack_require_20533__(5);

__nested_webpack_require_20533__(6);

__nested_webpack_require_20533__(7);

__nested_webpack_require_20533__(8);

__nested_webpack_require_20533__(9);

__nested_webpack_require_20533__(10);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var sodaInstance = new _soda2["default"]();

var init = function init(str, data) {
    return sodaInstance.run(str, data);
};

var mock = {
    prefix: function prefix(_prefix) {
        sodaInstance.prefix(_prefix);
    },
    filter: function filter(name, func) {
        _soda2["default"].filter(name, func);
    },
    directive: function directive(name, opt) {
        _soda2["default"].directive(name, opt);
    },
    setDocument: function setDocument(document) {
        sodaInstance.setDocument(document);
    },
    discribe: function discribe(name, str, option) {
        _soda2["default"].discribe(name, str, option);
    },


    Soda: _soda2["default"]
};

var soda = (0, _util.assign)(init, mock);

module.exports = soda;

/***/ }),
/* 4 */
/***/ (function(module, exports, __nested_webpack_require_21756__) {

"use strict";


var _soda = __nested_webpack_require_21756__(0);

var _soda2 = _interopRequireDefault(_soda);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_soda2["default"].directive('repeat', {
    priority: 10,
    link: function link(_ref) {
        var _this = this;

        var scope = _ref.scope,
            el = _ref.el,
            expression = _ref.expression,
            getValue = _ref.getValue,
            parseSodaExpression = _ref.parseSodaExpression,
            compileNode = _ref.compileNode;

        var itemName;
        var valueName;

        var trackReg = /\s+by\s+([^\s]+)$/;

        var trackName;
        var opt = expression.replace(trackReg, function (item, $1) {
            if ($1) {
                trackName = ($1 || '').trim();
            }

            return '';
        });

        var inReg = /([^\s]+)\s+in\s+([^\s]+)|\(([^,]+)\s*,\s*([^)]+)\)\s+in\s+([^\s]+)/;

        var r = inReg.exec(opt);
        if (r) {
            if (r[1] && r[2]) {
                itemName = (r[1] || '').trim();
                valueName = (r[2] || '').trim();

                if (!(itemName && valueName)) {
                    return;
                }
            } else if (r[3] && r[4] && r[5]) {
                trackName = (r[3] || '').trim();
                itemName = (r[4] || '').trim();
                valueName = (r[5] || '').trim();
            }
        } else {
            return;
        }

        trackName = trackName || '$index';

        // 这里要处理一下
        var repeatObj = getValue(scope, valueName) || [];

        var repeatFunc = function repeatFunc(i) {
            var itemNode = el.cloneNode(true);

            // 这里创建一个新的scope
            var itemScope = Object.create(scope);
            itemScope[trackName] = i;

            itemScope[itemName] = repeatObj[i];

            //itemScope.__proto__ = scope;

            // REMOVE cjd6568358
            itemNode.removeAttribute(_this._prefix + 'repeat');

            el.parentNode.insertBefore(itemNode, el);

            // 这里是新加的dom, 要单独编译
            compileNode(itemNode, itemScope);
        };

        if ('length' in repeatObj) {
            for (var i = 0; i < repeatObj.length; i++) {
                repeatFunc(i);
            }
        } else {
            for (var i in repeatObj) {
                if (repeatObj.hasOwnProperty(i)) {
                    repeatFunc(i);
                }
            }
        }

        // el 清理
        el.parentNode.removeChild(el);

        if (el.childNodes && el.childNodes.length) {
            el.innerHTML = '';
        }
    }
});

/***/ }),
/* 5 */
/***/ (function(module, exports, __nested_webpack_require_24471__) {

"use strict";


var _soda = __nested_webpack_require_24471__(0);

var _soda2 = _interopRequireDefault(_soda);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_soda2["default"].directive('if', {
    priority: 9,
    link: function link(_ref) {
        var expression = _ref.expression,
            parseSodaExpression = _ref.parseSodaExpression,
            scope = _ref.scope,
            el = _ref.el;

        var expressFunc = parseSodaExpression(expression, scope);

        if (expressFunc) {} else {
            el.parentNode && el.parentNode.removeChild(el);
            el.innerHTML = '';
        }
    }
});

/***/ }),
/* 6 */
/***/ (function(module, exports, __nested_webpack_require_25203__) {

"use strict";


var _soda = __nested_webpack_require_25203__(0);

var _soda2 = _interopRequireDefault(_soda);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var classNameRegExp = function classNameRegExp(className) {
    return new RegExp('(^|\\s+)' + className + '(\\s+|$)', 'g');
};

var addClass = function addClass(el, className) {
    if (!el.className) {
        el.className = className;

        return;
    }

    if (el.className.match(classNameRegExp(className))) {} else {
        el.className += " " + className;
    }
};

var removeClass = function removeClass(el, className) {
    el.className = el.className.replace(classNameRegExp(className), "");
};

_soda2["default"].directive('class', {
    link: function link(_ref) {
        var scope = _ref.scope,
            el = _ref.el,
            expression = _ref.expression,
            parseSodaExpression = _ref.parseSodaExpression;

        var expressFunc = parseSodaExpression(expression, scope);

        if (expressFunc) {
            addClass(el, expressFunc);
        } else {}
    }
});

/***/ }),
/* 7 */
/***/ (function(module, exports, __nested_webpack_require_26381__) {

"use strict";


var _soda = __nested_webpack_require_26381__(0);

var _soda2 = _interopRequireDefault(_soda);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_soda2["default"].directive('html', {
    link: function link(_ref) {
        var expression = _ref.expression,
            scope = _ref.scope,
            el = _ref.el,
            parseSodaExpression = _ref.parseSodaExpression;

        var result = parseSodaExpression(expression, scope);

        if (result) {
            el.innerHTML = result;
        }
    }
});

/***/ }),
/* 8 */
/***/ (function(module, exports, __nested_webpack_require_27024__) {

"use strict";


var _soda = __nested_webpack_require_27024__(0);

var _soda2 = _interopRequireDefault(_soda);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_soda2["default"].directive('replace', {
    link: function link(_ref) {
        var scope = _ref.scope,
            el = _ref.el,
            expression = _ref.expression,
            parseSodaExpression = _ref.parseSodaExpression,
            document = _ref.document;

        var result = parseSodaExpression(expression, scope);

        if (result) {
            var div = document.createElement('div');
            div.innerHTML = result;

            if (el.parentNode) {
                while (div.childNodes[0]) {
                    el.parentNode.insertBefore(div.childNodes[0], el);
                }
            }
        }

        el.parentNode && el.parentNode.removeChild(el);
    }
});

/***/ }),
/* 9 */
/***/ (function(module, exports, __nested_webpack_require_28000__) {

"use strict";


var _soda = __nested_webpack_require_28000__(0);

var _soda2 = _interopRequireDefault(_soda);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_soda2["default"].directive('style', {
    link: function link(_ref) {
        var scope = _ref.scope,
            el = _ref.el,
            expression = _ref.expression,
            parseSodaExpression = _ref.parseSodaExpression;

        var expressFunc = parseSodaExpression(expression, scope);

        var getCssValue = function getCssValue(name, value) {
            var numberWithoutpx = /opacity|z-index/;
            if (numberWithoutpx.test(name)) {
                return parseFloat(value);
            }

            if (isNaN(value)) {
                return value;
            } else {
                return value + "px";
            }
        };

        if (expressFunc) {
            var stylelist = [];

            for (var i in expressFunc) {
                if (expressFunc.hasOwnProperty(i)) {
                    var provalue = getCssValue(i, expressFunc[i]);

                    stylelist.push([i, provalue].join(":"));
                }
            }

            var style = el.style;
            for (var i = 0; i < style.length; i++) {
                var name = style[i];
                if (expressFunc[name]) {} else {
                    stylelist.push([name, style[name]].join(":"));
                }
            }

            var styleStr = stylelist.join(";");

            el.setAttribute("style", styleStr);
        }
    }
});

/***/ }),
/* 10 */
/***/ (function(module, exports, __nested_webpack_require_29643__) {

"use strict";


var _soda = __nested_webpack_require_29643__(0);

var _soda2 = _interopRequireDefault(_soda);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_soda2["default"].directive('include', {
    priority: 8,
    link: function link(_ref) {
        var scope = _ref.scope,
            el = _ref.el,
            parseSodaExpression = _ref.parseSodaExpression,
            expression = _ref.expression;

        var VALUE_OUT_REG = /\{\{([^\}]*)\}\}/g;

        var result = expression.replace(VALUE_OUT_REG, function (item, $1) {
            return parseSodaExpression($1, scope);
        });

        result = result.split(":");

        var name = result[0];

        var args = result.slice(1);

        var templateOption = _soda2["default"].getTmpl(name, args);

        var template = templateOption.template,
            _templateOption$optio = templateOption.option,
            option = _templateOption$optio === undefined ? {} : _templateOption$optio;

        if (template) {
            if (option.compile) {
                el.outerHTML = this.run(template, scope);
            } else {
                el.outerHTML = template;
            }
        }
    }
});

/***/ })
/******/ ]);
});

/***/ }),

/***/ "./src/Component.ts":
/*!**************************!*\
  !*** ./src/Component.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Component = void 0;
var Pubsub = __webpack_require__(/*! ./utils/pubsub */ "./src/utils/pubsub.js");
var events_1 = __webpack_require__(/*! ./utils/events */ "./src/utils/events.js");
var utils_1 = __webpack_require__(/*! ./utils */ "./src/utils/index.js");
var Component = function (_a) {
    var name = _a.name, element = _a.element, dependencies = _a.dependencies, ElementInterface = _a.ElementInterface;
    var subscriptions = [];
    var stateSubscriptions = [];
    var resolver;
    var promise = new Promise(function (resolve) { return resolver = resolve; });
    var base = {
        name: name,
        dependencies: dependencies,
        elm: element,
        publish: Pubsub.publish,
        unsubscribe: Pubsub.unsubscribe,
        __initialize: function () {
            resolver(base);
        },
        main: function (fn) {
            promise
                .then(function (_) { return fn().forEach(function (lambda) { return lambda(base); }); })
                .catch(function (err) { return console.error(err); });
        },
        expose: function (methods) {
            ElementInterface.instances[name].methods = methods;
        },
        state: {
            set: function (state) {
                if (state.constructor === Function) {
                    var model = ElementInterface.model;
                    state(model);
                    ElementInterface.update(model);
                }
                else {
                    ElementInterface.update(state);
                }
                stateSubscriptions.forEach(function (fn) { return fn(ElementInterface.model); });
                return new Promise(function (resolve) { return (0, utils_1.rAF)(function (_) { return (0, utils_1.rAF)(resolve); }); });
            },
            get: function () {
                return ElementInterface.model;
            },
            subscribe: function (fn) {
                stateSubscriptions.push(fn);
            },
            unsubscribe: function (fn) {
                stateSubscriptions = stateSubscriptions.filter(function (item) { return item !== fn; });
            }
        },
        destroy: function (callback) {
            ElementInterface.destroyers.push(callback);
        },
        on: function (name, selectorOrCallback, callback) {
            (0, events_1.on)(element, name, selectorOrCallback, callback);
        },
        off: function (name, callback) {
            (0, events_1.off)(element, name, callback);
        },
        trigger: function (ev, target, args) {
            if (target.constructor === String)
                (0, events_1.trigger)(element.querySelector(target), ev, { args: args });
            else
                (0, events_1.trigger)(element, ev, { args: target });
        },
        emit: function (n, params) {
            var args = Array.prototype.slice.call(arguments);
            (0, events_1.trigger)(element, args.shift(), { args: args });
        },
        update: function (fn) {
            ElementInterface.parentUpdate = fn;
        },
        get: function (name, query) {
            return function () {
                (0, utils_1.rAF)(function (_) {
                    var args = Array.prototype.slice.call(arguments), method = args.shift(), selector = "[data-component*=".concat(name, "]");
                    query = query ? selector + query : selector;
                    Array.from(element.querySelectorAll(query))
                        .forEach(function (el) {
                        var instance = el.__instance__.instances[name];
                        if (instance && (method in instance.methods))
                            instance.methods[method].apply(null, args);
                    });
                    if (element.matches(query)) {
                        var instance = element.__instance__.instances[name];
                        if (instance && method in instance.methods)
                            instance.methods[method].apply(null, args);
                    }
                });
            };
        },
        subscribe: function (name, method) {
            subscriptions.push({ name: name, method: method });
            Pubsub.subscribe(name, method);
        }
    };
    return base;
};
exports.Component = Component;


/***/ }),

/***/ "./src/Element.ts":
/*!************************!*\
  !*** ./src/Element.ts ***!
  \************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Element = void 0;
var utils_1 = __webpack_require__(/*! ./utils */ "./src/utils/index.js");
var morphdom_1 = __webpack_require__(/*! morphdom */ "./node_modules/morphdom/dist/morphdom-esm.js");
var soda_config_1 = __webpack_require__(/*! ./soda-config */ "./src/soda-config.js");
var sodajs = (0, soda_config_1.setSodaConfig)();
var templates = {};
var Element = function (el) {
    (0, utils_1.stripTemplateTag)(el);
    var updates = [];
    var model = Object.assign({}, JSON.parse(el.dataset.initialState || '{}'));
    var morphdomOptions = lifecycle(el);
    var _a = getTemplateData(el), template = _a.template, tplid = _a.tplid;
    var api = {
        tplid: tplid,
        el: el,
        template: template,
        model: model,
        parent: {},
        view: function (_) { return _; },
        instances: {},
        destroyers: [],
        promises: [],
        parentUpdate: function (data) { return null; },
        dispose: function () {
            if (api.promises.length) {
                Promise.all(api.promises)
                    .then(function (_) { return api.destroyers.forEach(function (destroy) { return destroy(api); }); });
            }
            else {
                api.destroyers.forEach(function (destroy) { return destroy(api); });
            }
        },
        update: function (data, isParentUpdate) {
            if (data === void 0) { data = {}; }
            if (!document.body.contains(el))
                return;
            updates.push(data);
            (0, utils_1.rAF)(function (_) {
                if (updates.length) {
                    var newdata_1 = {};
                    updates.forEach(function (d) { return Object.assign(newdata_1, d); });
                    updates = [];
                    api.model = Object.assign(api.model, newdata_1);
                    if (isParentUpdate) {
                        api.parentUpdate(api.model);
                    }
                    var newhtml = sodajs(template, api.view((0, utils_1.dup)(api.model)));
                    (0, morphdom_1.default)(el, newhtml, morphdomOptions);
                    Array
                        .from(el.querySelectorAll('[data-component]'))
                        .forEach(function (node) {
                        if (!node.__instance__)
                            return;
                        var _a = api.model, parent = _a.parent, model = __rest(_a, ["parent"]);
                        var initialState = node.dataset.initialState ? JSON.parse(node.dataset.initialState) : {};
                        var newmodel = Object.assign(initialState, { parent: model });
                        node.__instance__.update(newmodel, true);
                    });
                }
            });
        }
    };
    el.__instance__ = api;
    return api;
};
exports.Element = Element;
var lifecycle = function (element) {
    return {
        onBeforeElUpdated: update(element),
        onBeforeElChildrenUpdated: update(element),
        getNodeKey: function (node) {
            if (node.nodeType === 1 && node.dataset.tplid)
                return node.dataset.key || node.dataset.tplid;
            return false;
        }
    };
};
var update = function (element) { return function (node, toEl) {
    if (node.isEqualNode(toEl))
        return false;
    if (node.nodeType == 1) {
        if ('static' in node.dataset)
            return false;
    }
    return true;
}; };
var getTemplateData = function (element) {
    if (element.getAttribute('tplid')) {
        var tplid = element.getAttribute('tplid');
        var template = templates[tplid];
        return { tplid: tplid, template: template };
    }
    else {
        var tplid = (0, utils_1.uuid)();
        element.setAttribute('tplid', tplid);
        templates[tplid] = (0, utils_1.createTemplate)(element.outerHTML, templates);
        var template = templates[tplid];
        return { tplid: tplid, template: template };
    }
};


/***/ }),

/***/ "./src/Scanner.ts":
/*!************************!*\
  !*** ./src/Scanner.ts ***!
  \************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Scanner = void 0;
exports.Scanner = {
    scan: function (node, callback) {
        if (node.nodeType === 1) {
            var list = Array.from(node.querySelectorAll('[data-component]'));
            var elements = node.dataset.component ? [node].concat(list) : list;
            if (elements.length) {
                elements.reverse().forEach(callback);
            }
        }
    },
    observe: function (target, onAdd, onRemove) {
        var observer = new MutationObserver(function (mutations) { return mutations.forEach(function (mutation) {
            if (mutation.type === 'childList') {
                if (mutation.addedNodes.length) {
                    Array.from(mutation.addedNodes).forEach(function (node) { return exports.Scanner.scan(node, onAdd); });
                }
                else if (mutation.removedNodes.length) {
                    Array.from(mutation.removedNodes).forEach(function (node) { return exports.Scanner.scan(node, onRemove); });
                }
            }
        }); });
        observer.observe(target, { childList: true, subtree: true });
    }
};


/***/ }),

/***/ "./src/soda-config.js":
/*!****************************!*\
  !*** ./src/soda-config.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "setSodaConfig": () => (/* binding */ setSodaConfig)
/* harmony export */ });
/* harmony import */ var sodajs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! sodajs */ "./node_modules/sodajs/dist/soda.js");
/* harmony import */ var sodajs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(sodajs__WEBPACK_IMPORTED_MODULE_0__);


const setSodaConfig = () => {

	sodajs__WEBPACK_IMPORTED_MODULE_0___default().prefix('v-')

	sodajs__WEBPACK_IMPORTED_MODULE_0___default().directive('repeat', {

		priority: 10,

		link({ scope, el, expression, getValue, compileNode }) {

			let itemName
			let valueName
			let trackName

			const trackReg = /\s+by\s+([^\s]+)$/
			const inReg = /([^\s]+)\s+in\s+([^\s]+)|\(([^,]+)\s*,\s*([^)]+)\)\s+in\s+([^\s]+)/

			const opt = expression.replace(trackReg, (item, $1) => {
				if ($1)
					trackName = ($1 || '').trim()
				return ''
			})

			const r = inReg.exec(opt)

			if (r) {
				if (r[1] && r[2]) {
					itemName = (r[1] || '').trim()
					valueName = (r[2] || '').trim()

					if (!(itemName && valueName)) {
						return
					}
				} else if (r[3] && r[4] && r[5]) {
					trackName = (r[3] || '').trim()
					itemName = (r[4] || '').trim()
					valueName = (r[5] || '').trim()
				}
			} else {
				return
			}

			trackName = trackName || '$index'

			const repeatObj = getValue(scope, valueName) || []

			const repeatFunc = (i) => {

				const itemNode = el.cloneNode(true)
				const itemScope = Object.create(scope)

				itemScope[trackName] = i
				itemScope[itemName] = repeatObj[i]

				itemNode.removeAttribute(`${this._prefix}repeat`)

				el.parentNode.insertBefore(itemNode, el)

				Array.from(itemNode.querySelectorAll('[data-component]'))
					.forEach( node => node.setAttribute('data-initial-state', JSON.stringify(itemScope)) )

				compileNode(itemNode, itemScope)
			}

			if ('length' in repeatObj) {
				for (var i = 0; i < repeatObj.length; i++) {
					repeatFunc(i)
				}
			} else {
				for (var i in repeatObj) {
					if (repeatObj.hasOwnProperty(i)) {
						repeatFunc(i)
					}
				}
			}

			el.parentNode.removeChild(el)

			if (el.childNodes && el.childNodes.length)
				el.innerHTML = ''
		}
	})

	return (sodajs__WEBPACK_IMPORTED_MODULE_0___default())
}


/***/ }),

/***/ "./src/utils/events.js":
/*!*****************************!*\
  !*** ./src/utils/events.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "rAF": () => (/* binding */ rAF),
/* harmony export */   "uuid": () => (/* binding */ uuid),
/* harmony export */   "stripTemplateTag": () => (/* binding */ stripTemplateTag),
/* harmony export */   "dup": () => (/* binding */ dup),
/* harmony export */   "createTemplate": () => (/* binding */ createTemplate)
/* harmony export */ });

const rAF = (fn) => {
	(requestAnimationFrame || setTimeout)(fn, 1000 / 60)
}

const uuid = () => {
	return 'xxxxxxxx'.replace(/[xy]/g, (c) => {
		const r = Math.random() * 8 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
		return v.toString(8)
	})
}

const stripTemplateTag = ( element ) => {
	const templates = Array.from(element.querySelectorAll('template'))
	// https://gist.github.com/harmenjanssen/07e425248779c65bc5d11b02fb913274
	templates.forEach( template => {
		template.parentNode.replaceChild(template.content, template )
	})
}

const dup = (o) => {
	return JSON.parse( JSON.stringify(o) )
}

const createTemplate = ( html, templates ) => {

	const vroot = document.createElement('div')
	vroot.innerHTML = html
	stripTemplateTag( vroot )

	Array
		.from(vroot.querySelectorAll('[data-component]'))
		.forEach( c => {
			const tplid = c.getAttribute('tplid')
			const cache = templates[tplid]
			if( cache )
				c.outerHTML = cache
		})

	return vroot.innerHTML
}


/***/ }),

/***/ "./src/utils/pubsub.js":
/*!*****************************!*\
  !*** ./src/utils/pubsub.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
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
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
var exports = __webpack_exports__;
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
var Element_1 = __webpack_require__(/*! ./Element */ "./src/Element.ts");
var Scanner_1 = __webpack_require__(/*! ./Scanner */ "./src/Scanner.ts");
var Component_1 = __webpack_require__(/*! ./Component */ "./src/Component.ts");
var utils_1 = __webpack_require__(/*! ./utils */ "./src/utils/index.js");
var components = {};
exports["default"] = {
    start: function () {
        var body = document.body;
        (0, utils_1.stripTemplateTag)(body);
        Scanner_1.Scanner.scan(body, createElement);
        Scanner_1.Scanner.observe(body, createElement, disposeElement);
    },
    register: function (name, module, dependencies) {
        if (dependencies === void 0) { dependencies = {}; }
        components[name] = { name: name, module: module, dependencies: dependencies };
    }
};
var createElement = function (element) {
    var ElementInterface = (0, Element_1.Element)(element);
    var names = element.dataset.component.split(/\s/);
    names.forEach(function (name) {
        var C = components[name];
        if (!C) {
            console.warn("Jails - Module ".concat(name, " not registered"));
            return;
        }
        var module = C.module, dependencies = C.dependencies;
        ElementInterface.model = Object.assign({}, module.model, ElementInterface.model);
        var base = (0, Component_1.Component)({ name: name, element: element, dependencies: dependencies, ElementInterface: ElementInterface });
        var promise = module.default(base);
        if (promise && promise.then) {
            ElementInterface.promises.push(promise);
        }
        base.__initialize();
        ElementInterface.view = module.view || ElementInterface.view;
        ElementInterface.instances[name] = { methods: {} };
    });
    ElementInterface.update();
};
var disposeElement = function (node) {
    if (node.__instance__)
        node.__instance__.dispose();
};

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=jails.js.map