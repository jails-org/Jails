(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("jails", [], factory);
	else if(typeof exports === 'object')
		exports["jails"] = factory();
	else
		root["jails"] = factory();
})(self, () => {
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
    } else if (toNode.nodeType === DOCUMENT_FRAGMENT_NODE$1) {
      toNode = toNode.firstElementChild;
    }

    var getNodeKey = options.getNodeKey || defaultGetNodeKey;
    var onBeforeNodeAdded = options.onBeforeNodeAdded || noop;
    var onNodeAdded = options.onNodeAdded || noop;
    var onBeforeElUpdated = options.onBeforeElUpdated || noop;
    var onElUpdated = options.onElUpdated || noop;
    var onBeforeNodeDiscarded = options.onBeforeNodeDiscarded || noop;
    var onNodeDiscarded = options.onNodeDiscarded || noop;
    var onBeforeElChildrenUpdated = options.onBeforeElChildrenUpdated || noop;
    var skipFromChildren = options.skipFromChildren || noop;
    var addChild = options.addChild || function(parent, child){ return parent.appendChild(child); };
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
      var skipFrom = skipFromChildren(fromEl);
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
        while (!skipFrom && curFromNodeChild) {
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
          // MORPH
          if(!skipFrom){ addChild(fromEl, matchingFromEl); }
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
            addChild(fromEl, curToNodeChild);
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

/***/ "./src/Transpile.ts":
/*!**************************!*\
  !*** ./src/Transpile.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
function Transpile(html, config) {
    const regexTags = new RegExp(`\\${config.tags[0]}(.+?)\\${config.tags[1]}`, 'g');
    const virtual = document.createElement('template');
    virtual.innerHTML = html.replace(/<\/?template[^>]*>/g, '');
    Array.from(virtual.content.querySelectorAll('[html-for], [html-if], [html-inner], [html-class]')).forEach((element) => {
        const htmlFor = element.getAttribute('html-for');
        const htmlIf = element.getAttribute('html-if');
        const htmlInner = element.getAttribute('html-inner');
        const htmlClass = element.getAttribute('html-class');
        if (htmlFor) {
            const split = htmlFor.match(/(.*)\sin\s(.*)/) || '';
            const varname = split[1];
            const object = split[2];
            element.removeAttribute('html-for');
            const open = document.createTextNode(`<% for(var $index in ${object}){ var $key = $index; var ${varname} = ${object}[$index]; var scope = {}; scope.$index = $index; scope.$key = $key; scope.${varname} = ${object}[$index];  %>`);
            const close = document.createTextNode(`<%}%>`);
            element.setAttribute('html-scope', `<%=JSON.stringify(scope).replace(/\"/g, "'")%>`);
            wrap(open, element, close);
        }
        if (htmlIf) {
            element.removeAttribute('html-if');
            const open = document.createTextNode(`<% if ( safe(function(){return ${htmlIf};}) ){ %>`);
            const close = document.createTextNode(`<% } %>`);
            wrap(open, element, close);
        }
        if (htmlInner) {
            element.removeAttribute('html-inner');
            element.innerHTML = `<%=${htmlInner}%>`;
        }
        if (htmlClass) {
            element.removeAttribute('html-class');
            element.className += ` <%=${htmlClass}%>`;
        }
    });
    return (virtual.innerHTML
        .replace(regexTags, '<%=$1%>')
        // Booleans
        // https://meiert.com/en/blog/boolean-attributes-of-html/
        .replace(/html-(allowfullscreen|async|autofocus|autoplay|checked|controls|default|defer|disabled|formnovalidate|inert|ismap|itemscope|loop|multiple|muted|nomodule|novalidate|open|playsinline|readonly|required|reversed|selected)=\"(.*?)\"/g, `<%if($2){%>$1<%}%>`)
        // The rest
        .replace(/html-(.*?)=\"(.*?)\"/g, (all, key, value) => {
        if (key === 'key' || key === 'model' || key == 'scope') {
            return all;
        }
        if (value) {
            value = value.replace(/^{|}$/g, '');
            return `<%if (${value}) {%> ${key}="<%=${value}%>" <%}%>`;
        }
        else {
            return all;
        }
    }));
}
exports["default"] = Transpile;
const wrap = (open, node, close) => {
    var _a, _b;
    (_a = node.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(open, node);
    (_b = node.parentNode) === null || _b === void 0 ? void 0 : _b.insertBefore(close, node.nextSibling);
};


/***/ }),

