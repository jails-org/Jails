# Jails Overview

Jails is a client-side JavaScript framework for attaching behavior to existing HTML custom elements. A Jails component is an ES module registered against a custom element name. When `start()` runs, Jails scans a target DOM tree, finds registered component elements, creates one component instance per element, initializes local state from the component `model` and optional `html-model`, evaluates template directives, and binds component-scoped helpers.

Jails is optimized for progressively enhanced HTML. The default assumption is that the server, static generator, CMS, or application template engine owns first paint. Jails then enhances specific islands of interactivity instead of owning the whole document as a single application tree.

## Philosophy

- HTML is the primary data source for UI structure.
- JavaScript modules provide behavior, state transitions, event handling, and optional embedded templates.
- Components are custom elements enhanced by Jails, not necessarily shadow-DOM web components.
- Rendering is directive-driven: the DOM declares which state values affect which nodes or attributes.
- Event handling is delegated from the component root, so child DOM can be replaced without rebinding every child listener.
- Static regions can be excluded from diffing with `html-static` when the browser or a third-party library must own that subtree.

## Rendering Philosophy

Jails updates existing DOM through directives and mustache expressions. The template system evaluates expressions against the component view scope. State changes through `state.set()` schedule DOM updates and return a Promise that resolves after the update cycle.

The rendering boundary is the component element. Parent state updates can flow into child component props unless a child protects specific properties with `state.protected()`. `html-static` creates a sub-boundary inside a component: Jails does not diff that node or its children after it is marked static.

## Performance Philosophy

- Render only islands that need client-side behavior.
- Keep first paint server-rendered or static when possible.
- Use event delegation to reduce listener count.
- Use `html-static` to avoid diffing immutable or externally mutated regions.
- Keep directive expressions cheap because they execute during template updates.
- Avoid deeply nested reactive loops because `html-for` creates repeated DOM work.

## Core Primitives

- `register(name, module, dependencies?)`: associate a custom element name with a component module.
- `start(target?)`: scan and bootstrap registered elements in `target` or `document.body`.
- Component controller: default export function receiving helpers.
- `model`: required exported object or function that initializes local state.
- `view`: optional exported function that derives render-only values from state.
- `template`: optional exported function that returns embedded HTML.
- Directives: `html-if`, `html-for`, `html-inner`, `html-model`, `html-*`, `html-static`, and native `<template>`.
- Helpers: `main`, `elm`, `dataset`, `query`, `dependencies`, `innerHTML`, `state`, `on`, `off`, `emit`, `trigger`, `publish`, `subscribe`, `effect`, `unmount`.

## Mental Model

Treat each Jails component as a DOM island with local state and delegated events. The HTML declares render dependencies; the controller declares lifecycle and behavior. State changes drive directive updates. DOM nodes inside `html-static` are owned by the browser or external libraries. Parent-child communication uses prop updates, DOM events, or global pub/sub depending on distance and direction.

