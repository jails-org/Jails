# Progressive Enhancement Model

Jails expects useful HTML before JavaScript executes.

## SSR and SSG

Components can enhance server-rendered or statically generated custom elements. The default model is:

```html
<app-counter>
  <span html-inner="count">0</span>
  <button data-add>Add</button>
</app-counter>
```

Before JavaScript loads, the user sees real HTML. After Jails starts, directives connect the DOM to state.

## Embedded Components

When distributing a self-contained component, export `template({ elm, children })` and generate component HTML in JavaScript using `html` and `attributes` from `jails-js/html`.

## Browser Assumptions

Jails requires browser APIs for runtime behavior:

- `customElements`
- `HTMLElement`
- `document`
- `MutationObserver`
- `CustomEvent`
- `AbortController`

`start()` returns without work when `window` is undefined.