/***/ "./src/component.ts":
/*!**************************!*\
  !*** ./src/component.ts ***!
  \**************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const morphdom_1 = __importDefault(__webpack_require__(/*! morphdom */ "./node_modules/morphdom/dist/morphdom-esm.js"));
const utils_1 = __webpack_require__(/*! ./utils */ "./src/utils/index.ts");
const template_system_1 = __webpack_require__(/*! ./template-system */ "./src/template-system.ts");
const events_1 = __webpack_require__(/*! ./utils/events */ "./src/utils/events.ts");
const pubsub_1 = __webpack_require__(/*! ./utils/pubsub */ "./src/utils/pubsub.ts");
function Component(elm, { module, dependencies, templates, components }) {
    const options = getOptions(module);
    (0, template_system_1.buildtemplates)(elm, components, templates);
    const tplid = elm.getAttribute('tplid');
    const template = tplid ? templates[tplid] : null;
    const state = { data: module.model ? (0, utils_1.dup)(module.model) : {} };
    state.data = Object.assign(state.data, elm.initialState ? JSON.parse(elm.initialState) : null);
    const base = {
        template,
        elm,
        dependencies,
        publish: pubsub_1.publish,
        subscribe: pubsub_1.subscribe,
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
            (0, events_1.on)(elm, eventName, selectorOrCallback, callback);
        },
        off(eventName, callback) {
            (0, events_1.off)(elm, eventName, callback);
        },
        trigger(eventName, target, args) {
            if (target.constructor === String) {
                Array
                    .from(elm.querySelectorAll(target))
                    .forEach(children => (0, events_1.trigger)(children, eventName, { args: args }));
            }
            else
                (0, events_1.trigger)(elm, eventName, { args: target });
        },
        emit: (...args) => {
            (0, events_1.trigger)(elm, args.shift(), { args: args });
        },
        state: {
            set(data) {
                if (data.constructor === Function) {
                    const newstate = (0, utils_1.dup)(state.data);
                    data(newstate);
                    base.render(newstate);
                }
                else {
                    base.render(data);
                }
                return new Promise((resolve) => (0, utils_1.rAF)(_ => (0, utils_1.rAF)(() => resolve(state.data))));
            },
            get() {
                return (0, utils_1.dup)(state.data);
            },
            getRaw() {
                return state.data;
            }
        },
        render(data = state.data) {
            if (!document.body.contains(elm)) {
                return;
            }
            state.data = Object.assign(state.data, data);
            const newdata = (0, utils_1.dup)(state.data);
            const newhtml = base.template.call(options.view(newdata));
            (0, morphdom_1.default)(elm, newhtml, morphdomOptions(elm, options));
            (0, utils_1.rAF)(_ => {
                Array
                    .from(elm.querySelectorAll('[tplid]'))
                    .forEach((child) => {
                    const data = Object.assign(newdata, child.base.state.getRaw());
                    child.options.onupdate(data);
                    child.base.render(data);
                });
            });
        }
    };
    return { base, options };
}
exports["default"] = Component;
const getOptions = (module) => ({
    main: (a) => a,
    unmount: (a) => a,
    onupdate: (a) => a,
    view: module.view ? module.view : (a) => a
});
const morphdomOptions = (_parent, options) => ({
    onNodeAdded: onUpdates(_parent, options),
    onElUpdated: onUpdates(_parent, options),
    onBeforeElChildrenUpdated: checkStatic,
    onBeforeElUpdated: checkStatic,
    getNodeKey(node) {
        if (node.nodeType === 1 && node.getAttribute('tplid')) {
            return 'key' in node.attributes ? node.attributes.key.value : node.getAttribute('tplid');
        }
        return false;
    }
});
const checkStatic = (node) => {
    if ('html-static' in node.attributes) {
        return false;
    }
};
const onUpdates = (_parent, options) => (node) => {
    if (node.nodeType === 1) {
        if (node.getAttribute && node.getAttribute('html-scope')) {
            const json = node.getAttribute('html-scope').replace(/\"/, "'");
            const scope = (new Function(`return ${json}`))();
            (0, utils_1.rAF)(_ => {
                Array.from(node.querySelectorAll('[tplid]'))
                    .map((el) => {
                    const data = Object.assign({}, _parent.base.state.getRaw(), scope);
                    options.onupdate(data);
                    el.base.render(data);
                });
            });
            // Commenting to avoid unecessary dom updates
            // node.removeAttribute('scope')
        }
    }
    return node;
};


/***/ }),

