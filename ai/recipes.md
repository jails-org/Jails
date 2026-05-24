# Recipes

## Counter

Explanation: minimal local state update with delegated events and `html-inner`.

```html
<app-counter>
  <button data-subtract>-</button>
  <span html-inner="counter">0</span>
  <button data-add>+</button>
</app-counter>
```

```ts
export default function appCounter({ main, on, state }) {
  main(() => {
    on('click', '[data-add]', add)
    on('click', '[data-subtract]', subtract)
  })

  const add = () => {
    state.set(s => {
      s.counter += 1
    })
  }

  const subtract = () => {
    state.set(s => {
      s.counter -= 1
    })
  }
}

export const model = {
  counter: 0
}
```

Rendering explanation: `html-inner="counter"` replaces fallback `0` after mount and updates after each `state.set()`.

Performance notes: one listener per event type at the component root; no per-button rebinding.

Common mistakes: omitting `state` from controller helpers; reading DOM text as source of truth instead of state.

## Loading and Error States

```html
<app-users>
  <p html-if="loading">Loading</p>
  <p html-if="error">{{ error.message }}</p>
  <ul html-if="!loading && !error">
    <li html-for="user in users">{{ user.name }}</li>
  </ul>
</app-users>
```

```ts
export default function appUsers({ main, state, dependencies }) {
  const { http } = dependencies

  main(() => {
    load()
  })

  const load = () => {
    state.set({ loading: true, error: null })
    http.get('/users')
      .then(users => state.set({ users, loading: false }))
      .catch(error => state.set({ error, loading: false }))
  }
}

export const model = {
  users: [],
  loading: false,
  error: null
}
```

Rendering explanation: mutually exclusive `html-if` regions create/remove the visible branch.

Performance notes: fetch never runs from the template. The loop only renders when not loading and without error.

Common mistakes: storing formatted error strings only; keep the original error if handlers need it.

## Modal

```html
<app-modal>
  <button data-open>Open</button>
  <section html-if="open" role="dialog" aria-modal="true">
    <h2>{{ title }}</h2>
    <button data-close>Close</button>
  </section>
</app-modal>
```

```ts
export default function appModal({ main, on, state }) {
  main(() => {
    on('click', '[data-open]', () => state.set({ open: true }))
    on('click', '[data-close]', () => state.set({ open: false }))
  })
}

export const model = {
  open: false,
  title: 'Dialog'
}
```

Rendering explanation: modal DOM is created only when `open` is truthy and removed when false.

Performance notes: fine for small dialogs. For heavy dialog content that should preserve input state, use CSS visibility or place form controls under `html-static` as appropriate.

Common mistakes: expecting internal form values to persist across `html-if` removal.

## Tabs

```html
<app-tabs>
  <nav>
    <button data-tab="profile" html-class="activeTab === 'profile' ? 'active' : ''">Profile</button>
    <button data-tab="billing" html-class="activeTab === 'billing' ? 'active' : ''">Billing</button>
  </nav>
  <section html-if="activeTab === 'profile'">Profile content</section>
  <section html-if="activeTab === 'billing'">Billing content</section>
</app-tabs>
```

```ts
export default function appTabs({ main, on, state }) {
  main(() => {
    on('click', '[data-tab]', select)
  })

  const select = e => {
    state.set({ activeTab: e.delegateTarget.dataset.tab })
  }
}

export const model = {
  activeTab: 'profile'
}
```

Rendering explanation: button classes and panel branches derive from one state property.

Performance notes: no listener per tab panel. Avoid rendering large inactive panels repeatedly.

Common mistakes: reading `event.target.dataset.tab`; nested elements can make `event.target` wrong. Use `delegateTarget`.

## Accordion

```html
<app-accordion>
  <article html-for="item in items">
    <button data-toggle html-data-index="$index">{{ item.title }}</button>
    <div html-if="openIndex === $index">{{ item.body }}</div>
  </article>
</app-accordion>
```

```ts
export default function appAccordion({ main, on, state }) {
  main(() => {
    on('click', '[data-toggle]', toggle)
  })

  const toggle = e => {
    const index = Number(e.delegateTarget.dataset.index)
    state.set(s => {
      s.openIndex = s.openIndex === index ? -1 : index
    })
  }
}

export const model = {
  openIndex: -1,
  items: []
}
```

Rendering explanation: each repeated item receives `$index`; only matching content branch renders.

