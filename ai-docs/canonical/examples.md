# Canonical Examples

## Conditional Rendering

```json
{"id":"conditional-rendering","directives":["html-if","html-inner"],"apis":["state.set","on"],"stability":"stable"}
```

Purpose: Toggle a visible section from local state.

```html
<notice-panel>
  <p html-if="isVisible" html-inner="message">Loading...</p>
  <button type="button" data-toggle>Toggle</button>
</notice-panel>
```

```ts
export default function noticePanel({ main, on, state }) {
  main(() => {
    on('click', '[data-toggle]', toggle)
  })

  const toggle = () => {
    state.set(current => {
      current.isVisible = !current.isVisible
    })
  }
}

export const model = {
  isVisible: true,
  message: 'Saved'
}
```

Explanation: `html-if` controls whether the paragraph exists. `html-inner` keeps fallback text available before JavaScript.

Invariants: directive expressions are side-effect free; state changes use `state.set()`.

Anti-patterns: toggling with `element.style.display`; writing `document.querySelector()` against global DOM.

## Loops

```json
{"id":"loops","directives":["html-for","html-if"],"apis":["state.set"],"stability":"stable"}
```

Purpose: Render a list from state.

```html
<todo-list>
  <ul>
    <li html-for="todo in todos">
      <span html-if="!todo.done">{{ todo.title }}</span>
      <s html-if="todo.done">{{ todo.title }}</s>
    </li>
  </ul>
</todo-list>
```

```ts
export default function todoList() {}

export const model = {
  todos: [
    { title: 'Write HTML', done: false },
    { title: 'Enhance with Jails', done: true }
  ]
}
```

Explanation: `html-for` exposes `todo`, `$index`, and `$key` per row.

Invariants: arrays are preferred for ordered output; row expressions do not mutate state.

Anti-patterns: depending on object iteration order for user-facing order; storing DOM nodes in `todos`.

## Nested Templates

```json
{"id":"nested-templates","directives":["template","html-for","html-if"],"apis":[],"stability":"stable"}
```

Purpose: Hide dynamic placeholders before JavaScript starts.

```html
<user-menu>
  <button type="button">Account</button>
  <template>
    <nav html-if="isOpen">
      <a html-for="item in items" html-href="item.href">{{ item.label }}</a>
    </nav>
  </template>
</user-menu>
```

```ts
export default function userMenu({ main, on, state }) {
  main(() => on('click', 'button', toggle))

  const toggle = () => {
    state.set(s => {
      s.isOpen = !s.isOpen
    })
  }
}

export const model = {
  isOpen: false,
  items: [
    { href: '/profile', label: 'Profile' },
    { href: '/logout', label: 'Sign out' }
  ]
}
```

Explanation: Native `<template>` prevents unresolved markers from flashing.

Invariants: the template contains only markup that can wait for JavaScript.

Anti-patterns: hiding critical content inside `<template>` when no JavaScript fallback exists.

## Forms

```json
{"id":"forms","directives":["html-inner","html-static","html-disabled"],"apis":["state.set","on"],"stability":"stable"}
```

Purpose: Submit a form while letting the browser own field values.

```html
<signup-form>
  <form data-form>
    <input name="email" type="email" required html-static>
    <button type="submit" html-disabled="isSaving">Join</button>
  </form>
  <p html-if="message" html-inner="message"></p>
</signup-form>
```

```ts
export default function signupForm({ main, on, state }) {
  main(() => on('submit', '[data-form]', submit))

  const submit = async event => {
    event.preventDefault()
    const form = event.delegateTarget
    const data = new FormData(form)

    await state.set({ isSaving: true, message: '' })
    await Promise.resolve(data.get('email'))
    await state.set({ isSaving: false, message: 'Subscribed' })
  }
}

export const model = {
  isSaving: false,
  message: ''
}
```

Explanation: `html-static` prevents morphing from resetting the input while Jails owns submit status.

Invariants: form fields are read from `event.delegateTarget`; rendered flags are in state.

Anti-patterns: storing every keystroke in component state when the browser can own the input.

## Stores

```json
{"id":"stores","directives":["html-inner"],"apis":["dependencies","state.set"],"stability":"stable"}
```

Purpose: Inject an explicit store through dependencies.

```ts
// main.ts
import { register, start } from 'jails-js'
import * as cartTotal from './cart-total'

const cart = {
  total: 0,
  add(value) {
    this.total += value
    return this.total
  }
}

register('cart-total', cartTotal, { cart })
start()
```

```html
<cart-total>
  <strong html-inner="total">0</strong>
  <button type="button" data-add>Add</button>
</cart-total>
```