/***/ "./src/element.ts":
/*!************************!*\
  !*** ./src/element.ts ***!
  \************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const component_1 = __importDefault(__webpack_require__(/*! ./component */ "./src/component.ts"));
const utils_1 = __webpack_require__(/*! ./utils */ "./src/utils/index.ts");
function Element(module, dependencies, templates, components) {
    return class extends HTMLElement {
        constructor() {
            super();
            const { base, options } = (0, component_1.default)(this, { module, dependencies, templates, components });
            this.base = base;
            this.options = options;
            this.returns = module.default(base);
        }
        connectedCallback() {
            var _a;
            this.base.render();
            if (this.returns && this.returns.constructor === Promise) {
                this.returns.then(_ => {
                    var _a;
                    if (this.base) {
                        (_a = this.options.main()) === null || _a === void 0 ? void 0 : _a.forEach(f => f(this.base));
                    }
                });
            }
            else {
                (_a = this.options.main()) === null || _a === void 0 ? void 0 : _a.forEach(f => f(this.base));
            }
        }
        disconnectedCallback() {
            this.options.unmount(this.base);
            (0, utils_1.rAF)(() => {
                if (!document.body.contains(this)) {
                    this.__events = null;
                    this.base.elm = null;
                    this.base = null;
                    (0, utils_1.purge)(this);
                }
            });
        }
        attributeChangedCallback() {
            //TODO
        }
    };
}
exports["default"] = Element;


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const template_system_1 = __webpack_require__(/*! ./template-system */ "./src/template-system.ts");
const element_1 = __importDefault(__webpack_require__(/*! ./element */ "./src/element.ts"));
const templates = {};
const components = {};
exports["default"] = {
    templateConfig: template_system_1.templateConfig,
    register(name, module, dependencies) {
        components[name] = { name, module, dependencies };
    },
    start() {
        const body = document.body;
        (0, template_system_1.buildtemplates)(body, components, templates);
        registerComponents();
    }
};
const registerComponents = () => {
    Object
        .values(components)
        .forEach((component) => {
        const { name, module, dependencies } = component;
        const Base = (0, element_1.default)(module, dependencies, templates, components);
        customElements.define(name, Base);
    });
};


/***/ }),

/***/ "./src/template-system.ts":
/*!********************************!*\
  !*** ./src/template-system.ts ***!
  \********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.buildtemplates = exports.templateConfig = void 0;
const Transpile_1 = __importDefault(__webpack_require__(/*! ./Transpile */ "./src/Transpile.ts"));
const utils_1 = __webpack_require__(/*! ./utils */ "./src/utils/index.ts");
const textarea = document.createElement('textarea');
exports.templateConfig = {
    tags: ['${', '}']
};
function Template(element) {
    //
    element.initialState = getInitialState(element);
    const html = (0, Transpile_1.default)(element.outerHTML, exports.templateConfig);
    textarea.innerHTML = html;
    return new Function(`
		var Model = this;
		function safe(execute){
			try{return execute()}catch(err){return ''}
		}
		with( Model ){
			var output = '${textarea.value
        .replace(/<%=(.+?)%>/g, `'+safe(function(){return $1;})+'`)
        .replace(/<%(.+?)%>/g, `';$1\noutput+='`)}'

			return output
		}
	`);
}
exports["default"] = Template;
const buildtemplates = (target, components, templates) => {
    return Array
        .from(target.querySelectorAll('*'))
        .filter((node) => node.tagName.toLowerCase() in components)
        .reverse()
        .map((node) => {
        Array.from(node.querySelectorAll('template'))
            .map((template) => (0, exports.buildtemplates)(template.content, components, templates));
        createTemplateId(node, templates);
        return node;
    });
};
exports.buildtemplates = buildtemplates;
const createTemplateId = (element, templates) => {
    const tplid = element.getAttribute('tplid');
    if (!tplid) {
        const id = (0, utils_1.uuid)();
        element.setAttribute('tplid', id);
        templates[id] = Template(element);
    }
};
const getInitialState = (element) => {
    const initialState = element.getAttribute('html-model');
    if (!initialState)
        return null;
    element.removeAttribute('html-model');
    return JSON.stringify((new Function(`return ${initialState}`))());
};


/***/ }),

