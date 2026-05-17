# Rendering Model

Jails compiles existing DOM into render functions during `start(target?)`.

## Pipeline

1. `register()` stores component modules in `globalThis.__jails__.components`.
2. `start()` scans the target DOM for registered custom element names and `<template>`.
3. Matching component roots receive a generated `tplid`.
4. Directives are transformed into executable template markers.
5. Each component root becomes a compiled render function.
6. `customElements.define()` attaches a generated element class.
7. On connection, a component instance builds initial state and renders.
8. On `state.set()`, the render function returns new HTML.
9. `Idiomorph.morph()` reconciles the current component root with the rendered HTML.

## Deterministic Rules

- Rendering is scoped to the component root.
- The component module does not own a virtual DOM.
- Directive expressions run against render state with `with($data)`.
- Missing or throwing expressions resolve to an empty string through `safe()`.
- `view(state)` may add render-only values.
- Child components are protected from parent morphing.
- `html-static` nodes are skipped by morphing.

## Update Completion

`state.set()` returns a promise. The promise resolves after the scheduled render, DOM morph, child updates, scope cleanup, and queued callbacks.