```ts
export default function cartTotal({ main, on, state, dependencies }) {
  main(() => on('click', '[data-add]', add))

  const add = () => {
    const total = dependencies.cart.add(10)
    state.set({ total })
  }
}

export const model = {
  total: 0
}
```

Explanation: Shared state is injected, named, and explicit.

Invariants: dependency mutation is followed by local state update.

Anti-patterns: importing hidden singletons in every component.

## Events

```json
{"id":"events","directives":[],"apis":["on","emit"],"stability":"stable"}
```

Purpose: Communicate from child component to parent with DOM events.

```html
<cart-shell>
  <cart-button html-model="{ value: 15 }">
    <button type="button" data-add>Add item</button>
  </cart-button>
  <p>Total: <span html-inner="total">0</span></p>
</cart-shell>
```

```ts
// cart-button.ts
export default function cartButton({ main, on, emit, state }) {
  main(() => on('click', '[data-add]', add))

  const add = () => {
    emit('cart:add', [state.get().value])
  }
}

export const model = { value: 0 }
```

```ts
// cart-shell.ts
export default function cartShell({ main, on, state }) {
  main(() => on('cart:add', add))

  const add = (_event, value) => {
    state.set(s => {
      s.total += value
    })
  }
}

export const model = { total: 0 }
```

Explanation: `emit()` dispatches a bubbling `CustomEvent`; Jails passes `detail.args` after the event.

Invariants: events are named by domain; parent owns total.

Anti-patterns: child directly mutating parent state.

## Async Rendering

```json
{"id":"async-rendering","directives":["html-if","html-for"],"apis":["state.set"],"stability":"stable"}
```

Purpose: Fetch data and render stable loading states.

```html
<product-list>
  <p html-if="isLoading">Loading</p>
  <p html-if="error" html-inner="error"></p>
  <ul html-if="!isLoading && !error">
    <li html-for="product in products">{{ product.name }}</li>
  </ul>
</product-list>
```

```ts
export default function productList({ main, state, dependencies }) {
  main(load)

  const load = async () => {
    await state.set({ isLoading: true, error: '' })
    try {
      const products = await dependencies.http.get('/products')
      await state.set({ products, isLoading: false })
    } catch {
      await state.set({ error: 'Unable to load products', isLoading: false })
    }
  }
}

export const model = {
  products: [],
  isLoading: false,
  error: ''
}
```

Explanation: async work is explicit and reflected by state flags.

Invariants: errors are represented in state; render state never depends on pending promises.

Anti-patterns: awaiting inside directive expressions.

## Optimistic Updates

```json
{"id":"optimistic-updates","directives":["html-for"],"apis":["state.set"],"stability":"stable"}
```

Purpose: Update UI immediately and rollback on failure.

```html
<like-list>
  <button html-for="item in items" type="button" data-like html-data-id="item.id">
    {{ item.label }}: {{ item.likes }}
  </button>
</like-list>
```

```ts
export default function likeList({ main, on, state, dependencies }) {
  main(() => on('click', '[data-like]', like))

  const like = async event => {
    const id = event.delegateTarget.dataset.id
    const previous = state.get().items

    await state.set(s => {
      s.items = s.items.map(item =>
        item.id === id ? { ...item, likes: item.likes + 1 } : item
      )
    })

    try {
      await dependencies.http.post(`/items/${id}/like`)
    } catch {
      await state.set({ items: previous })
    }
  }
}

export const model = {
  items: [{ id: 'a', label: 'Jails', likes: 0 }]
}
```

Explanation: the previous state snapshot allows deterministic rollback.

Invariants: optimistic state is rendered through `state.set()`.

Anti-patterns: incrementing text nodes directly and hoping state catches up.

## Lazy Loading

```json
{"id":"lazy-loading","directives":["html-if"],"apis":["state.set","unmount"],"stability":"stable"}
```

Purpose: Load expensive behavior only after the component mounts.

```html
<chart-panel>
  <div html-if="isReady" class="chart" html-static></div>
  <p html-if="!isReady">Preparing chart</p>
</chart-panel>
```

```ts
export default function chartPanel({ main, elm, state, unmount }) {
  let chart

  main(async () => {
    const { createChart } = await import('./chart-lib')
    await state.set({ isReady: true })
    chart = createChart(elm.querySelector('.chart'))
  })

  unmount(() => {
    if (chart) chart.destroy()
  })
}

export const model = {
  isReady: false
}
```

Explanation: `html-static` hands the chart container to the chart library.

Invariants: external instances are cleaned on unmount.

Anti-patterns: letting Jails morph DOM created by the chart library.

## Routing

```json
{"id":"routing","directives":["html-if"],"apis":["state.set"],"stability":"inferred"}
```

