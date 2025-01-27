const textarea = document.createElement("textarea");
const g = {
  scope: {}
};
const decodeHTML = (text) => {
  textarea.innerHTML = text;
  return textarea.value;
};
const rAF = (fn) => {
  if (requestAnimationFrame)
    return requestAnimationFrame(fn);
  else
    return setTimeout(fn, 1e3 / 60);
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
var Idiomorph = /* @__PURE__ */ function() {
  let EMPTY_SET = /* @__PURE__ */ new Set();
  let defaults = {
    morphStyle: "outerHTML",
    callbacks: {
      beforeNodeAdded: noOp,
      afterNodeAdded: noOp,
      beforeNodeMorphed: noOp,
      afterNodeMorphed: noOp,
      beforeNodeRemoved: noOp,
      afterNodeRemoved: noOp,
      beforeAttributeUpdated: noOp,
      beforeNodePantried: noOp
    },
    head: {
      style: "merge",
      shouldPreserve: function(elt) {
        return elt.getAttribute("im-preserve") === "true";
      },
      shouldReAppend: function(elt) {
        return elt.getAttribute("im-re-append") === "true";
      },
      shouldRemove: noOp,
      afterHeadMorphed: noOp
    }
  };
  function morph(oldNode, newContent, config2 = {}) {
    if (oldNode instanceof Document) {
      oldNode = oldNode.documentElement;
    }
    if (typeof newContent === "string") {
      newContent = parseContent(newContent);
    }
    let normalizedContent = normalizeContent(newContent);
    let ctx = createMorphContext(oldNode, normalizedContent, config2);
    return morphNormalizedContent(oldNode, normalizedContent, ctx);
  }
  function morphNormalizedContent(oldNode, normalizedNewContent, ctx) {
    var _a, _b;
    if (ctx.head.block) {
      let oldHead = oldNode.querySelector("head");
      let newHead = normalizedNewContent.querySelector("head");
      if (oldHead && newHead) {
        let promises = handleHeadElement(newHead, oldHead, ctx);
        Promise.all(promises).then(function() {
          morphNormalizedContent(
            oldNode,
            normalizedNewContent,
            Object.assign(ctx, {
              head: {
                block: false,
                ignore: true
              }
            })
          );
        });
        return;
      }
    }
    if (ctx.morphStyle === "innerHTML") {
      morphChildren(normalizedNewContent, oldNode, ctx);
      if (ctx.config.twoPass) {
        restoreFromPantry(oldNode, ctx);
      }
      return Array.from(oldNode.children);
    } else if (ctx.morphStyle === "outerHTML" || ctx.morphStyle == null) {
      let bestMatch = findBestNodeMatch(normalizedNewContent, oldNode, ctx);
      let previousSibling = (_a = bestMatch == null ? void 0 : bestMatch.previousSibling) != null ? _a : null;
      let nextSibling = (_b = bestMatch == null ? void 0 : bestMatch.nextSibling) != null ? _b : null;
      let morphedNode = morphOldNodeTo(oldNode, bestMatch, ctx);
      if (bestMatch) {
        if (morphedNode) {
          const elements = insertSiblings(
            previousSibling,
            morphedNode,
            nextSibling
          );
          if (ctx.config.twoPass) {
            restoreFromPantry(morphedNode.parentNode, ctx);
          }
          return elements;
        }
      } else {
        return [];
      }
    } else {
      throw "Do not understand how to morph style " + ctx.morphStyle;
    }
  }
  function ignoreValueOfActiveElement(possibleActiveElement, ctx) {
    return !!ctx.ignoreActiveValue && possibleActiveElement === document.activeElement && possibleActiveElement !== document.body;
  }
  function morphOldNodeTo(oldNode, newContent, ctx) {
    var _a, _b;
    if (ctx.ignoreActive && oldNode === document.activeElement) ;
    else if (newContent == null) {
      if (ctx.callbacks.beforeNodeRemoved(oldNode) === false) return oldNode;
      (_a = oldNode.parentNode) == null ? void 0 : _a.removeChild(oldNode);
      ctx.callbacks.afterNodeRemoved(oldNode);
      return null;
    } else if (!isSoftMatch(oldNode, newContent)) {
      if (ctx.callbacks.beforeNodeRemoved(oldNode) === false) return oldNode;
      if (ctx.callbacks.beforeNodeAdded(newContent) === false) return oldNode;
      (_b = oldNode.parentNode) == null ? void 0 : _b.replaceChild(newContent, oldNode);
      ctx.callbacks.afterNodeAdded(newContent);
      ctx.callbacks.afterNodeRemoved(oldNode);
      return newContent;
    } else {
      if (ctx.callbacks.beforeNodeMorphed(oldNode, newContent) === false)
        return oldNode;
      if (oldNode instanceof HTMLHeadElement && ctx.head.ignore) ;
      else if (oldNode instanceof HTMLHeadElement && ctx.head.style !== "morph") {
        handleHeadElement(
          /** @type {HTMLHeadElement} */
          newContent,
          oldNode,
          ctx
        );
      } else {
        syncNodeFrom(newContent, oldNode, ctx);
        if (!ignoreValueOfActiveElement(oldNode, ctx)) {
          morphChildren(newContent, oldNode, ctx);
        }
      }
      ctx.callbacks.afterNodeMorphed(oldNode, newContent);
      return oldNode;
    }
    return null;
  }
  function morphChildren(newParent, oldParent, ctx) {
    if (newParent instanceof HTMLTemplateElement && oldParent instanceof HTMLTemplateElement) {
      newParent = newParent.content;
      oldParent = oldParent.content;
    }
    let nextNewChild = newParent.firstChild;
    let insertionPoint = oldParent.firstChild;
    let newChild;
    while (nextNewChild) {
      newChild = nextNewChild;
      nextNewChild = newChild.nextSibling;
      if (insertionPoint == null) {
        if (ctx.config.twoPass && ctx.persistentIds.has(
          /** @type {Element} */
          newChild.id
        )) {
          oldParent.appendChild(newChild);
        } else {
          if (ctx.callbacks.beforeNodeAdded(newChild) === false) continue;
          oldParent.appendChild(newChild);
          ctx.callbacks.afterNodeAdded(newChild);
        }
        removeIdsFromConsideration(ctx, newChild);
        continue;
      }
      if (isIdSetMatch(newChild, insertionPoint, ctx)) {
        morphOldNodeTo(insertionPoint, newChild, ctx);
        insertionPoint = insertionPoint.nextSibling;
        removeIdsFromConsideration(ctx, newChild);
        continue;
      }
      let idSetMatch = findIdSetMatch(
        newParent,
        oldParent,
        newChild,
        insertionPoint,
        ctx
      );
      if (idSetMatch) {
        insertionPoint = removeNodesBetween(insertionPoint, idSetMatch, ctx);
        morphOldNodeTo(idSetMatch, newChild, ctx);
        removeIdsFromConsideration(ctx, newChild);
        continue;
      }
      let softMatch = findSoftMatch(
        newParent,
        oldParent,
        newChild,
        insertionPoint,
        ctx
      );
      if (softMatch) {
        insertionPoint = removeNodesBetween(insertionPoint, softMatch, ctx);
        morphOldNodeTo(softMatch, newChild, ctx);
        removeIdsFromConsideration(ctx, newChild);
        continue;
      }
      if (ctx.config.twoPass && ctx.persistentIds.has(
        /** @type {Element} */
        newChild.id
      )) {
        oldParent.insertBefore(newChild, insertionPoint);
      } else {
        if (ctx.callbacks.beforeNodeAdded(newChild) === false) continue;
        oldParent.insertBefore(newChild, insertionPoint);
        ctx.callbacks.afterNodeAdded(newChild);
      }
      removeIdsFromConsideration(ctx, newChild);
    }
    while (insertionPoint !== null) {
      let tempNode = insertionPoint;
      insertionPoint = insertionPoint.nextSibling;
      removeNode(tempNode, ctx);
    }
  }
  function ignoreAttribute(attr, to, updateType, ctx) {
    if (attr === "value" && ctx.ignoreActiveValue && to === document.activeElement) {
      return true;
    }
    return ctx.callbacks.beforeAttributeUpdated(attr, to, updateType) === false;
  }
  function syncNodeFrom(from, to, ctx) {
    let type = from.nodeType;
    if (type === 1) {
      const fromEl = (
        /** @type {Element} */
        from
      );
      const toEl = (
        /** @type {Element} */
        to
      );
      const fromAttributes = fromEl.attributes;
      const toAttributes = toEl.attributes;
      for (const fromAttribute of fromAttributes) {
        if (ignoreAttribute(fromAttribute.name, toEl, "update", ctx)) {
          continue;
        }
        if (toEl.getAttribute(fromAttribute.name) !== fromAttribute.value) {
          toEl.setAttribute(fromAttribute.name, fromAttribute.value);
        }
      }
      for (let i = toAttributes.length - 1; 0 <= i; i--) {
        const toAttribute = toAttributes[i];
        if (!toAttribute) continue;
        if (!fromEl.hasAttribute(toAttribute.name)) {
          if (ignoreAttribute(toAttribute.name, toEl, "remove", ctx)) {
            continue;
          }
          toEl.removeAttribute(toAttribute.name);
        }
      }
    }
    if (type === 8 || type === 3) {
      if (to.nodeValue !== from.nodeValue) {
        to.nodeValue = from.nodeValue;
      }
    }
    if (!ignoreValueOfActiveElement(to, ctx)) {
      syncInputValue(from, to, ctx);
    }
  }
  function syncBooleanAttribute(from, to, attributeName, ctx) {
    if (!(from instanceof Element && to instanceof Element)) return;
    const fromLiveValue = from[attributeName], toLiveValue = to[attributeName];
    if (fromLiveValue !== toLiveValue) {
      let ignoreUpdate = ignoreAttribute(attributeName, to, "update", ctx);
      if (!ignoreUpdate) {
        to[attributeName] = from[attributeName];
      }
      if (fromLiveValue) {
        if (!ignoreUpdate) {
          to.setAttribute(attributeName, fromLiveValue);
        }
      } else {
        if (!ignoreAttribute(attributeName, to, "remove", ctx)) {
          to.removeAttribute(attributeName);
        }
      }
    }
  }
  function syncInputValue(from, to, ctx) {
    if (from instanceof HTMLInputElement && to instanceof HTMLInputElement && from.type !== "file") {
      let fromValue = from.value;
      let toValue = to.value;
      syncBooleanAttribute(from, to, "checked", ctx);
      syncBooleanAttribute(from, to, "disabled", ctx);
      if (!from.hasAttribute("value")) {
        if (!ignoreAttribute("value", to, "remove", ctx)) {
          to.value = "";
          to.removeAttribute("value");
        }
      } else if (fromValue !== toValue) {
        if (!ignoreAttribute("value", to, "update", ctx)) {
          to.setAttribute("value", fromValue);
          to.value = fromValue;
        }
      }
    } else if (from instanceof HTMLOptionElement && to instanceof HTMLOptionElement) {
      syncBooleanAttribute(from, to, "selected", ctx);
    } else if (from instanceof HTMLTextAreaElement && to instanceof HTMLTextAreaElement) {
      let fromValue = from.value;
      let toValue = to.value;
      if (ignoreAttribute("value", to, "update", ctx)) {
        return;
      }
      if (fromValue !== toValue) {
        to.value = fromValue;
      }
      if (to.firstChild && to.firstChild.nodeValue !== fromValue) {
        to.firstChild.nodeValue = fromValue;
      }
    }
  }
  function handleHeadElement(newHeadTag, currentHead, ctx) {
    let added = [];
    let removed = [];
    let preserved = [];
    let nodesToAppend = [];
    let headMergeStyle = ctx.head.style;
    let srcToNewHeadNodes = /* @__PURE__ */ new Map();
    for (const newHeadChild of newHeadTag.children) {
      srcToNewHeadNodes.set(newHeadChild.outerHTML, newHeadChild);
    }
    for (const currentHeadElt of currentHead.children) {
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
        if (headMergeStyle === "append") {
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
        currentHead.appendChild(newElt);
        ctx.callbacks.afterNodeAdded(newElt);
        added.push(newElt);
      }
    }
    for (const removedElement of removed) {
      if (ctx.callbacks.beforeNodeRemoved(removedElement) !== false) {
        currentHead.removeChild(removedElement);
        ctx.callbacks.afterNodeRemoved(removedElement);
      }
    }
    ctx.head.afterHeadMorphed(currentHead, {
      added,
      kept: preserved,
      removed
    });
    return promises;
  }
  function noOp() {
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
  function createMorphContext(oldNode, newContent, config2) {
    const mergedConfig = mergeDefaults(config2);
    return {
      target: oldNode,
      newContent,
      config: mergedConfig,
      morphStyle: mergedConfig.morphStyle,
      ignoreActive: mergedConfig.ignoreActive,
      ignoreActiveValue: mergedConfig.ignoreActiveValue,
      idMap: createIdMap(oldNode, newContent),
      deadIds: /* @__PURE__ */ new Set(),
      persistentIds: mergedConfig.twoPass ? createPersistentIds(oldNode, newContent) : /* @__PURE__ */ new Set(),
      pantry: mergedConfig.twoPass ? createPantry() : document.createElement("div"),
      callbacks: mergedConfig.callbacks,
      head: mergedConfig.head
    };
  }
  function createPantry() {
    const pantry = document.createElement("div");
    pantry.hidden = true;
    document.body.insertAdjacentElement("afterend", pantry);
    return pantry;
  }
  function isIdSetMatch(node1, node2, ctx) {
    if (node1 == null || node2 == null) {
      return false;
    }
    if (node1 instanceof Element && node2 instanceof Element && node1.tagName === node2.tagName) {
      if (node1.id !== "" && node1.id === node2.id) {
        return true;
      } else {
        return getIdIntersectionCount(ctx, node1, node2) > 0;
      }
    }
    return false;
  }
  function isSoftMatch(oldNode, newNode) {
    if (oldNode == null || newNode == null) {
      return false;
    }
    if (
      /** @type {Element} */
      oldNode.id && /** @type {Element} */
      oldNode.id !== /** @type {Element} */
      newNode.id
    ) {
      return false;
    }
    return oldNode.nodeType === newNode.nodeType && /** @type {Element} */
    oldNode.tagName === /** @type {Element} */
    newNode.tagName;
  }
  function removeNodesBetween(startInclusive, endExclusive, ctx) {
    let cursor = startInclusive;
    while (cursor !== endExclusive) {
      let tempNode = (
        /** @type {Node} */
        cursor
      );
      cursor = tempNode.nextSibling;
      removeNode(tempNode, ctx);
    }
    removeIdsFromConsideration(ctx, endExclusive);
    return endExclusive.nextSibling;
  }
  function findIdSetMatch(newContent, oldParent, newChild, insertionPoint, ctx) {
    let newChildPotentialIdCount = getIdIntersectionCount(
      ctx,
      newChild,
      oldParent
    );
    let potentialMatch = null;
    if (newChildPotentialIdCount > 0) {
      potentialMatch = insertionPoint;
      let otherMatchCount = 0;
      while (potentialMatch != null) {
        if (isIdSetMatch(newChild, potentialMatch, ctx)) {
          return potentialMatch;
        }
        otherMatchCount += getIdIntersectionCount(
          ctx,
          potentialMatch,
          newContent
        );
        if (otherMatchCount > newChildPotentialIdCount) {
          return null;
        }
        potentialMatch = potentialMatch.nextSibling;
      }
    }
    return potentialMatch;
  }
  function findSoftMatch(newContent, oldParent, newChild, insertionPoint, ctx) {
    let potentialSoftMatch = insertionPoint;
    let nextSibling = newChild.nextSibling;
    let siblingSoftMatchCount = 0;
    while (potentialSoftMatch != null) {
      if (getIdIntersectionCount(ctx, potentialSoftMatch, newContent) > 0) {
        return null;
      }
      if (isSoftMatch(potentialSoftMatch, newChild)) {
        return potentialSoftMatch;
      }
      if (isSoftMatch(potentialSoftMatch, nextSibling)) {
        siblingSoftMatchCount++;
        nextSibling = /** @type {Node} */
        nextSibling.nextSibling;
        if (siblingSoftMatchCount >= 2) {
          return null;
        }
      }
      potentialSoftMatch = potentialSoftMatch.nextSibling;
    }
    return potentialSoftMatch;
  }
  const generatedByIdiomorph = /* @__PURE__ */ new WeakSet();
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
          return htmlElement;
        } else {
          return null;
        }
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
  function normalizeContent(newContent) {
    if (newContent == null) {
      const dummyParent = document.createElement("div");
      return dummyParent;
    } else if (generatedByIdiomorph.has(
      /** @type {Element} */
      newContent
    )) {
      return (
        /** @type {Element} */
        newContent
      );
    } else if (newContent instanceof Node) {
      const dummyParent = document.createElement("div");
      dummyParent.append(newContent);
      return dummyParent;
    } else {
      const dummyParent = document.createElement("div");
      for (const elt of [...newContent]) {
        dummyParent.append(elt);
      }
      return dummyParent;
    }
  }
  function insertSiblings(previousSibling, morphedNode, nextSibling) {
    var _a, _b;
    let stack = [];
    let added = [];
    while (previousSibling != null) {
      stack.push(previousSibling);
      previousSibling = previousSibling.previousSibling;
    }
    let node = stack.pop();
    while (node !== void 0) {
      added.push(node);
      (_a = morphedNode.parentElement) == null ? void 0 : _a.insertBefore(node, morphedNode);
      node = stack.pop();
    }
    added.push(morphedNode);
    while (nextSibling != null) {
      stack.push(nextSibling);
      added.push(nextSibling);
      nextSibling = nextSibling.nextSibling;
    }
    while (stack.length > 0) {
      const node2 = (
        /** @type {Node} */
        stack.pop()
      );
      (_b = morphedNode.parentElement) == null ? void 0 : _b.insertBefore(node2, morphedNode.nextSibling);
    }
    return added;
  }
  function findBestNodeMatch(newContent, oldNode, ctx) {
    let currentElement;
    currentElement = newContent.firstChild;
    let bestElement = currentElement;
    let score = 0;
    while (currentElement) {
      let newScore = scoreElement(currentElement, oldNode, ctx);
      if (newScore > score) {
        bestElement = currentElement;
        score = newScore;
      }
      currentElement = currentElement.nextSibling;
    }
    return bestElement;
  }
  function scoreElement(node1, node2, ctx) {
    if (isSoftMatch(node2, node1)) {
      return 0.5 + getIdIntersectionCount(
        ctx,
        /** @type {Node} */
        node1,
        node2
      );
    }
    return 0;
  }
  function removeNode(tempNode, ctx) {
    var _a;
    removeIdsFromConsideration(ctx, tempNode);
    if (ctx.config.twoPass && hasPersistentIdNodes(ctx, tempNode) && tempNode instanceof Element) {
      moveToPantry(tempNode, ctx);
    } else {
      if (ctx.callbacks.beforeNodeRemoved(tempNode) === false) return;
      (_a = tempNode.parentNode) == null ? void 0 : _a.removeChild(tempNode);
      ctx.callbacks.afterNodeRemoved(tempNode);
    }
  }
  function moveToPantry(node, ctx) {
    var _a;
    if (ctx.callbacks.beforeNodePantried(node) === false) return;
    Array.from(node.childNodes).forEach((child) => {
      moveToPantry(child, ctx);
    });
    if (ctx.persistentIds.has(
      /** @type {Element} */
      node.id
    )) {
      if (ctx.pantry.moveBefore) {
        ctx.pantry.moveBefore(node, null);
      } else {
        ctx.pantry.insertBefore(node, null);
      }
    } else {
      if (ctx.callbacks.beforeNodeRemoved(node) === false) return;
      (_a = node.parentNode) == null ? void 0 : _a.removeChild(node);
      ctx.callbacks.afterNodeRemoved(node);
    }
  }
  function restoreFromPantry(root, ctx) {
    if (root instanceof Element) {
      Array.from(ctx.pantry.children).reverse().forEach((element) => {
        var _a;
        const matchElement = root.querySelector(`#${element.id}`);
        if (matchElement) {
          if ((_a = matchElement.parentElement) == null ? void 0 : _a.moveBefore) {
            matchElement.parentElement.moveBefore(element, matchElement);
            while (matchElement.hasChildNodes()) {
              element.moveBefore(matchElement.firstChild, null);
            }
          } else {
            matchElement.before(element);
            while (matchElement.firstChild) {
              element.insertBefore(matchElement.firstChild, null);
            }
          }
          if (ctx.callbacks.beforeNodeMorphed(element, matchElement) !== false) {
            syncNodeFrom(matchElement, element, ctx);
            ctx.callbacks.afterNodeMorphed(element, matchElement);
          }
          matchElement.remove();
        }
      });
      ctx.pantry.remove();
    }
  }
  function isIdInConsideration(ctx, id) {
    return !ctx.deadIds.has(id);
  }
  function idIsWithinNode(ctx, id, targetNode) {
    let idSet = ctx.idMap.get(targetNode) || EMPTY_SET;
    return idSet.has(id);
  }
  function removeIdsFromConsideration(ctx, node) {
    let idSet = ctx.idMap.get(node) || EMPTY_SET;
    for (const id of idSet) {
      ctx.deadIds.add(id);
    }
  }
  function hasPersistentIdNodes(ctx, node) {
    for (const id of ctx.idMap.get(node) || EMPTY_SET) {
      if (ctx.persistentIds.has(id)) {
        return true;
      }
    }
    return false;
  }
  function getIdIntersectionCount(ctx, node1, node2) {
    let sourceSet = ctx.idMap.get(node1) || EMPTY_SET;
    let matchCount = 0;
    for (const id of sourceSet) {
      if (isIdInConsideration(ctx, id) && idIsWithinNode(ctx, id, node2)) {
        ++matchCount;
      }
    }
    return matchCount;
  }
  function nodesWithIds(content) {
    let nodes = Array.from(content.querySelectorAll("[id]"));
    if (content.id) {
      nodes.push(content);
    }
    return nodes;
  }
  function populateIdMapForNode(node, idMap) {
    let nodeParent = node.parentElement;
    for (const elt of nodesWithIds(node)) {
      let current = elt;
      while (current !== nodeParent && current != null) {
        let idSet = idMap.get(current);
        if (idSet == null) {
          idSet = /* @__PURE__ */ new Set();
          idMap.set(current, idSet);
        }
        idSet.add(elt.id);
        current = current.parentElement;
      }
    }
  }
  function createIdMap(oldContent, newContent) {
    let idMap = /* @__PURE__ */ new Map();
    populateIdMapForNode(oldContent, idMap);
    populateIdMapForNode(newContent, idMap);
    return idMap;
  }
  function createPersistentIds(oldContent, newContent) {
    const toIdTagName = (node) => node.tagName + "#" + node.id;
    const oldIdSet = new Set(nodesWithIds(oldContent).map(toIdTagName));
    let matchIdSet = /* @__PURE__ */ new Set();
    for (const newNode of nodesWithIds(newContent)) {
      if (oldIdSet.has(toIdTagName(newNode))) {
        matchIdSet.add(newNode.id);
      }
    }
    return matchIdSet;
  }
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
const Component = ({ name, module, dependencies, node, templates: templates2, signal }) => {
  var _a;
  const _model = module.model || {};
  const initialState = new Function(`return ${node.getAttribute("html-model") || "{}"}`)();
  const tplid = node.getAttribute("tplid");
  const scopeid = node.getAttribute("html-scopeid");
  const tpl = templates2[tplid];
  const scope = g.scope[scopeid];
  const model = dup(((_a = module == null ? void 0 : module.model) == null ? void 0 : _a.apply) ? _model({ elm: node, initialState }) : _model);
  const state = Object.assign({}, scope, model, initialState);
  const view = module.view ? module.view : (data) => data;
  let preserve = [];
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
        render(newstate);
        return Promise.resolve(newstate);
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
      rAF((_) => Idiomorph.morph(element, clone, IdiomorphOptions));
    }
  };
  const render = (data) => {
    const html = tpl.render.call(view(data), node, safe, g);
    Idiomorph.morph(node, html, IdiomorphOptions(node));
    rAF(() => {
      node.querySelectorAll("[tplid]").forEach((element) => {
        if (!element.base) return;
        element.base.state.protected().forEach((key) => delete data[key]);
        element.base.state.set(data);
      });
      rAF(() => g.scope = {});
    });
  };
  node.base = base;
  return module.default(base);
};
const IdiomorphOptions = (parent) => ({
  callbacks: {
    beforeNodeMorphed(node) {
      if (node.nodeType === 1) {
        if ("html-static" in node.attributes) {
          return false;
        }
        if (node.base && node !== parent) {
          return false;
        }
      }
    }
  }
});
const Element$1 = ({ component, templates: templates2, start: start2 }) => {
  const { name, module, dependencies } = component;
  const abortController = new AbortController();
  return class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      if (!this.getAttribute("tplid")) {
        start2(this.parentNode);
      }
      const rtrn = Component({
        node: this,
        name,
        module,
        dependencies,
        templates: templates2,
        signal: abortController.signal
      });
      if (rtrn && rtrn.constructor === Promise) {
        rtrn.then(() => this.dispatchEvent(new CustomEvent(":mount")));
      } else {
        this.dispatchEvent(new CustomEvent(":mount"));
      }
      this.base.state.set({});
    }
    disconnectedCallback() {
      this.dispatchEvent(new CustomEvent(":unmount"));
      abortController.abort();
      delete this.base;
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
const template = (target, { components: components2 }) => {
  tagElements(target, [...Object.keys(components2), "template"]);
  const clone = target.cloneNode(true);
  transformTemplate(clone);
  removeTemplateTagsRecursively(clone);
  setTemplates(clone, components2);
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
const tagElements = (target, keys) => {
  target.querySelectorAll(keys.toString()).forEach((node) => {
    if (node.localName === "template") {
      return tagElements(node.content, keys);
    }
    node.setAttribute("tplid", uuid());
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
      const close = document.createTextNode(`%%_ } _%%`);
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
const setTemplates = (clone, components2) => {
  Array.from(clone.querySelectorAll("[tplid]")).reverse().forEach((node) => {
    const tplid = node.getAttribute("tplid");
    const name = node.localName;
    node.setAttribute("html-scopeid", "jails___scope-id");
    if (name in components2 && components2[name].module.template) {
      const children = node.innerHTML;
      const html2 = components2[name].module.template({ elm: node, children });
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
const components = {};
const templateConfig = (options) => {
  templateConfig$1(options);
};
const register = (name, module, dependencies) => {
  components[name] = { name, module, dependencies };
};
const start = (target = document.body) => {
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
