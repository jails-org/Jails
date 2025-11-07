var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var DOCUMENT_FRAGMENT_NODE = 11;
function morphAttrs(fromNode, toNode) {
  var toNodeAttrs = toNode.attributes;
  var attr;
  var attrName;
  var attrNamespaceURI;
  var attrValue;
  var fromValue;
  if (toNode.nodeType === DOCUMENT_FRAGMENT_NODE || fromNode.nodeType === DOCUMENT_FRAGMENT_NODE) {
    return;
  }
  for (var i = toNodeAttrs.length - 1; i >= 0; i--) {
    attr = toNodeAttrs[i];
    attrName = attr.name;
    attrNamespaceURI = attr.namespaceURI;
    attrValue = attr.value;
    if (attrNamespaceURI) {
      attrName = attr.localName || attrName;
      fromValue = fromNode.getAttributeNS(attrNamespaceURI, attrName);
      if (fromValue !== attrValue) {
        if (attr.prefix === "xmlns") {
          attrName = attr.name;
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
var range;
var NS_XHTML = "http://www.w3.org/1999/xhtml";
var doc = typeof document === "undefined" ? void 0 : document;
var HAS_TEMPLATE_SUPPORT = !!doc && "content" in doc.createElement("template");
var HAS_RANGE_SUPPORT = !!doc && doc.createRange && "createContextualFragment" in doc.createRange();
function createFragmentFromTemplate(str) {
  var template2 = doc.createElement("template");
  template2.innerHTML = str;
  return template2.content.childNodes[0];
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
  var fragment = doc.createElement("body");
  fragment.innerHTML = str;
  return fragment.childNodes[0];
}
function toElement(str) {
  str = str.trim();
  if (HAS_TEMPLATE_SUPPORT) {
    return createFragmentFromTemplate(str);
  } else if (HAS_RANGE_SUPPORT) {
    return createFragmentFromRange(str);
  }
  return createFragmentFromWrap(str);
}
function compareNodeNames(fromEl, toEl) {
  var fromNodeName = fromEl.nodeName;
  var toNodeName = toEl.nodeName;
  var fromCodeStart, toCodeStart;
  if (fromNodeName === toNodeName) {
    return true;
  }
  fromCodeStart = fromNodeName.charCodeAt(0);
  toCodeStart = toNodeName.charCodeAt(0);
  if (fromCodeStart <= 90 && toCodeStart >= 97) {
    return fromNodeName === toNodeName.toUpperCase();
  } else if (toCodeStart <= 90 && fromCodeStart >= 97) {
    return toNodeName === fromNodeName.toUpperCase();
  } else {
    return false;
  }
}
function createElementNS(name, namespaceURI) {
  return !namespaceURI || namespaceURI === NS_XHTML ? doc.createElement(name) : doc.createElementNS(namespaceURI, name);
}
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
      fromEl.setAttribute(name, "");
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
      if (parentName === "OPTGROUP") {
        parentNode = parentNode.parentNode;
        parentName = parentNode && parentNode.nodeName.toUpperCase();
      }
      if (parentName === "SELECT" && !parentNode.hasAttribute("multiple")) {
        if (fromEl.hasAttribute("selected") && !toEl.selected) {
          fromEl.setAttribute("selected", "selected");
          fromEl.removeAttribute("selected");
        }
        parentNode.selectedIndex = -1;
      }
    }
    syncBooleanAttrProp(fromEl, toEl, "selected");
  },
  /**
   * The "value" attribute is special for the <input> element since it sets
   * the initial value. Changing the "value" attribute without changing the
   * "value" property will have no effect since it is only used to the set the
   * initial value.  Similar for the "checked" attribute, and "disabled".
   */
  INPUT: function(fromEl, toEl) {
    syncBooleanAttrProp(fromEl, toEl, "checked");
    syncBooleanAttrProp(fromEl, toEl, "disabled");
    if (fromEl.value !== toEl.value) {
      fromEl.value = toEl.value;
    }
    if (!toEl.hasAttribute("value")) {
      fromEl.removeAttribute("value");
    }
  },
  TEXTAREA: function(fromEl, toEl) {
    var newValue = toEl.value;
    if (fromEl.value !== newValue) {
      fromEl.value = newValue;
    }
    var firstChild = fromEl.firstChild;
    if (firstChild) {
      var oldValue = firstChild.nodeValue;
      if (oldValue == newValue || !newValue && oldValue == fromEl.placeholder) {
        return;
      }
      firstChild.nodeValue = newValue;
    }
  },
  SELECT: function(fromEl, toEl) {
    if (!toEl.hasAttribute("multiple")) {
      var selectedIndex = -1;
      var i = 0;
      var curChild = fromEl.firstChild;
      var optgroup;
      var nodeName;
      while (curChild) {
        nodeName = curChild.nodeName && curChild.nodeName.toUpperCase();
        if (nodeName === "OPTGROUP") {
          optgroup = curChild;
          curChild = optgroup.firstChild;
          if (!curChild) {
            curChild = optgroup.nextSibling;
            optgroup = null;
          }
        } else {
          if (nodeName === "OPTION") {
            if (curChild.hasAttribute("selected")) {
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
function noop() {
}
function defaultGetNodeKey(node) {
  if (node) {
    return node.getAttribute && node.getAttribute("id") || node.id;
  }
}
function morphdomFactory(morphAttrs2) {
  return function morphdom2(fromNode, toNode, options) {
    if (!options) {
      options = {};
    }
    if (typeof toNode === "string") {
      if (fromNode.nodeName === "#document" || fromNode.nodeName === "HTML" || fromNode.nodeName === "BODY") {
        var toNodeHtml = toNode;
        toNode = doc.createElement("html");
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
    var addChild = options.addChild || function(parent, child) {
      return parent.appendChild(child);
    };
    var childrenOnly = options.childrenOnly === true;
    var fromNodesLookup = /* @__PURE__ */ Object.create(null);
    var keyedRemovalList = [];
    function addKeyedRemoval(key) {
      keyedRemovalList.push(key);
    }
    function walkDiscardedChildNodes(node, skipKeyedNodes) {
      if (node.nodeType === ELEMENT_NODE) {
        var curChild = node.firstChild;
        while (curChild) {
          var key = void 0;
          if (skipKeyedNodes && (key = getNodeKey(curChild))) {
            addKeyedRemoval(key);
          } else {
            onNodeDiscarded(curChild);
            if (curChild.firstChild) {
              walkDiscardedChildNodes(curChild, skipKeyedNodes);
            }
          }
          curChild = curChild.nextSibling;
        }
      }
    }
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
    function indexTree(node) {
      if (node.nodeType === ELEMENT_NODE || node.nodeType === DOCUMENT_FRAGMENT_NODE$1) {
        var curChild = node.firstChild;
        while (curChild) {
          var key = getNodeKey(curChild);
          if (key) {
            fromNodesLookup[key] = curChild;
          }
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
          if (unmatchedFromEl && compareNodeNames(curChild, unmatchedFromEl)) {
            curChild.parentNode.replaceChild(unmatchedFromEl, curChild);
            morphEl(unmatchedFromEl, curChild);
          } else {
            handleNodeAdded(curChild);
          }
        } else {
          handleNodeAdded(curChild);
        }
        curChild = nextSibling;
      }
    }
    function cleanupFromEl(fromEl, curFromNodeChild, curFromNodeKey) {
      while (curFromNodeChild) {
        var fromNextSibling = curFromNodeChild.nextSibling;
        if (curFromNodeKey = getNodeKey(curFromNodeChild)) {
          addKeyedRemoval(curFromNodeKey);
        } else {
          removeNode(
            curFromNodeChild,
            fromEl,
            true
            /* skip keyed nodes */
          );
        }
        curFromNodeChild = fromNextSibling;
      }
    }
    function morphEl(fromEl, toEl, childrenOnly2) {
      var toElKey = getNodeKey(toEl);
      if (toElKey) {
        delete fromNodesLookup[toElKey];
      }
      if (!childrenOnly2) {
        var beforeUpdateResult = onBeforeElUpdated(fromEl, toEl);
        if (beforeUpdateResult === false) {
          return;
        } else if (beforeUpdateResult instanceof HTMLElement) {
          fromEl = beforeUpdateResult;
          indexTree(fromEl);
        }
        morphAttrs2(fromEl, toEl);
        onElUpdated(fromEl);
        if (onBeforeElChildrenUpdated(fromEl, toEl) === false) {
          return;
        }
      }
      if (fromEl.nodeName !== "TEXTAREA") {
        morphChildren(fromEl, toEl);
      } else {
        specialElHandlers.TEXTAREA(fromEl, toEl);
      }
    }
    function morphChildren(fromEl, toEl) {
      var skipFrom = skipFromChildren(fromEl, toEl);
      var curToNodeChild = toEl.firstChild;
      var curFromNodeChild = fromEl.firstChild;
      var curToNodeKey;
      var curFromNodeKey;
      var fromNextSibling;
      var toNextSibling;
      var matchingFromEl;
      outer: while (curToNodeChild) {
        toNextSibling = curToNodeChild.nextSibling;
        curToNodeKey = getNodeKey(curToNodeChild);
        while (!skipFrom && curFromNodeChild) {
          fromNextSibling = curFromNodeChild.nextSibling;
          if (curToNodeChild.isSameNode && curToNodeChild.isSameNode(curFromNodeChild)) {
            curToNodeChild = toNextSibling;
            curFromNodeChild = fromNextSibling;
            continue outer;
          }
          curFromNodeKey = getNodeKey(curFromNodeChild);
          var curFromNodeType = curFromNodeChild.nodeType;
          var isCompatible = void 0;
          if (curFromNodeType === curToNodeChild.nodeType) {
            if (curFromNodeType === ELEMENT_NODE) {
              if (curToNodeKey) {
                if (curToNodeKey !== curFromNodeKey) {
                  if (matchingFromEl = fromNodesLookup[curToNodeKey]) {
                    if (fromNextSibling === matchingFromEl) {
                      isCompatible = false;
                    } else {
                      fromEl.insertBefore(matchingFromEl, curFromNodeChild);
                      if (curFromNodeKey) {
                        addKeyedRemoval(curFromNodeKey);
                      } else {
                        removeNode(
                          curFromNodeChild,
                          fromEl,
                          true
                          /* skip keyed nodes */
                        );
                      }
                      curFromNodeChild = matchingFromEl;
                      curFromNodeKey = getNodeKey(curFromNodeChild);
                    }
                  } else {
                    isCompatible = false;
                  }
                }
              } else if (curFromNodeKey) {
                isCompatible = false;
              }
              isCompatible = isCompatible !== false && compareNodeNames(curFromNodeChild, curToNodeChild);
              if (isCompatible) {
                morphEl(curFromNodeChild, curToNodeChild);
              }
            } else if (curFromNodeType === TEXT_NODE || curFromNodeType == COMMENT_NODE) {
              isCompatible = true;
              if (curFromNodeChild.nodeValue !== curToNodeChild.nodeValue) {
                curFromNodeChild.nodeValue = curToNodeChild.nodeValue;
              }
            }
          }
          if (isCompatible) {
            curToNodeChild = toNextSibling;
            curFromNodeChild = fromNextSibling;
            continue outer;
          }
          if (curFromNodeKey) {
            addKeyedRemoval(curFromNodeKey);
          } else {
            removeNode(
              curFromNodeChild,
              fromEl,
              true
              /* skip keyed nodes */
            );
          }
          curFromNodeChild = fromNextSibling;
        }
        if (curToNodeKey && (matchingFromEl = fromNodesLookup[curToNodeKey]) && compareNodeNames(matchingFromEl, curToNodeChild)) {
          if (!skipFrom) {
            addChild(fromEl, matchingFromEl);
          }
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
    }
    var morphedNode = fromNode;
    var morphedNodeType = morphedNode.nodeType;
    var toNodeType = toNode.nodeType;
    if (!childrenOnly) {
      if (morphedNodeType === ELEMENT_NODE) {
        if (toNodeType === ELEMENT_NODE) {
          if (!compareNodeNames(fromNode, toNode)) {
            onNodeDiscarded(fromNode);
            morphedNode = moveChildren(fromNode, createElementNS(toNode.nodeName, toNode.namespaceURI));
          }
        } else {
          morphedNode = toNode;
        }
      } else if (morphedNodeType === TEXT_NODE || morphedNodeType === COMMENT_NODE) {
        if (toNodeType === morphedNodeType) {
          if (morphedNode.nodeValue !== toNode.nodeValue) {
            morphedNode.nodeValue = toNode.nodeValue;
          }
          return morphedNode;
        } else {
          morphedNode = toNode;
        }
      }
    }
    if (morphedNode === toNode) {
      onNodeDiscarded(fromNode);
    } else {
      if (toNode.isSameNode && toNode.isSameNode(morphedNode)) {
        return;
      }
      morphEl(morphedNode, toNode, childrenOnly);
      if (keyedRemovalList) {
        for (var i = 0, len = keyedRemovalList.length; i < len; i++) {
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
      fromNode.parentNode.replaceChild(morphedNode, fromNode);
    }
    return morphedNode;
  };
}
var morphdom = morphdomFactory(morphAttrs);
let textarea;
const g = {
  scope: {}
};
const decodeHTML = (text) => {
  textarea = textarea || document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
};
const uuid = () => {
  return Math.random().toString(36).substring(2, 9);
};
const dup = (o) => {
  return JSON.parse(JSON.stringify(o));
};
const safe = (execute, val) => {
  try {
    const value = execute();
    return value !== void 0 && value !== null ? value : val || "";
  } catch (err) {
    return val || "";
  }
};
const topics = {};
const _async = {};
const publish = (name, params) => {
  _async[name] = isObject(params) ? Object.assign({}, _async[name], params) : params;
  if (topics[name]) {
    topics[name].forEach((topic) => topic(params));
  }
};
const subscribe = (name, method) => {
  topics[name] = topics[name] || [];
  topics[name].push(method);
  if (name in _async) {
    method(_async[name]);
  }
  return () => {
    topics[name] = topics[name].filter((fn) => fn != method);
  };
};
const isObject = (value) => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};
const Component = ({ name, module, dependencies, node, templates: templates2, signal, register: register2 }) => {
  var _a;
  let tick;
  let preserve = [];
  let observer = null;
  let observables = [];
  let effect = null;
  const _model = module.model || {};
  const initialState = new Function(`return ${node.getAttribute("html-model") || "{}"}`)();
  const tplid = node.getAttribute("tplid");
  const scopeid = node.getAttribute("html-scopeid");
  const tpl = templates2[tplid];
  const scope = g.scope[scopeid];
  const model = dup(((_a = module == null ? void 0 : module.model) == null ? void 0 : _a.apply) ? _model({ elm: node, initialState, dependencies }) : _model);
  const state = Object.assign({}, scope, model, initialState);
  const view = module.view ? module.view : (data) => data;
  const base = {
    name,
    model,
    elm: node,
    template: tpl.template,
    dependencies,
    publish,
    subscribe,
    main(fn) {
      node.addEventListener(":mount", fn);
    },
    effect(fn) {
      if (fn) {
        effect = fn;
      } else {
        return effect;
      }
    },
    query(selector) {
      const elements = Array.from(node.querySelectorAll(selector));
      return elements.map((element) => {
        return new Promise((resolve, reject) => {
          if (document.body.contains(element)) {
            element.addEventListener(":mount", () => resolve(element));
          } else {
            reject(element);
          }
        });
      });
    },
    /**
     * @State
     */
    state: {
      protected(list) {
        if (list) {
          preserve = list;
        } else {
          return preserve;
        }
      },
      save(data) {
        if (data.constructor === Function) {
          data(state);
        } else {
          Object.assign(state, data);
        }
      },
      set(data) {
        if (!document.body.contains(node)) {
          return;
        }
        if (data.constructor === Function) {
          data(state);
        } else {
          Object.assign(state, data);
        }
        const newstate = Object.assign({}, state, scope);
        return new Promise((resolve) => {
          render(newstate, () => resolve(newstate));
        });
      },
      get() {
        return Object.assign({}, state);
      }
    },
    dataset(target, name2) {
      const el = name2 ? target : node;
      const key = name2 ? name2 : target;
      const value = el.dataset[key];
      if (value === "true") return true;
      if (value === "false") return false;
      if (!isNaN(value) && value.trim() !== "") return Number(value);
      try {
        return new Function("return (" + value + ")")();
      } catch (e) {
      }
      try {
        return JSON.parse(value);
      } catch (e) {
      }
      return value;
    },
    /**
     * @Events
     */
    on(ev, selectorOrCallback, callback) {
      const attribute = ev.match(/\[(.*)\]/);
      if (attribute) {
        observables.push({
          target: callback ? selectorOrCallback : null,
          callback: callback || selectorOrCallback
        });
        if (!observer) {
          observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
              if (mutation.type === "attributes") {
                const attrname = mutation.attributeName;
                if (attrname === attribute[1]) {
                  observables.forEach((item) => {
                    const target = item.target ? node.querySelectorAll(item.target) : [node];
                    target.forEach((target2) => {
                      if (target2 == mutation.target) {
                        item.callback({
                          target: mutation.target,
                          attribute: attrname,
                          value: mutation.target.getAttribute(attrname)
                        });
                      }
                    });
                  });
                }
              }
            }
          });
          observer.observe(node, {
            attributes: true,
            subtree: true
          });
          node.addEventListener(":unmount", () => {
            observables = [];
            observer.disconnect();
          });
        }
        return;
      }
      if (callback) {
        callback.handler = (e) => {
          const detail = e.detail || {};
          let parent = e.target;
          while (parent) {
            if (parent.matches(selectorOrCallback)) {
              e.delegateTarget = parent;
              callback.apply(node, [e].concat(detail.args));
            }
            if (parent === node) break;
            parent = parent.parentNode;
          }
        };
        node.addEventListener(ev, callback.handler, {
          signal,
          capture: ev == "focus" || ev == "blur" || ev == "mouseenter" || ev == "mouseleave"
        });
      } else {
        selectorOrCallback.handler = (e) => {
          e.delegateTarget = node;
          selectorOrCallback.apply(node, [e].concat(e.detail.args));
        };
        node.addEventListener(ev, selectorOrCallback.handler, { signal });
      }
    },
    off(ev, callback) {
      if (callback.handler) {
        node.removeEventListener(ev, callback.handler);
      }
    },
    trigger(ev, selectorOrCallback, data = {}) {
      if (selectorOrCallback.constructor === String) {
        Array.from(node.querySelectorAll(selectorOrCallback)).forEach((children) => {
          children.dispatchEvent(new CustomEvent(ev, { bubbles: true, detail: { args: data } }));
        });
      } else {
        node.dispatchEvent(new CustomEvent(ev, { bubbles: true, detail: { args: data } }));
      }
    },
    emit(ev, data) {
      node.dispatchEvent(new CustomEvent(ev, { bubbles: true, detail: { args: data } }));
    },
    unmount(fn) {
      node.addEventListener(":unmount", fn);
    },
    innerHTML(target, html_) {
      const element = html_ ? target : node;
      const clone = element.cloneNode();
      const html = html_ ? html_ : target;
      clone.innerHTML = html;
      morphdom(element, clone);
    }
  };
  const render = (data, callback = (() => {
  })) => {
    clearTimeout(tick);
    tick = setTimeout(() => {
      const html = tpl.render.call(__spreadValues(__spreadValues({}, data), view(data)), node, safe, g);
      morphdom(node, html, morphOptions(node, register2));
      Promise.resolve().then(() => {
        node.querySelectorAll("[tplid]").forEach((element) => {
          const child = register2.get(element);
          const scope2 = __spreadValues({}, child.__scope__);
          if (!child) return;
          child.state.protected().forEach((key) => delete data[key]);
          const useEffect = child.effect();
          if (useEffect) {
            const promise = useEffect(data);
            if (promise && promise.then) {
              promise.then(() => child.state.set(__spreadValues(__spreadValues({}, data), scope2)));
            } else {
              child.state.set(__spreadValues(__spreadValues({}, data), scope2));
            }
          } else {
            child.state.set(__spreadValues(__spreadValues({}, data), scope2));
          }
        });
        Promise.resolve().then(() => {
          g.scope = {};
          callback();
        });
      });
    });
  };
  render(state);
  register2.set(node, base);
  return module.default(base);
};
const morphOptions = (parent, register2, data) => {
  return {
    getNodeKey(node) {
      if (node.nodeType === 1) {
        return node.id || node.getAttribute("key");
      }
    },
    onBeforeElUpdated: update(parent, register2),
    onBeforeChildElUpdated: update(parent, register2)
  };
};
const update = (parent, register2, data) => (node, newnode) => {
  if (node.nodeType === 1) {
    if ("html-static" in node.attributes) {
      return false;
    }
    if (register2.get(node) && node !== parent) {
      const scopeid = newnode.getAttribute("html-scopeid");
      const scope = g.scope[scopeid];
      const base = register2.get(node);
      base.__scope__ = scope;
      return false;
    }
  }
};
const register$1 = /* @__PURE__ */ new WeakMap();
const Element = ({ component, templates: templates2, start: start2 }) => {
  const { name, module, dependencies } = component;
  return class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.abortController = new AbortController();
      if (!this.getAttribute("tplid")) {
        start2(this.parentNode);
      }
      const rtrn = Component({
        node: this,
        name,
        module,
        dependencies,
        templates: templates2,
        signal: this.abortController.signal,
        register: register$1
      });
      if (rtrn && rtrn.constructor === Promise) {
        rtrn.then(() => {
          this.dispatchEvent(new CustomEvent(":mount"));
        });
      } else {
        this.dispatchEvent(new CustomEvent(":mount"));
      }
    }
    disconnectedCallback() {
      this.dispatchEvent(new CustomEvent(":unmount"));
      this.abortController.abort();
    }
  };
};
const config = {
  tags: ["{{", "}}"]
};
const templates = {};
const booleanAttrs = /html-(allowfullscreen|async|autofocus|autoplay|checked|controls|default|defer|disabled|formnovalidate|inert|ismap|itemscope|loop|multiple|muted|nomodule|novalidate|open|playsinline|readonly|required|reversed|selected)="(.*?)"/g;
const htmlAttr = /html-([^\s]*?)="(.*?)"/g;
const tagExpr = () => new RegExp(`\\${config.tags[0]}(.+?)\\${config.tags[1]}`, "g");
const templateConfig$1 = (newconfig) => {
  Object.assign(config, newconfig);
};
const template = (target, { components }) => {
  tagElements(target, [...Object.keys(components), "[html-if]", "template"], components);
  const clone = target.cloneNode(true);
  transformTemplate(clone);
  removeTemplateTagsRecursively(clone);
  setTemplates(clone, components);
  return templates;
};
const compile = (html) => {
  const parsedHtml = JSON.stringify(html);
  return new Function("$element", "safe", "$g", `
		var $data = this;
		with( $data ){
			var output=${parsedHtml.replace(/%%_=(.+?)_%%/g, function(_, variable) {
    return '"+safe(function(){return ' + decodeHTML(variable) + ';})+"';
  }).replace(/%%_(.+?)_%%/g, function(_, variable) {
    return '";' + decodeHTML(variable) + '\noutput+="';
  })};return output;
		}
	`);
};
const tagElements = (target, keys, components) => {
  const isComponent = (key) => key in components;
  const selector = keys.join(",");
  target.querySelectorAll(selector).forEach((node) => {
    if (node.localName === "template") {
      tagElements(node.content, keys, components);
      return;
    }
    if (isComponent(node.localName)) {
      node.setAttribute("tplid", uuid());
    }
  });
};
const transformAttributes = (html) => {
  return html.replace(/jails___scope-id/g, "%%_=$scopeid_%%").replace(tagExpr(), "%%_=$1_%%").replace(booleanAttrs, `%%_if(safe(function(){ return $2 })){_%%$1%%_}_%%`).replace(htmlAttr, (all, key, value) => {
    if (["model", "scopeid"].includes(key)) return all;
    if (value) {
      value = value.replace(/^{|}$/g, "");
      return `${key}="%%_=safe(function(){ return ${value} })_%%"`;
    }
    return all;
  });
};
const transformTemplate = (clone) => {
  clone.querySelectorAll("template, [html-for], [html-if], [html-inner], [html-class]").forEach((element) => {
    const htmlFor = element.getAttribute("html-for");
    const htmlIf = element.getAttribute("html-if");
    const htmlInner = element.getAttribute("html-inner");
    const htmlClass = element.getAttribute("html-class");
    if (htmlFor) {
      element.removeAttribute("html-for");
      const split = htmlFor.match(/(.*)\sin\s(.*)/) || "";
      const varname = split[1];
      const object = split[2];
      const objectname = object.split(/\./).shift();
      const open = document.createTextNode(`%%_ ;(function(){ var $index = 0; for(var $key in safe(function(){ return ${object} }) ){ var $scopeid = Math.random().toString(36).substring(2, 9); var ${varname} = ${object}[$key]; $g.scope[$scopeid] = Object.assign({}, { ${objectname}: ${objectname} }, { ${varname} :${varname}, $index: $index, $key: $key }); _%%`);
      const close = document.createTextNode(`%%_ $index++; } })() _%%`);
      wrap(open, element, close);
    }
    if (htmlIf) {
      element.removeAttribute("html-if");
      const open = document.createTextNode(`%%_ if ( safe(function(){ return ${htmlIf} }) ){ _%%`);
      const close = document.createTextNode(`%%_ }  _%%`);
      wrap(open, element, close);
    }
    if (htmlInner) {
      element.removeAttribute("html-inner");
      element.innerHTML = `%%_=${htmlInner}_%%`;
    }
    if (htmlClass) {
      element.removeAttribute("html-class");
      element.className = (element.className + ` %%_=${htmlClass}_%%`).trim();
    }
    if (element.localName === "template") {
      transformTemplate(element.content);
    }
  });
};
const setTemplates = (clone, components) => {
  Array.from(clone.querySelectorAll("[tplid]")).reverse().forEach((node) => {
    const tplid = node.getAttribute("tplid");
    const name = node.localName;
    node.setAttribute("html-scopeid", "jails___scope-id");
    if (name in components && components[name].module.template) {
      const children = node.innerHTML;
      const html2 = components[name].module.template({ elm: node, children });
      node.innerHTML = html2;
      transformTemplate(node);
      removeTemplateTagsRecursively(node);
    }
    const html = transformAttributes(node.outerHTML);
    templates[tplid] = {
      template: html,
      render: compile(html)
    };
  });
};
const removeTemplateTagsRecursively = (node) => {
  const templates2 = node.querySelectorAll("template");
  templates2.forEach((template2) => {
    if (template2.getAttribute("html-if") || template2.getAttribute("html-inner")) {
      return;
    }
    removeTemplateTagsRecursively(template2.content);
    const parent = template2.parentNode;
    if (parent) {
      const content = template2.content;
      while (content.firstChild) {
        parent.insertBefore(content.firstChild, template2);
      }
      parent.removeChild(template2);
    }
  });
};
const wrap = (open, node, close) => {
  var _a, _b;
  (_a = node.parentNode) == null ? void 0 : _a.insertBefore(open, node);
  (_b = node.parentNode) == null ? void 0 : _b.insertBefore(close, node.nextSibling);
};
const templateConfig = (options) => {
  templateConfig$1(options);
};
globalThis.__jails__ = globalThis.__jails__ || { components: {} };
const register = (name, module, dependencies) => {
  const { components } = globalThis.__jails__;
  components[name] = { name, module, dependencies };
};
const start = (target) => {
  if (typeof window === "undefined") {
    return;
  }
  target = target || document.body;
  const { components } = globalThis.__jails__;
  const templates2 = template(target, { components });
  Object.values(components).forEach(({ name, module, dependencies }) => {
    if (!customElements.get(name)) {
      customElements.define(name, Element({ component: { name, module, dependencies }, templates: templates2, start }));
    }
  });
};
export {
  publish,
  register,
  start,
  subscribe,
  templateConfig
};
//# sourceMappingURL=index.js.map