/***/ "./src/utils/events.ts":
/*!*****************************!*\
  !*** ./src/utils/events.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.trigger = exports.off = exports.on = void 0;
const customEvent = (() => {
    return ('CustomEvent' in window && typeof window.CustomEvent === 'function')
        ? (name, data) => new CustomEvent(name, data)
        : (name, data) => {
            const newEvent = document.createEvent('CustomEvent');
            newEvent.initCustomEvent(name, true, true, data);
            return newEvent;
        };
})();
const handler = (node, ev) => {
    return function (e) {
        const scope = this;
        const detail = e.detail || {};
        node.__events[ev].forEach(o => {
            o.handler.apply(scope, [e].concat(detail.args));
        });
    };
};
const removeListener = (node, ev) => {
    if (node.__events[ev] && node.__events[ev].listener) {
        node.removeEventListener(ev, node.__events[ev].listener, (ev == 'focus' || ev == 'blur' || ev == 'mouseenter' || ev == 'mouseleave'));
        delete node.__events[ev];
    }
};
const delegate = (node, selector, callback) => {
    return function (e) {
        const element = this;
        const detail = e.detail || {};
        let parent = e.target;
        while (parent) {
            if (parent.matches(selector)) {
                e.delegateTarget = parent;
                callback.apply(element, [e].concat(detail.args));
            }
            if (parent === node)
                break;
            parent = parent.parentNode;
        }
    };
};
const on = (node, ev, selectorOrCallback, callback) => {
    node.__events = node.__events || {};
    node.__events[ev] = (node.__events[ev] || []);
    if (!node.__events[ev].length) {
        const fn = handler(node, ev);
        node.addEventListener(ev, fn, (ev == 'focus' || ev == 'blur' || ev == 'mouseenter' || ev == 'mouseleave'));
        node.__events[ev].listener = fn;
    }
    if (selectorOrCallback.call) {
        node.__events[ev].push({ handler: selectorOrCallback, callback: selectorOrCallback });
    }
    else {
        node.__events[ev].push({ handler: delegate(node, selectorOrCallback, callback), callback });
    }
};
exports.on = on;
const off = (node, ev, fn) => {
    if (fn && node.__events[ev] && node.__events[ev].length) {
        var old = node.__events[ev];
        node.__events[ev] = node.__events[ev].filter(function (o) { return o.callback != fn; });
        node.__events[ev].listener = old.listener;
        if (!node.__events[ev].length)
            removeListener(node, ev);
    }
    else {
        removeListener(node, ev);
    }
};
exports.off = off;
const trigger = (node, name, args) => {
    node.dispatchEvent(customEvent(name, { bubbles: true, detail: args }));
};
exports.trigger = trigger;


/***/ }),

/***/ "./src/utils/index.ts":
/*!****************************!*\
  !*** ./src/utils/index.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.purge = exports.dup = exports.uuid = exports.rAF = void 0;
const rAF = (fn) => {
    if (requestAnimationFrame)
        return requestAnimationFrame(fn);
    else
        return setTimeout(fn, 1000 / 60);
};
exports.rAF = rAF;
const uuid = () => {
    return 'xxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 8 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(8);
    });
};
exports.uuid = uuid;
const dup = (o) => {
    return JSON.parse(JSON.stringify(o));
};
exports.dup = dup;
// http://crockford.com/javascript/memory/leak.html
const purge = (d) => {
    var a = d.attributes, i, l, n;
    if (a) {
        for (i = a.length - 1; i >= 0; i -= 1) {
            n = a[i].name;
            if (typeof d[n] === 'function') {
                d[n] = null;
            }
        }
    }
    a = d.childNodes;
    if (a) {
        l = a.length;
        for (i = 0; i < l; i += 1) {
            (0, exports.purge)(d.childNodes[i]);
        }
    }
};
exports.purge = purge;


/***/ }),

/***/ "./src/utils/pubsub.ts":
/*!*****************************!*\
  !*** ./src/utils/pubsub.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.subscribe = exports.publish = void 0;
const topics = {};
const _async = {};
const publish = (name, params) => {
    _async[name] = Object.assign({}, _async[name], params);
    if (topics[name])
        topics[name].forEach(topic => topic(params));
};
exports.publish = publish;
const subscribe = (name, method) => {
    topics[name] = topics[name] || [];
    topics[name].push(method);
    if (name in _async) {
        method(_async[name]);
    }
    return () => {
        topics[name] = topics[name].filter(fn => fn != method);
    };
};
exports.subscribe = subscribe;


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
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=index.js.map