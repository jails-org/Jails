# SSR And Browser Assumptions

## SSR Compatibility

`start()` checks for `window`. If `window` is undefined, it returns without work. This allows Jails modules to be imported in server contexts without starting browser behavior.

Jails is designed to enhance SSR or SSG output:

```html
<hello-world>
  <span html-inner="message">Hello</span>
</hello-world>
```

The HTML should remain meaningful before Jails starts.

## Browser Requirements

Runtime behavior assumes:

- `window`
- `document`
- `customElements`
- `HTMLElement`
- `CustomEvent`
- `MutationObserver`
- `AbortController`
- `Element.matches`
- `querySelectorAll`

## Template Engine Conflicts

Default interpolation delimiters are `{{` and `}}`. If a server template engine uses the same delimiters, call:

```ts
templateConfig({ tags: ['@{', '}'] })
```

## AI Generation Rule

When generating SSR examples, include fallback content in the HTML and avoid empty custom elements unless the component exports a complete `template()`.

