# Best Practices

## Prefer server-rendered HTML for first paint

Rationale: Jails components enhance existing HTML. Users should see useful content before JavaScript starts.

Example:

```html
<hello-world>
  <h1>Hello World!</h1>
  <span html-inner="counter">0</span>
</hello-world>
```

Counter-example: rendering all initial content only from a client-side `template` when static HTML would work.

Performance implications: less client-side rendering work and faster perceived load.

## Use `main()` as the readable lifecycle entry point

Rationale: docs position `main()` as the place to list mount-time behavior before implementation details.

Example:

```ts
main(() => {
  on('click', '[data-add]', add)
  load()
})
```

Counter-example: scattering event registration across unrelated helper functions.

Performance implications: no direct runtime gain, but clearer lifecycle reduces duplicate bindings.

## Use delegated events with stable selectors

Rationale: child nodes can be replaced by rendering. Delegation keeps listeners attached to the component root.

Example:

```ts
on('click', '[data-remove]', remove)
```

Counter-example: querying every item in `html-for` and attaching one listener each.

Performance implications: fewer listeners and no rebinding after DOM updates.

## Use `event.delegateTarget`

Rationale: `event.target` may be a nested element inside the matched selector.

Example:

```ts
const id = e.delegateTarget.dataset.id
```

Counter-example:

```ts
const id = e.target.dataset.id
```

Performance implications: avoids defensive DOM traversal and event bugs.

## Keep templates declarative and expressions cheap

Rationale: directive expressions run during updates.

Example:

```html
<div html-class="counterClass">{{ counter }}</div>
```

```ts
export const view = state => ({
  ...state,
  counterClass: state.counter > 10 ? 'bigger' : ''
})
```

Counter-example:

```html
<li html-for="item in items.filter(expensiveFilter).sort(expensiveSort)">
```

Performance implications: avoids repeated expensive work on every render.

## Use `html-static` for external DOM ownership

Rationale: third-party libraries like Swiper mutate DOM. Jails should skip that subtree.

Example:

```html
<div class="swiper" html-static></div>
```

Counter-example: initializing a DOM-mutating library inside a normal directive-managed subtree.

Performance implications: avoids diff work and prevents render conflicts.

## Keep state ownership local and explicit

Rationale: Jails state is component-scoped. Local ownership makes updates predictable.

Example:

```ts
export const model = {
  loading: false,
  items: []
}
```

Counter-example: hidden global mutable objects read directly by many components.

Performance implications: smaller update boundaries.

## Use dependencies for app-specific services

Rationale: generic components should not bundle every application-specific rule.

Example:

```ts
register('form-validation', formValidation, { validations, masks })
```

Counter-example: importing country-specific validations directly into a generic component package.

Performance implications: avoids unused code in reusable components.

## Use `state.set().then()` for post-render work

Rationale: `state.set()` returns a Promise for next-tick behavior after DOM updates.

Example:

```ts
state.set({ open: true }).then(() => {
  elm.querySelector('[data-close]').focus()
})
```

Counter-example: measuring or focusing DOM immediately after `state.set()` and assuming the DOM is already updated.

Performance implications: avoids layout reads against stale DOM.

## Cleanup external resources in `unmount()`

Rationale: detached components should not retain subscriptions, timers, observers, or third-party instances.

Example:

```ts
const unsubscribe = subscribe('event', handler)
unmount(() => unsubscribe())
```

Counter-example: global subscriptions without cleanup.

Performance implications: prevents leaks and duplicate callbacks.

## Prefer DOM events before global pub/sub

Rationale: bubbling DOM events express local parent-child communication with narrower scope.

Example:

```ts
emit('item-selected', item)
```

Counter-example: publishing global events for a child-to-parent message.

Performance implications: less global fan-out and lower coupling.

