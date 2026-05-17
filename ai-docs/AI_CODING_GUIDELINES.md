# AI Coding Guidelines

## Preferred Patterns

- Start from semantic HTML and add Jails directives only where state affects the DOM.
- Register components with explicit custom element names: `register('app-counter', appCounter)`.
- Use `main()` as the component entry point for event subscriptions and startup work.
- Use delegated events: `on('click', '[data-save]', save)`.
- Use `event.delegateTarget` when reading the matched delegated element.
- Use `state.set()` for rendered state changes.
- Use `state.save()` only for non-rendered state changes.
- Use `view()` for derived values used only by the template.
- Use `unmount()` for cleanup of timers, subscriptions, observers, and third-party instances.

## Recommended Structures

```ts
export default function component({ main, on, state }) {
  main(() => {
    on('click', '[data-action]', action)
  })

  const action = () => {
    state.set(current => {
      current.enabled = !current.enabled
    })
  }
}

export const model = {
  enabled: false
}
```

## Stable APIs

- `register`
- `start`
- `templateConfig`
- `publish`
- `subscribe`
- `html`
- `attributes`
- component helpers: `main`, `effect`, `query`, `state`, `dataset`, `on`, `off`, `trigger`, `emit`, `unmount`, `innerHTML`

## Naming Conventions

- Component tag names: kebab-case custom elements, for example `todo-list`.
- Event hook attributes: `data-*`, for example `data-add`, `data-submit`, `data-remove`.
- Custom events: domain-prefixed kebab-case, for example `cart:item-added`.
- State keys: plain descriptive names, for example `items`, `isLoading`, `error`.
- Derived view keys: names that reveal formatting, for example `totalLabel`, `isEmpty`.

## Store Patterns

- Prefer local component state first.
- Use parent state flowing into child components for parent-owned data.
- Use `state.protected()` in children for local data that must survive parent updates.
- Use global `publish` and `subscribe` for cross-tree events, not for every local state change.
- Keep external stores explicit and injected through `register(name, module, dependencies)`.

## Template Patterns

- Use `html-inner` for progressive enhancement when SSR text should be visible before JavaScript.
- Use `<template>` to hide dynamic placeholders during initial page load.
- Use `html-if` for conditional sections.
- Use `html-for` for lists and rely on stable item data, not generated scope ids.
- Use `html-*` for attributes that should be quiet until JavaScript runs, such as `html-src`.
- Use `html-static` for browser-owned form values or third-party DOM.

## Event Patterns

- Attach events in `main()`.
- Use selectors instead of per-node listeners.
- Emit DOM custom events for child-to-parent communication.
- Use pub/sub only when components are not in the same DOM tree.
- Unsubscribe pub/sub handlers on unmount.

## Performance Guidelines

- Keep component roots small and focused.
- Avoid broad parent components that re-render large unrelated DOM areas.
- Mark third-party or browser-owned areas as `html-static`.
- Keep directive expressions simple and side-effect free.
- Avoid storing derived display strings in state.
- Avoid unnecessary parent-to-child prop churn by protecting child-local keys.

## Avoid

- Imperative DOM mutation on nodes that Jails owns.
- Hidden global state.
- Side effects inside `view()` or directive expressions.
- Direct use of internal attributes such as `tplid` and `html-scopeid`.
- Parsing untrusted `html-model` values.
- Overusing pub/sub for local component communication.

## Dangerous Patterns

- Mutating DOM below a component root and then calling `state.set()` without `html-static`.
- Expecting child DOM to be overwritten by parent morphing.
- Returning async side effects from `view()`.
- Forgetting `unmount()` cleanup for timers or subscriptions.
- Using random keys or scope ids as application identifiers.

## Migration Approach

- Move direct DOM updates into state and directives.
- Move formatting code into `view()`.
- Replace per-node listeners with delegated `on()`.
- Add `html-static` around third-party DOM ownership.
- Split large components into smaller custom elements.