Performance notes: for long accordions, do not put heavy widgets inside every body unless guarded or static.

Common mistakes: not converting dataset strings to numbers.

## Fetch API With Service Dependency

```ts
// main.ts
register('app-posts', appPosts, { http })
```

```ts
export default function appPosts({ main, state, dependencies }) {
  const { http } = dependencies

  main(() => {
    load()
  })

  const load = async () => {
    state.set({ loading: true })
    const posts = await http.get('/posts')
    state.set({ posts, loading: false })
  }
}

export const model = {
  posts: [],
  loading: false
}
```

Rendering explanation: state changes drive any `html-if` and `html-for` bound to `loading` and `posts`.

Performance notes: dependency injection keeps generic components free of unused service code.

Common mistakes: importing app services inside reusable library components.

## Optimistic Updates

```ts
export default function appTodos({ main, on, state, dependencies }) {
  const { todosApi } = dependencies

  main(() => {
    on('click', '[data-toggle]', toggle)
  })

  const toggle = async e => {
    const id = e.delegateTarget.dataset.id
    const previous = state.get().todos
    const todos = previous.map(todo =>
      todo.id === id ? { ...todo, done: !todo.done } : todo
    )
    await state.set({ todos })

    try {
      await todosApi.toggle(id)
    } catch (error) {
      state.set({ todos: previous, error })
    }
  }
}
```

Rendering explanation: UI updates before the API resolves; rollback restores previous state on failure.

Performance notes: clone changed collections instead of mutating external references.

Common mistakes: losing the previous state snapshot before the optimistic write.

## Nested Templates

```html
<app-page>
  <h1>Server-rendered heading</h1>
  <template>
    <section html-if="user">
      Welcome, {{ user.name }}
    </section>
  </template>
</app-page>
```

Rendering explanation: native `<template>` prevents unresolved mustache markers from flashing before data exists.

Performance notes: use this for correctness of first paint; it is not a substitute for limiting render work.

Common mistakes: hiding content that should be visible at first paint.

## Debounced Input

```html
<app-search>
  <input type="search" html-static>
  <p html-if="loading">Searching</p>
  <ul>
    <li html-for="item in results">{{ item.label }}</li>
  </ul>
</app-search>
```

```ts
export default function appSearch({ main, on, state, dependencies }) {
  const { search } = dependencies
  let timer

  main(() => {
    on('input', 'input[type=search]', schedule)
  })

  const schedule = e => {
    const query = e.delegateTarget.value
    clearTimeout(timer)
    timer = setTimeout(() => run(query), 250)
  }

  const run = async query => {
    state.set({ loading: true })
    const results = await search(query)
    state.set({ results, loading: false })
  }
}

export const model = {
  results: [],
  loading: false
}
```

Rendering explanation: input value is browser-owned through `html-static`; search results are Jails-owned state.

Performance notes: debounce avoids one network request and render per keystroke.

Common mistakes: binding input value to state when no other render logic needs it.

## Intersection Observer Lazy Rendering

```ts
export default function lazyPanel({ main, elm, state, unmount }) {
  let observer

  main(() => {
    observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        state.set({ visible: true })
        observer.disconnect()
      }
    })
    observer.observe(elm)
  })

  unmount(() => {
    if (observer) observer.disconnect()
  })
}

export const model = {
  visible: false
}
```

```html
<lazy-panel>
  <section html-if="visible">Expensive content</section>
</lazy-panel>
```

Rendering explanation: expensive content is not created until the component enters the viewport.

Performance notes: cleanup prevents observers from retaining detached elements.

Common mistakes: forgetting `unmount()`.

## Virtual List Boundary

```html
<app-virtual-list>
  <div class="virtual-list" html-static></div>
  <p>Total: {{ total }}</p>
</app-virtual-list>
```

```ts
export default function appVirtualList({ main, elm, state, dependencies }) {
  const { createVirtualList } = dependencies
  const target = elm.querySelector('.virtual-list')
  let list

  main(() => {
    list = createVirtualList(target, {
      onCountChange: total => state.set({ total })
    })
  })
}

export const model = {
  total: 0
}
```

Rendering explanation: the virtual list library owns its DOM; Jails renders surrounding counters/state.

Performance notes: `html-static` prevents Jails diffing a large, imperatively managed list.

Common mistakes: putting `html-for` inside a virtualized area managed by another library.