Purpose: Use browser location as input for a small island, not as a full SPA router.

```html
<account-tabs>
  <a href="/account/profile" data-route="profile">Profile</a>
  <a href="/account/billing" data-route="billing">Billing</a>
  <section html-if="route === 'profile'">Profile content</section>
  <section html-if="route === 'billing'">Billing content</section>
</account-tabs>
```

```ts
export default function accountTabs({ main, on, state }) {
  main(() => on('click', 'a[data-route]', select))

  const select = event => {
    if (!event.metaKey && !event.ctrlKey) {
      event.preventDefault()
      const route = event.delegateTarget.dataset.route
      history.pushState(null, '', event.delegateTarget.href)
      state.set({ route })
    }
  }
}

export const model = ({ elm }) => ({
  route: location.pathname.endsWith('/billing') ? 'billing' : 'profile'
})
```

Explanation: routing is local enhancement around normal links.

Invariants: links remain valid without JavaScript.

Anti-patterns: building a full client router when server URLs already exist.

## Component Composition

```json
{"id":"component-composition","directives":["html-model","html-for"],"apis":["state.protected"],"stability":"stable"}
```

Purpose: Parent renders child components while children protect local state.

```html
<catalog-list>
  <product-card html-for="product in products">
    <h3 html-inner="product.name"></h3>
    <button type="button" data-toggle>Toggle details</button>
    <p html-if="isOpen" html-inner="product.description"></p>
  </product-card>
</catalog-list>
```

```ts
export default function productCard({ main, on, state }) {
  state.protected(['isOpen'])
  main(() => on('click', '[data-toggle]', toggle))

  const toggle = () => {
    state.set(s => {
      s.isOpen = !s.isOpen
    })
  }
}

export const model = {
  isOpen: false
}
```

Explanation: parent product data flows down, while `isOpen` remains child-local.

Invariants: child local keys are protected before parent updates matter.

Anti-patterns: parent managing every detail toggle for every child.

## Web Components Integration

```json
{"id":"web-components-integration","directives":[],"apis":["template","html","attributes"],"stability":"stable"}
```

Purpose: Publish a self-contained component with embedded HTML.

```ts
import { html, attributes } from 'jails-js/html'

export default function appCounter({ main, on, state }) {
  main(() => {
    on('click', '[data-add]', () => state.set(s => { s.count += 1 }))
  })
}

export const model = ({ elm }) => ({
  count: Number(elm.dataset.startAt || 0)
})

export const template = ({ children }) => html`
  ${children}
  <output ${attributes({ 'html-inner': 'count' })}>0</output>
  <button type="button" data-add>Add</button>
`
```

Explanation: `template()` lets a package ship behavior and default markup.

Invariants: consumer can still provide children; HTML is explicit.

Anti-patterns: hiding business-specific HTML inside generic behavior components.

## Progressive Enhancement

```json
{"id":"progressive-enhancement","directives":["html-inner","html-src"],"apis":["state.set"],"stability":"stable"}
```

Purpose: Keep meaningful fallback content before JavaScript.

```html
<profile-card data-user-id="42">
  <h2 html-inner="name">Guest</h2>
  <img html-src="avatarUrl" alt="">
</profile-card>
```

```ts
export default function profileCard({ main, dataset, state, dependencies }) {
  main(async () => {
    const user = await dependencies.http.get(`/users/${dataset('userId')}`)
    state.set({
      name: user.name,
      avatarUrl: user.avatarUrl
    })
  })
}

export const model = {
  name: 'Guest',
  avatarUrl: ''
}
```

Explanation: `html-src` avoids an image request until JavaScript supplies `avatarUrl`.

Invariants: fallback text is valid; data attributes configure the instance.

Anti-patterns: blank custom elements that require JavaScript for all content.

## Partial DOM Updates

```json
{"id":"partial-dom-updates","directives":["html-static"],"apis":["innerHTML"],"stability":"stable"}
```

Purpose: Morph a small target instead of changing all state.

```html
<message-preview>
  <div data-preview html-static></div>
  <button type="button" data-render>Render preview</button>
</message-preview>
```

```ts
export default function messagePreview({ main, on, elm, innerHTML }) {
  main(() => on('click', '[data-render]', render))

  const render = () => {
    const target = elm.querySelector('[data-preview]')
    innerHTML(target, '<article><h2>Preview</h2><p>Ready.</p></article>')
  }
}
```

Explanation: `innerHTML()` uses DOM morphing for a targeted update.

Invariants: target HTML is trusted; the target is intentionally static for state renders.

Anti-patterns: mixing direct `innerHTML = ...` with Jails-owned dynamic nodes.

