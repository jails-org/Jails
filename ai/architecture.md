# Architecture

## Runtime Shape

Jails is a singleton API. Applications register component modules globally, then call `start()` to scan a DOM subtree. The framework is intended to be used once per page, not as multiple framework instances.

## Rendering Pipeline

1. Application imports component modules.
2. Application calls `register(name, module, dependencies?)`.
3. Application calls `start(target?)`.
4. Jails scans `target` or `document.body` for registered custom elements.
5. For each element, Jails builds component state from `model` and `html-model`.
6. If a `template` export exists, Jails can generate embedded HTML using `{ elm, children }`.
7. Jails evaluates template directives and mustache expressions against the render scope.
8. Controller `main()` callbacks run after mount.
9. Later `state.set()` calls update state and trigger template updates.

## Update Flow

State updates go through `state.set()`. Object form changes only specified properties. Function form receives the current state and can mutate it. The method returns a Promise that resolves after DOM updates; use that Promise for next-tick work such as measuring updated DOM or starting animations.

`view(state)` runs as a render-scope transform. Values returned from `view` are intended for HTML only and do not become persistent state unless stored explicitly through `state.set()`.

Parent state changes can update child component props by default. A child can call `state.protected(['propName'])` to prevent selected props from being overwritten by parent updates.

## DOM Ownership

The component element is the main rendering boundary. Jails owns directive-managed DOM inside that boundary. The browser owns normal form behavior unless the component state overwrites it. Third-party libraries may own subtrees marked with `html-static`.

Ownership rules:

- Jails-owned: nodes/attributes/text controlled by directives and mustache expressions.
- Browser-owned: native input value persistence when inputs are not re-rendered, especially with `html-static`.
- External-library-owned: widgets initialized by controller code inside `html-static` subtrees.
- Parent-owned: props passed down to children unless protected by child state.

## Event System

`on()` registers delegated listeners at the component root. The selector argument identifies child elements. The event object is augmented with `delegateTarget`, which is the element that matched the selector. This is safer than `event.target`, which may be a nested element.

DOM events and custom events bubble. `emit()` sends CustomEvents upward to parents and siblings reachable by bubbling. `trigger()` programmatically dispatches events from the component or a selected child. `publish()` and `subscribe()` provide global pub/sub for components in different DOM trees.

Attribute changes can be observed with `on('[src]', 'iframe', callback)` and similar patterns. The callback receives `{ target, value, attribute }`.

## Template System

Directives and mustache expressions evaluate JavaScript expressions. Default interpolation delimiters are `{{` and `}}`; `templateConfig()` can change them when a server renderer uses the same delimiters.

`html-if` controls conditional node existence. `html-for` repeats nodes for arrays or objects and provides `$index` and `$key`. `html-inner` writes expression results into an element. `html-*` maps expression values to real attributes. `html-static` skips diffing for a node and its children. Native `<template>` hides unresolved dynamic fragments from first paint.

## Rendering Boundaries

Primary boundary: each registered custom element instance.

Nested boundary: child components receive parent props but have their own controller, state, lifecycle, and event root.

Static boundary: `html-static` excludes a subtree from Jails updates.

Conditional boundary: `html-if` may remove an entire subtree, causing child component detach and cleanup.

Loop boundary: `html-for` creates repeated instances of the directive element. The docs do not specify keyed reconciliation; assume position-based behavior.

## Store Interactions

Jails documents component-local state rather than a centralized store. Use local state for UI ownership. Use parent props for downward data. Use DOM events for upward communication. Use pub/sub only for components in separate trees.

## Service Interactions

Services can be imported directly or injected through `register()` dependencies. Injection is preferred for reusable components whose behavior depends on application-specific rules, for example form validations and masks.

## SSR and SSG Implications

Jails is designed to enhance already rendered HTML, so it fits SSR and SSG. Server-rendered HTML appears before JavaScript loads. Directives then activate after `start()`. For shared SSR templates, export template functions separately and render them through the server framework. For fully featured components, export a `template` from the component module.

## Hydration Behavior

The docs describe progressive enhancement rather than React-style full hydration. Jails scans existing DOM and applies behavior/directives. It does not require JavaScript to render the whole page on the server. Use native `<template>` or `html-inner` fallback content to avoid visible unresolved markers during first paint.

