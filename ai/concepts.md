# Jails Concepts

## Component

Definition: a JavaScript module registered to a custom element tag.

Purpose: attach behavior, local state, lifecycle callbacks, event delegation, optional rendering transforms, and optional embedded HTML to each matching DOM element.

Lifecycle:

1. `register()` stores the module under a custom element name.
2. `start()` scans for matching elements.
3. Jails creates one controller instance for each element.
4. `model` initializes state. If `html-model` exists, it contributes initial state and may override model properties.
5. Optional `template` may generate embedded HTML.
6. `main()` callbacks run after mount.
7. `state.set()` updates state and refreshes affected template output.
8. `unmount()` callbacks run when the component element is detached.

Responsibilities: own behavior for its element, register component-scoped listeners, update local state, and keep side effects outside template expressions.

Limitations: component code should not assume it owns the whole page. Child components can receive parent props unless protected. The current repository documents behavior but does not include runtime source, so low-level diff details are inferred from docs.

Example:

```ts
import type { Component, Model } from 'jails-js'

export default function appCounter({ main, on, state }: Component) {
  main(() => {
    on('click', '[data-add]', add)
  })

  const add = () => {
    state.set(s => {
      s.counter += 1
    })
  }
}

export const model: Model = {
  counter: 0
}
```

Anti-patterns: relying on global DOM selectors for component internals, mutating DOM that Jails also owns, embedding expensive computations in directives.

## Model

Definition: required export that initializes component state.

Purpose: provide deterministic state shape and document local state ownership.

Lifecycle: read during component bootstrap before render updates. A function model receives `{ elm, initialState, dependencies }`.

Responsibilities: initialize state from defaults, `data-*` attributes, dependencies, or `html-model`.

Limitations: do not fetch remote data inside the model; use controller lifecycle for asynchronous work.

Example:

```ts
export const model = ({ elm }) => ({
  counter: Number(elm.dataset.counter || 0)
})
```

Anti-patterns: using undeclared state keys later in the controller, hiding business side effects in model construction.

## View

Definition: optional export that maps state to render scope.

Purpose: derive template-only values without storing them in component state.

Lifecycle: evaluated when state is rendered. The returned object is the scope used by directives and mustache expressions.

Responsibilities: format values, derive booleans/classes/labels, keep templates simple.

Limitations: should be pure. Do not mutate state or perform I/O.

Example:

```ts
export const view = state => ({
  ...state,
  counterClass: state.counter > 10 ? 'bigger' : ''
})
```

Anti-patterns: side effects in `view`, expensive sorting/filtering on every update without caching or precomputing in state transitions.

## Template

Definition: optional export that returns an HTML string for the component.

Purpose: distribute fully featured web components with embedded markup, or share SSR template functions separately.

Lifecycle: runs during component setup before directive processing.

Responsibilities: return deterministic HTML, preserve `children` when component users provide slotted-like content, use `html` and `attributes` helpers for template strings.

Limitations: template output is string HTML. It should not perform runtime side effects.

Example:

```ts
import { html, attributes } from 'jails-js/html'

export const template = ({ children }) => html`
  <section ${attributes({ title: 'Counter' })}>
    ${children}
    <p>Counter: {{ counter }}</p>
    <button data-add>+</button>
  </section>
`
```

Anti-patterns: giant embedded templates with mixed business logic, omitting `${children}` when the component API expects consumer content.

## Directives

Definition: HTML attributes interpreted by Jails during rendering.

Purpose: declaratively bind state expressions to nodes, attributes, loops, conditions, and static boundaries.

Lifecycle: parsed from component HTML and evaluated during initial render and later state updates.

Responsibilities: keep render behavior visible in markup.

Limitations: directive values are JavaScript expressions. They should be deterministic and cheap.

Example:

```html
<p html-if="isVisible">Visible</p>
<span html-inner="counter">0</span>
<img html-src="imageUrl" alt="">
```

Anti-patterns: network calls in expressions, large inline computations, depending on browser-visible `html-*` attributes after Jails strips them.

## Rendering

Definition: the process of evaluating the current view scope into DOM changes.

Purpose: update only the component DOM declared by directives and mustache expressions.

Lifecycle: initial render during mount, subsequent renders after `state.set()` or parent prop updates.

Responsibilities: preserve component boundaries, evaluate conditions/loops/attributes/text, skip static nodes.

Limitations: exact diff algorithm is not present in this repository. Docs explicitly state `innerHTML()` uses DOM diffing and `html-static` skips virtual DOM updates for the marked node and children.

Example:

```ts
state.set({ isVisible: false }).then(state => {
  // runs after DOM update
})
```

Anti-patterns: mutating managed DOM between updates without `html-static`, assuming synchronous DOM updates immediately after `state.set()`.

## Store / State

Definition: component-local state managed through the `state` helper.

Purpose: hold the mutable data that drives directive updates.

Lifecycle: initialized from `model`, updated through `state.set()`, read through `state.get()`, optionally protected from parent overwrites.

Responsibilities: own mutable UI state for one component instance.

Limitations: no repository evidence of a global store primitive. Use global pub/sub for cross-tree messages, not as a hidden shared state replacement.

Example:

```ts
state.set(s => {
  s.isVisible = !s.isVisible
})
```

Anti-patterns: directly mutating `state.get()` without `state.set()`, using component state for data owned by a child form input that can be browser-owned with `html-static`.

## Services

Definition: application-specific modules or injected dependencies used by components for external work.

Purpose: isolate API calls, validation rules, masks, and other reusable behavior outside UI controllers.

Lifecycle: imported directly or injected through `register(name, module, dependencies)`.

Responsibilities: perform I/O and business logic while controllers coordinate UI state.

Limitations: Jails documents dependency injection, not a formal service container.

Example:

```ts
register('form-validation', formValidation, { validations, masks })
```

Anti-patterns: hard-coding app-specific services inside generic library components.

## Event Delegation

Definition: component-scoped event handling where listeners are attached to the component root and matched against child selectors.

Purpose: reduce event listener count and keep listeners working when child nodes are replaced.

Lifecycle: usually registered inside `main()`. `off()` can remove listeners.

Responsibilities: use stable selectors such as `[data-add]`, read the matched element from `e.delegateTarget`.

Limitations: events must bubble to be caught by delegated listeners. Non-bubbling events require care or direct DOM APIs if unsupported.

Example:

```ts
on('click', '[data-add]', event => {
  event.delegateTarget.disabled = true
})
```

Anti-patterns: attaching listeners to every repeated item inside `html-for`, relying on `event.target` when a nested child may have received the original click.

