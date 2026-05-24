# Architectural Patterns

## Progressive Island Component

Intent: make server-rendered HTML interactive without turning the page into a single JavaScript-owned application.

Structure:

```html
<hello-world>
  <h1>Hello World!</h1>
  <button class="add">+</button>
  <span html-inner="counter">0</span>
</hello-world>
```

```ts
register('hello-world', helloWorld)
start()
```

Responsibilities: HTML owns first paint; controller owns behavior; state owns values that directives render.

Why it exists: Jails targets SSR/SSG/CMS pages where most content is static and only selected areas need interactivity.

Performance implications: less JavaScript and fewer hydration boundaries than full-page SPA rendering.

Scalability implications: teams can add isolated components without centralizing the whole page in one app shell.

## Page-Scoped Store

Intent: keep mutable UI state local to the component or page island that renders it.

Structure:

```ts
export const model = {
  items: [],
  loading: false,
  error: null
}
```

Responsibilities: the page component fetches data, owns loading/error states, and passes relevant props to child components through parent updates.

Why it exists: Jails docs emphasize local component state and parent-to-child prop updates, not a global store.

Performance implications: local updates constrain render work to the component boundary.

Scalability implications: state ownership remains visible. Cross-tree communication uses pub/sub only when DOM hierarchy cannot carry the message.

## Services Through Dependencies

Intent: make generic components reusable across applications with app-specific services injected at registration time.

Structure:

```ts
register('form-validation', formValidation, { validations, masks })
```

Responsibilities: shared service modules perform validation, HTTP, masks, or business logic; component coordinates UI events and state.

Why it exists: prevents generic components from bundling every application-specific rule.

Performance implications: avoids importing unused validation/business code into generic libraries.

Scalability implications: supports library distribution and app-specific behavior without forking components.

## Delegated Event Handling

Intent: bind a small number of listeners at the component root.

Structure:

```ts
main(() => {
  on('click', '[data-remove]', remove)
})
```

Responsibilities: use stable selectors, read `event.delegateTarget`, and keep handlers independent of child node identity.

Why it exists: child nodes may be replaced by directive updates. Delegation keeps handlers active.

Performance implications: avoids one listener per repeated item and reduces rebinding after render.

Scalability implications: list and conditional rendering remain predictable.

## Template Composition

Intent: package fully featured widgets while still allowing consumer content.

Structure:

```ts
export const template = ({ children }) => html`
  <section>
    ${children}
    <p>Counter: {{ counter }}</p>
  </section>
`
```

Responsibilities: templates define embedded markup; controllers define behavior; `children` preserves caller-provided content.

Why it exists: Jails supports both logic-only components and self-contained web components.

Performance implications: embedded templates add client-side HTML creation, so prefer server-rendered HTML for generic page content.

Scalability implications: useful for widgets such as chat, consent bars, counters, and mini-apps.

## Static Third-Party Integration

Intent: let external libraries mutate DOM without Jails overwriting their changes.

Structure:

```html
<div class="swiper" html-static>...</div>
```

Responsibilities: external library owns the static subtree; Jails owns surrounding state and events.

Why it exists: DOM-diffing renderers conflict with libraries that imperatively mutate DOM.

Performance implications: Jails skips diff work for that subtree.

Scalability implications: each integration has an explicit ownership boundary.

## Fetch Flow

Intent: perform asynchronous I/O in controller logic and reflect status through state.

Structure:

```ts
export default function appList({ main, state }) {
  main(() => {
    load()
  })

  const load = () => {
    state.set({ loading: true, error: null })
    fetch('/api/items')
      .then(r => r.json())
      .then(items => state.set({ items, loading: false }))
      .catch(error => state.set({ error, loading: false }))
  }
}
```

Responsibilities: services/fetch handle I/O; state holds loading/error/data; template renders states with directives.

Why it exists: keeps templates deterministic and side-effect-free.

Performance implications: avoid re-fetching in render paths.

Scalability implications: cleanly separates data acquisition from DOM projection.

## Parent-Child Communication

Intent: communicate down through props/state updates and up through DOM events.

Structure:

```ts
// child
emit('time-elapsed', '10 seconds elapsed')

// parent
on('time-elapsed', 'child-component', handleElapsed)
```

Responsibilities: parent owns data it passes down; child emits user/domain events upward; siblings use pub/sub when no shared ancestor is practical.

Why it exists: follows DOM event semantics and keeps component coupling low.

Performance implications: bubbling events avoid global subscriptions for local communication.

Scalability implications: choose the narrowest communication channel that reaches the recipient.

