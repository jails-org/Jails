const textarea = document.createElement("textarea");
const g = {
  scope: {}
};
const decodeHTML = (text) => {
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
    return execute();
  } catch (err) {
    return val || "";
  }
};
var Idiomorph = function() {
  const noOp = () => {
  };
  const defaults = {
    morphStyle: "outerHTML",
    callbacks: {
      beforeNodeAdded: noOp,
      afterNodeAdded: noOp,
      beforeNodeMorphed: noOp,
      afterNodeMorphed: noOp,
      beforeNodeRemoved: noOp,
      afterNodeRemoved: noOp,
      beforeAttributeUpdated: noOp
    },
    head: {
      style: "merge",
      shouldPreserve: (elt) => elt.getAttribute("im-preserve") === "true",
      shouldReAppend: (elt) => elt.getAttribute("im-re-append") === "true",
      shouldRemove: noOp,
      afterHeadMorphed: noOp
    },
    restoreFocus: true
  };
  function morph(oldNode, newContent, config2 = {}) {
    oldNode = normalizeElement(oldNode);
    const newNode = normalizeParent(newContent);
    const ctx = createMorphContext(oldNode, newNode, config2);
    const morphedNodes = saveAndRestoreFocus(ctx, () => {
      return withHeadBlocking(
        ctx,
        oldNode,
        newNode,
        /** @param {MorphContext} ctx */
        (ctx2) => {
          if (ctx2.morphStyle === "innerHTML") {
            morphChildren(ctx2, oldNode, newNode);
            return Array.from(oldNode.childNodes);
          } else {
            return morphOuterHTML(ctx2, oldNode, newNode);
          }
        }
      );
    });
    ctx.pantry.remove();
    return morphedNodes;
  }
  function morphOuterHTML(ctx, oldNode, newNode) {
    const oldParent = normalizeParent(oldNode);
    let childNodes = Array.from(oldParent.childNodes);
    const index = childNodes.indexOf(oldNode);
    const rightMargin = childNodes.length - (index + 1);
    morphChildren(
      ctx,
      oldParent,
      newNode,
      // these two optional params are the secret sauce
      oldNode,
      // start point for iteration
      oldNode.nextSibling
      // end point for iteration
    );
    childNodes = Array.from(oldParent.childNodes);
    return childNodes.slice(index, childNodes.length - rightMargin);
  }
  function saveAndRestoreFocus(ctx, fn) {
    var _a;
    if (!ctx.config.restoreFocus) return fn();
    let activeElement = (
      /** @type {HTMLInputElement|HTMLTextAreaElement|null} */
      document.activeElement
    );
    if (!(activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement)) {
      return fn();
    }
    const { id: activeElementId, selectionStart, selectionEnd } = activeElement;
    const results = fn();
    if (activeElementId && activeElementId !== ((_a = document.activeElement) == null ? void 0 : _a.id)) {
      activeElement = ctx.target.querySelector(`#${activeElementId}`);
      activeElement == null ? void 0 : activeElement.focus();
    }
    if (activeElement && !activeElement.selectionEnd && selectionEnd) {
      activeElement.setSelectionRange(selectionStart, selectionEnd);
    }
    return results;
  }
  const morphChildren = /* @__PURE__ */ function() {
    function morphChildren2(ctx, oldParent, newParent, insertionPoint = null, endPoint = null) {
      if (oldParent instanceof HTMLTemplateElement && newParent instanceof HTMLTemplateElement) {
        oldParent = oldParent.content;
        newParent = newParent.content;
      }
      insertionPoint || (insertionPoint = oldParent.firstChild);
      for (const newChild of newParent.childNodes) {
        if (insertionPoint && insertionPoint != endPoint) {
          const bestMatch = findBestMatch(
            ctx,
            newChild,
            insertionPoint,
            endPoint
          );
          if (bestMatch) {
            if (bestMatch !== insertionPoint) {
              removeNodesBetween(ctx, insertionPoint, bestMatch);
            }
            morphNode(bestMatch, newChild, ctx);
            insertionPoint = bestMatch.nextSibling;
            continue;
          }
        }
        if (newChild instanceof Element && ctx.persistentIds.has(newChild.id)) {
          const movedChild = moveBeforeById(
            oldParent,
            newChild.id,
            insertionPoint,
            ctx
          );
          morphNode(movedChild, newChild, ctx);
          insertionPoint = movedChild.nextSibling;
          continue;
        }
        const insertedNode = createNode(
          oldParent,
          newChild,
          insertionPoint,
          ctx
        );
        if (insertedNode) {
          insertionPoint = insertedNode.nextSibling;
        }
      }
      while (insertionPoint && insertionPoint != endPoint) {
        const tempNode = insertionPoint;
        insertionPoint = insertionPoint.nextSibling;
        removeNode(ctx, tempNode);
      }
    }
    function createNode(oldParent, newChild, insertionPoint, ctx) {
      if (ctx.callbacks.beforeNodeAdded(newChild) === false) return null;
      if (ctx.idMap.has(newChild)) {
        const newEmptyChild = document.createElement(
          /** @type {Element} */
          newChild.tagName
        );
        oldParent.insertBefore(newEmptyChild, insertionPoint);
        morphNode(newEmptyChild, newChild, ctx);
        ctx.callbacks.afterNodeAdded(newEmptyChild);
        return newEmptyChild;
      } else {
        const newClonedChild = document.importNode(newChild, true);
        oldParent.insertBefore(newClonedChild, insertionPoint);
        ctx.callbacks.afterNodeAdded(newClonedChild);
        return newClonedChild;
      }
    }
    const findBestMatch = /* @__PURE__ */ function() {
      function findBestMatch2(ctx, node, startPoint, endPoint) {
        let softMatch = null;
        let nextSibling = node.nextSibling;
        let siblingSoftMatchCount = 0;
        let cursor = startPoint;
        while (cursor && cursor != endPoint) {
          if (isSoftMatch(cursor, node)) {
            if (isIdSetMatch(ctx, cursor, node)) {
              return cursor;
            }
            if (softMatch === null) {
              if (!ctx.idMap.has(cursor)) {
                softMatch = cursor;
              }
            }
          }
          if (softMatch === null && nextSibling && isSoftMatch(cursor, nextSibling)) {
            siblingSoftMatchCount++;
            nextSibling = nextSibling.nextSibling;
            if (siblingSoftMatchCount >= 2) {
              softMatch = void 0;
            }
          }
          if (cursor.contains(document.activeElement)) break;
          cursor = cursor.nextSibling;
        }
        return softMatch || null;
      }
      function isIdSetMatch(ctx, oldNode, newNode) {
        let oldSet = ctx.idMap.get(oldNode);
        let newSet = ctx.idMap.get(newNode);
        if (!newSet || !oldSet) return false;
        for (const id of oldSet) {
          if (newSet.has(id)) {
            return true;
          }
        }
        return false;
      }
      function isSoftMatch(oldNode, newNode) {
        const oldElt = (
          /** @type {Element} */
          oldNode
        );
        const newElt = (
          /** @type {Element} */
          newNode
        );
        return oldElt.nodeType === newElt.nodeType && oldElt.tagName === newElt.tagName && // If oldElt has an `id` with possible state and it doesn't match newElt.id then avoid morphing.
        // We'll still match an anonymous node with an IDed newElt, though, because if it got this far,
        // its not persistent, and new nodes can't have any hidden state.
        (!oldElt.id || oldElt.id === newElt.id);
      }
      return findBestMatch2;
    }();
    function removeNode(ctx, node) {
      var _a;
      if (ctx.idMap.has(node)) {
        moveBefore(ctx.pantry, node, null);
      } else {
        if (ctx.callbacks.beforeNodeRemoved(node) === false) return;
        (_a = node.parentNode) == null ? void 0 : _a.removeChild(node);
        ctx.callbacks.afterNodeRemoved(node);
      }
    }
    function removeNodesBetween(ctx, startInclusive, endExclusive) {
      let cursor = startInclusive;
      while (cursor && cursor !== endExclusive) {
        let tempNode = (
          /** @type {Node} */
          cursor
        );
        cursor = cursor.nextSibling;
        removeNode(ctx, tempNode);
      }
      return cursor;
    }
    function moveBeforeById(parentNode, id, after, ctx) {
      const target = (
        /** @type {Element} - will always be found */
        ctx.target.querySelector(`#${id}`) || ctx.pantry.querySelector(`#${id}`)
      );
      removeElementFromAncestorsIdMaps(target, ctx);
      moveBefore(parentNode, target, after);
      return target;
    }
    function removeElementFromAncestorsIdMaps(element, ctx) {
      const id = element.id;
      while (element = element.parentNode) {
        let idSet = ctx.idMap.get(element);
        if (idSet) {
          idSet.delete(id);
          if (!idSet.size) {
            ctx.idMap.delete(element);
          }
        }
      }
    }
    function moveBefore(parentNode, element, after) {
      if (parentNode.moveBefore) {
        try {
          parentNode.moveBefore(element, after);
        } catch (e) {
          parentNode.insertBefore(element, after);
        }
      } else {
        parentNode.insertBefore(element, after);
      }
    }
    return morphChildren2;
  }();
  const morphNode = /* @__PURE__ */ function() {
    function morphNode2(oldNode, newContent, ctx) {
      if (ctx.ignoreActive && oldNode === document.activeElement) {
        return null;
      }
      if (ctx.callbacks.beforeNodeMorphed(oldNode, newContent) === false) {
        return oldNode;
      }
      if (oldNode instanceof HTMLHeadElement && ctx.head.ignore) ;
      else if (oldNode instanceof HTMLHeadElement && ctx.head.style !== "morph") {
        handleHeadElement(
          oldNode,
          /** @type {HTMLHeadElement} */
          newContent,
          ctx
        );
      } else {
        morphAttributes(oldNode, newContent, ctx);
        if (!ignoreValueOfActiveElement(oldNode, ctx)) {
          morphChildren(ctx, oldNode, newContent);
        }
      }
      ctx.callbacks.afterNodeMorphed(oldNode, newContent);
      return oldNode;
    }
    function morphAttributes(oldNode, newNode, ctx) {
      let type = newNode.nodeType;
      if (type === 1) {
        const oldElt = (
          /** @type {Element} */
          oldNode
        );
        const newElt = (
          /** @type {Element} */
          newNode
        );
        const oldAttributes = oldElt.attributes;
        const newAttributes = newElt.attributes;
        for (const newAttribute of newAttributes) {
          if (ignoreAttribute(newAttribute.name, oldElt, "update", ctx)) {
            continue;
          }
          if (oldElt.getAttribute(newAttribute.name) !== newAttribute.value) {
            oldElt.setAttribute(newAttribute.name, newAttribute.value);
          }
        }
        for (let i = oldAttributes.length - 1; 0 <= i; i--) {
          const oldAttribute = oldAttributes[i];
          if (!oldAttribute) continue;
          if (!newElt.hasAttribute(oldAttribute.name)) {
            if (ignoreAttribute(oldAttribute.name, oldElt, "remove", ctx)) {
              continue;
            }
            oldElt.removeAttribute(oldAttribute.name);
          }
        }
        if (!ignoreValueOfActiveElement(oldElt, ctx)) {
          syncInputValue(oldElt, newElt, ctx);
        }
      }
      if (type === 8 || type === 3) {
        if (oldNode.nodeValue !== newNode.nodeValue) {
          oldNode.nodeValue = newNode.nodeValue;
        }
      }
    }
    function syncInputValue(oldElement, newElement, ctx) {
      if (oldElement instanceof HTMLInputElement && newElement instanceof HTMLInputElement && newElement.type !== "file") {
        let newValue = newElement.value;
        let oldValue = oldElement.value;
        syncBooleanAttribute(oldElement, newElement, "checked", ctx);
        syncBooleanAttribute(oldElement, newElement, "disabled", ctx);
        if (!newElement.hasAttribute("value")) {
          if (!ignoreAttribute("value", oldElement, "remove", ctx)) {
            oldElement.value = "";
            oldElement.removeAttribute("value");
          }
        } else if (oldValue !== newValue) {
          if (!ignoreAttribute("value", oldElement, "update", ctx)) {
            oldElement.setAttribute("value", newValue);
            oldElement.value = newValue;
          }
        }
      } else if (oldElement instanceof HTMLOptionElement && newElement instanceof HTMLOptionElement) {
        syncBooleanAttribute(oldElement, newElement, "selected", ctx);
      } else if (oldElement instanceof HTMLTextAreaElement && newElement instanceof HTMLTextAreaElement) {
        let newValue = newElement.value;
        let oldValue = oldElement.value;
        if (ignoreAttribute("value", oldElement, "update", ctx)) {
          return;
        }
        if (newValue !== oldValue) {
          oldElement.value = newValue;
        }
        if (oldElement.firstChild && oldElement.firstChild.nodeValue !== newValue) {
          oldElement.firstChild.nodeValue = newValue;
        }
      }
    }
    function syncBooleanAttribute(oldElement, newElement, attributeName, ctx) {
      const newLiveValue = newElement[attributeName], oldLiveValue = oldElement[attributeName];
      if (newLiveValue !== oldLiveValue) {
        const ignoreUpdate = ignoreAttribute(
          attributeName,
          oldElement,
          "update",
          ctx
        );
        if (!ignoreUpdate) {
          oldElement[attributeName] = newElement[attributeName];
        }
        if (newLiveValue) {
          if (!ignoreUpdate) {
            oldElement.setAttribute(attributeName, "");
          }
        } else {
          if (!ignoreAttribute(attributeName, oldElement, "remove", ctx)) {
            oldElement.removeAttribute(attributeName);
          }
        }
      }
    }
    function ignoreAttribute(attr, element, updateType, ctx) {
      if (attr === "value" && ctx.ignoreActiveValue && element === document.activeElement) {
        return true;
      }
      return ctx.callbacks.beforeAttributeUpdated(attr, element, updateType) === false;
    }
    function ignoreValueOfActiveElement(possibleActiveElement, ctx) {
      return !!ctx.ignoreActiveValue && possibleActiveElement === document.activeElement && possibleActiveElement !== document.body;
    }
    return morphNode2;
  }();
  function withHeadBlocking(ctx, oldNode, newNode, callback) {
    if (ctx.head.block) {
      const oldHead = oldNode.querySelector("head");
      const newHead = newNode.querySelector("head");
      if (oldHead && newHead) {
        const promises = handleHeadElement(oldHead, newHead, ctx);
        return Promise.all(promises).then(() => {
          const newCtx = Object.assign(ctx, {
            head: {
              block: false,
              ignore: true
            }
          });
          return callback(newCtx);
        });
      }
    }
    return callback(ctx);
  }
  function handleHeadElement(oldHead, newHead, ctx) {
    let added = [];
    let removed = [];
    let preserved = [];
    let nodesToAppend = [];
    let srcToNewHeadNodes = /* @__PURE__ */ new Map();
    for (const newHeadChild of newHead.children) {
      srcToNewHeadNodes.set(newHeadChild.outerHTML, newHeadChild);
    }
    for (const currentHeadElt of oldHead.children) {
      let inNewContent = srcToNewHeadNodes.has(currentHeadElt.outerHTML);
      let isReAppended = ctx.head.shouldReAppend(currentHeadElt);
      let isPreserved = ctx.head.shouldPreserve(currentHeadElt);
      if (inNewContent || isPreserved) {
        if (isReAppended) {
          removed.push(currentHeadElt);
        } else {
          srcToNewHeadNodes.delete(currentHeadElt.outerHTML);
          preserved.push(currentHeadElt);
        }
      } else {
        if (ctx.head.style === "append") {
          if (isReAppended) {
            removed.push(currentHeadElt);
            nodesToAppend.push(currentHeadElt);
          }
        } else {
          if (ctx.head.shouldRemove(currentHeadElt) !== false) {
            removed.push(currentHeadElt);
          }
        }
      }
    }
    nodesToAppend.push(...srcToNewHeadNodes.values());
    let promises = [];
    for (const newNode of nodesToAppend) {
      let newElt = (
        /** @type {ChildNode} */
        document.createRange().createContextualFragment(newNode.outerHTML).firstChild
      );
      if (ctx.callbacks.beforeNodeAdded(newElt) !== false) {
        if ("href" in newElt && newElt.href || "src" in newElt && newElt.src) {
          let resolve;
          let promise = new Promise(function(_resolve) {
            resolve = _resolve;
          });
          newElt.addEventListener("load", function() {
            resolve();
          });
          promises.push(promise);
        }
        oldHead.appendChild(newElt);
        ctx.callbacks.afterNodeAdded(newElt);
        added.push(newElt);
      }
    }
    for (const removedElement of removed) {
      if (ctx.callbacks.beforeNodeRemoved(removedElement) !== false) {
        oldHead.removeChild(removedElement);
        ctx.callbacks.afterNodeRemoved(removedElement);
      }
    }
    ctx.head.afterHeadMorphed(oldHead, {
      added,
      kept: preserved,
      removed
    });
    return promises;
  }
  const createMorphContext = /* @__PURE__ */ function() {
    function createMorphContext2(oldNode, newContent, config2) {
      const { persistentIds, idMap } = createIdMaps(oldNode, newContent);
      const mergedConfig = mergeDefaults(config2);
      const morphStyle = mergedConfig.morphStyle || "outerHTML";
      if (!["innerHTML", "outerHTML"].includes(morphStyle)) {
        throw `Do not understand how to morph style ${morphStyle}`;
      }
      return {
        target: oldNode,
        newContent,
        config: mergedConfig,
        morphStyle,
        ignoreActive: mergedConfig.ignoreActive,
        ignoreActiveValue: mergedConfig.ignoreActiveValue,
        restoreFocus: mergedConfig.restoreFocus,
        idMap,
        persistentIds,
        pantry: createPantry(),
        callbacks: mergedConfig.callbacks,
        head: mergedConfig.head
      };
    }
    function mergeDefaults(config2) {
      let finalConfig = Object.assign({}, defaults);
      Object.assign(finalConfig, config2);
      finalConfig.callbacks = Object.assign(
        {},
        defaults.callbacks,
        config2.callbacks
      );
      finalConfig.head = Object.assign({}, defaults.head, config2.head);
      return finalConfig;
    }
    function createPantry() {
      const pantry = document.createElement("div");
      pantry.hidden = true;
      document.body.insertAdjacentElement("afterend", pantry);
      return pantry;
    }
    function findIdElements(root) {
      let elements = Array.from(root.querySelectorAll("[id]"));
      if (root.id) {
        elements.push(root);
      }
      return elements;
    }
    function populateIdMapWithTree(idMap, persistentIds, root, elements) {
      for (const elt of elements) {
        if (persistentIds.has(elt.id)) {
          let current = elt;
          while (current) {
            let idSet = idMap.get(current);
            if (idSet == null) {
              idSet = /* @__PURE__ */ new Set();
              idMap.set(current, idSet);
            }
            idSet.add(elt.id);
            if (current === root) break;
            current = current.parentElement;
          }
        }
      }
    }
    function createIdMaps(oldContent, newContent) {
      const oldIdElements = findIdElements(oldContent);
      const newIdElements = findIdElements(newContent);
      const persistentIds = createPersistentIds(oldIdElements, newIdElements);
      let idMap = /* @__PURE__ */ new Map();
      populateIdMapWithTree(idMap, persistentIds, oldContent, oldIdElements);
      const newRoot = newContent.__idiomorphRoot || newContent;
      populateIdMapWithTree(idMap, persistentIds, newRoot, newIdElements);
      return { persistentIds, idMap };
    }
    function createPersistentIds(oldIdElements, newIdElements) {
      let duplicateIds = /* @__PURE__ */ new Set();
      let oldIdTagNameMap = /* @__PURE__ */ new Map();
      for (const { id, tagName } of oldIdElements) {
        if (oldIdTagNameMap.has(id)) {
          duplicateIds.add(id);
        } else {
          oldIdTagNameMap.set(id, tagName);
        }
      }
      let persistentIds = /* @__PURE__ */ new Set();
      for (const { id, tagName } of newIdElements) {
        if (persistentIds.has(id)) {
          duplicateIds.add(id);
        } else if (oldIdTagNameMap.get(id) === tagName) {
          persistentIds.add(id);
        }
      }
      for (const id of duplicateIds) {
        persistentIds.delete(id);
      }
      return persistentIds;
    }
    return createMorphContext2;
  }();
  const { normalizeElement, normalizeParent } = /* @__PURE__ */ function() {
    const generatedByIdiomorph = /* @__PURE__ */ new WeakSet();
    function normalizeElement2(content) {
      if (content instanceof Document) {
        return content.documentElement;
      } else {
        return content;
      }
    }
    function normalizeParent2(newContent) {
      if (newContent == null) {
        return document.createElement("div");
      } else if (typeof newContent === "string") {
        return normalizeParent2(parseContent(newContent));
      } else if (generatedByIdiomorph.has(
        /** @type {Element} */
        newContent
      )) {
        return (
          /** @type {Element} */
          newContent
        );
      } else if (newContent instanceof Node) {
        if (newContent.parentNode) {
          return createDuckTypedParent(newContent);
        } else {
          const dummyParent = document.createElement("div");
          dummyParent.append(newContent);
          return dummyParent;
        }
      } else {
        const dummyParent = document.createElement("div");
        for (const elt of [...newContent]) {
          dummyParent.append(elt);
        }
        return dummyParent;
      }
    }
    function createDuckTypedParent(newContent) {
      return (
        /** @type {Element} */
        /** @type {unknown} */
        {
          childNodes: [newContent],
          /** @ts-ignore - cover your eyes for a minute, tsc */
          querySelectorAll: (s) => {
            const elements = newContent.querySelectorAll(s);
            return newContent.matches(s) ? [newContent, ...elements] : elements;
          },
          /** @ts-ignore */
          insertBefore: (n, r) => newContent.parentNode.insertBefore(n, r),
          /** @ts-ignore */
          moveBefore: (n, r) => newContent.parentNode.moveBefore(n, r),
          // for later use with populateIdMapWithTree to halt upwards iteration
          get __idiomorphRoot() {
            return newContent;
          }
        }
      );
    }
    function parseContent(newContent) {
      let parser = new DOMParser();
      let contentWithSvgsRemoved = newContent.replace(
        /<svg(\s[^>]*>|>)([\s\S]*?)<\/svg>/gim,
        ""
      );
      if (contentWithSvgsRemoved.match(/<\/html>/) || contentWithSvgsRemoved.match(/<\/head>/) || contentWithSvgsRemoved.match(/<\/body>/)) {
        let content = parser.parseFromString(newContent, "text/html");
        if (contentWithSvgsRemoved.match(/<\/html>/)) {
          generatedByIdiomorph.add(content);
          return content;
        } else {
          let htmlElement = content.firstChild;
          if (htmlElement) {
            generatedByIdiomorph.add(htmlElement);
          }
          return htmlElement;
        }
      } else {
        let responseDoc = parser.parseFromString(
          "<body><template>" + newContent + "</template></body>",
          "text/html"
        );
        let content = (
          /** @type {HTMLTemplateElement} */
          responseDoc.body.querySelector("template").content
        );
        generatedByIdiomorph.add(content);
        return content;
      }
    }
    return { normalizeElement: normalizeElement2, normalizeParent: normalizeParent2 };
  }();
  return {
    morph,
    defaults
  };
}();
const topics = {};
const _async = {};
const publish = (name, params) => {
  _async[name] = Object.assign({}, _async[name], params);
  if (topics[name])
    topics[name].forEach((topic) => topic(params));
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
const Component = ({ name, module, dependencies, node, templates: templates2, signal, register: register2 }) => {
  var _a;
  let tick;
  let preserve = [];
  const _model = module.model || {};
  const initialState = new Function(`return ${node.getAttribute("html-model") || "{}"}`)();
  const tplid = node.getAttribute("tplid");
  const scopeid = node.getAttribute("html-scopeid");
  const tpl = templates2[tplid];
  const scope = g.scope[scopeid];
  const model = dup(((_a = module == null ? void 0 : module.model) == null ? void 0 : _a.apply) ? _model({ elm: node, initialState }) : _model);
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
    /**
     * @Events
     */
    on(ev, selectorOrCallback, callback) {
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
    trigger(ev, selectorOrCallback, data) {
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
      Idiomorph.morph(element, clone);
    }
  };
  const render = (data, callback = () => {
  }) => {
    clearTimeout(tick);
    tick = setTimeout(() => {
      const html = tpl.render.call(view(data), node, safe, g);
      Idiomorph.morph(node, html, IdiomorphOptions(node, register2));
      Promise.resolve().then(() => {
        node.querySelectorAll("[tplid]").forEach((element) => {
          const child = register2.get(element);
          if (!child) return;
          child.state.protected().forEach((key) => delete data[key]);
          child.state.set(data);
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
const IdiomorphOptions = (parent, register2) => ({
  callbacks: {
    beforeNodeMorphed(node) {
      if (node.nodeType === 1) {
        if ("html-static" in node.attributes) {
          return false;
        }
        if (register2.get(node) && node !== parent) {
          return false;
        }
      }
    }
  }
});
const register$1 = /* @__PURE__ */ new WeakMap();
const Element$1 = ({ component, templates: templates2, start: start2 }) => {
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
const templates = {};
const config = {
  tags: ["{{", "}}"]
};
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
  target.querySelectorAll(keys.toString()).forEach((node) => {
    const name = node.localName;
    if (name === "template") {
      return tagElements(node.content, keys, components);
    }
    if (node.getAttribute("html-if") && !node.id) {
      node.id = uuid();
    }
    if (name in components) {
      node.setAttribute("tplid", uuid());
    }
  });
};
const transformAttributes = (html) => {
  const regexTags = new RegExp(`\\${config.tags[0]}(.+?)\\${config.tags[1]}`, "g");
  return html.replace(/jails___scope-id/g, "%%_=$scopeid_%%").replace(regexTags, "%%_=$1_%%").replace(/html-(allowfullscreen|async|autofocus|autoplay|checked|controls|default|defer|disabled|formnovalidate|inert|ismap|itemscope|loop|multiple|muted|nomodule|novalidate|open|playsinline|readonly|required|reversed|selected)=\"(.*?)\"/g, `%%_if(safe(function(){ return $2 })){_%%$1%%_}_%%`).replace(/html-(.*?)=\"(.*?)\"/g, (all, key, value) => {
    if (key === "key" || key === "model" || key === "scopeid") {
      return all;
    }
    if (value) {
      value = value.replace(/^{|}$/g, "");
      return `${key}="%%_=safe(function(){ return ${value} })_%%"`;
    } else {
      return all;
    }
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
window.__jails__ = window.__jails__ || { components: {} };
const register = (name, module, dependencies) => {
  const { components } = window.__jails__;
  components[name] = { name, module, dependencies };
};
const start = (target = document.body) => {
  const { components } = window.__jails__;
  const templates2 = template(target, { components });
  Object.values(components).forEach(({ name, module, dependencies }) => {
    if (!customElements.get(name)) {
      customElements.define(name, Element$1({ component: { name, module, dependencies }, templates: templates2, start }));
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
