# Jails LLM Context

Jails is an HTML-first browser framework for enhancing already-rendered DOM with custom elements, delegated events, and declarative HTML directives.

## Philosophy

- HTML is the source of truth.
- Components enhance DOM that already exists.
- State updates re-render the component template and morph the DOM.
- Directives are machine contracts embedded in HTML.
- Browser primitives are preferred over framework abstractions.
- Component logic is explicit JavaScript.
- No virtual DOM is exposed to application code.
- Runtime behavior should remain local, predictable, and low-complexity.

## Core Primitives

- `register(name, module, dependencies?)`: registers a custom element module.
- `start(target?)`: scans `target || document.body`, compiles templates, and defines registered custom elements.
- `model`: exported object or function used to initialize component state.
- `view(state)`: optional exported function that derives render-only values.
- `template({ elm, children })`: optional exported function that embeds component HTML.
- `state.set(data | fn)`: mutates local state and schedules a DOM morph.
- `state.save(data | fn)`: mutates local state without rendering.
- `state.get()`: returns a shallow copy of current state.
- `on(event, selector?, callback)`: delegated event listener scoped to the component root.
- `emit(event, data)`: bubbling DOM `CustomEvent` from the component root.
- `publish` and `subscribe`: global pub/sub for components in separate DOM trees.
- `innerHTML(target?, html)`: morphs HTML into the component root or a target element.
- `unmount(fn)`: registers cleanup for component removal.

## Rendering

`start()` compiles component DOM into string render functions. Directives are transformed into JavaScript expressions. On state updates, Jails renders the current template with current state, optional view data, and loop scope data, then applies `Idiomorph.morph`.

The DOM is preserved where possible. Nodes marked with `html-static` are not morphed. Child Jails components are not morphed by the parent; instead the parent forwards non-protected state as props.

## Directives

- `html-if="expression"` conditionally includes an element.
- `html-for="item in items"` repeats an element and exposes `item`, `$index`, and `$key`.
- `html-inner="expression"` writes an expression into element HTML.
- `html-class="expression"` appends a computed class string.
- `html-model="{ ... }"` defines instance initial state on the component element.
- `html-static` excludes a node and descendants from DOM morphing.
- `html-*="expression"` maps to normal attributes after render, for example `html-src` to `src`.
- `html-scopeid` and `tplid` are internal runtime attributes.
- `<template>` hides dynamic markup before JavaScript runs and is unwrapped during template compilation unless it keeps conditional or inner behavior.

## State Flow

Initial state is composed as:

1. loop scope from parent template, if any
2. exported `model` or result of `model({ elm, initialState, dependencies })`
3. parsed `html-model`

`state.set()` updates state, renders, morphs DOM, forwards parent state to child components, clears transient loop scopes, then resolves its promise.

## Events

Use delegated events through `on()`. The event listener is attached to the custom element root. When a selector is used, Jails walks from `event.target` toward the root and sets `event.delegateTarget` to the matched element.

Use `emit()` for child-to-parent DOM communication. Use `publish()` and `subscribe()` for cross-tree communication. Always unsubscribe global subscriptions in `unmount()`.

## Preferred Patterns

- Keep HTML in the page, SSR output, or a `template()` function.
- Use data attributes such as `data-add` and `data-submit` as event hooks.
- Use `html-static` for DOM owned by third-party libraries or browser-managed form controls.
- Use `view()` for derived render values instead of storing formatting in state.
- Use `state.protected(['name'])` in child components when parent updates must not overwrite local state.
- Use `templateConfig({ tags: ['@{', '}'] })` when the backend template engine conflicts with `{{ }}`.

## Forbidden Patterns

- Do not treat Jails as a SPA router or virtual DOM framework.
- Do not mutate rendered DOM outside lifecycle without `html-static` or `innerHTML()`.
- Do not hide required state in globals.
- Do not write side effects in `view()` or directive expressions.
- Do not rely on random `html-scopeid` values.
- Do not use `html-model` with untrusted user input.

