# Component Boundaries

## Root Boundary

Each registered Jails component is a custom element. The custom element root is the component boundary.

```html
<app-counter>
  <button data-add>Add</button>
  <span html-inner="count">0</span>
</app-counter>
```

The controller receives the root as `elm`.

## Boundary Contracts

- A component may query and update inside its own root.
- A component should not imperatively mutate sibling or parent DOM.
- Parent render does not morph child component roots.
- Parent state can be forwarded to child state after parent render.
- Child components can protect local keys with `state.protected()`.
- Child-to-parent communication should use bubbling `emit()` events.

## Embedded Template Boundary

If a component exports `template({ elm, children })`, Jails uses it to replace or augment the component inner HTML during template setup.

Use embedded templates for distributable, fully featured web components. Prefer existing server HTML for site-specific components.

## Dependency Boundary

The third argument to `register()` is the explicit dependency boundary:

```ts
register('form-validation', formValidation, { validations, masks })
```

Injected dependencies are available as `dependencies` in the component helpers.

