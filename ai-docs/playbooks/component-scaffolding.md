# Component Scaffolding Playbook

## Minimal Component

```html
<feature-toggle>
  <button type="button" data-toggle>Toggle</button>
  <p html-if="enabled">Enabled</p>
</feature-toggle>
```

```ts
export default function featureToggle({ main, on, state }) {
  main(() => {
    on('click', '[data-toggle]', toggle)
  })

  const toggle = () => {
    state.set(s => {
      s.enabled = !s.enabled
    })
  }
}

export const model = {
  enabled: false
}
```

## Checklist

- Register the component name once.
- Keep HTML useful before JavaScript.
- Put subscriptions in `main()`.
- Use delegated `on()`.
- Store render state in `model`.
- Use `view()` for derived values.
- Clean external resources in `unmount()`.

