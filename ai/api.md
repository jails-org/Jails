# Public API

## `register(name, module, dependencies?)`

Signature:

```ts
register(name: string, module: Module, dependencies?: object): void
```

Parameters:

- `name`: custom element tag name, for example `'app-counter'`.
- `module`: component module namespace, usually `import * as appCounter from './components/app-counter'`.
- `dependencies`: optional object injected into component helpers as `dependencies`.

Return value: not documented.

Side effects: stores the association between the custom element name and component module.

Lifecycle implications: must run before `start()` for components that should bootstrap during that scan.

Example:

```ts
import { register, start } from 'jails-js'
import http from './shared/http'
import * as myComponent from './components/my-component'

register('my-component', myComponent, { http })
start()
```

Related APIs: `start`, `dependencies`.

## `start(target?)`

Signature:

```ts
start(target?: HTMLElement): void
```

Parameters:

- `target`: optional root element to scan. Defaults to `document.body`.

Return value: not documented.

Side effects: scans for registered custom elements and starts their bootstrap process.

Lifecycle implications: safe to call multiple times, but docs advise avoiding unnecessary calls.

Example:

```ts
register('hello-world', helloWorld)
start()
```

Related APIs: `register`.

## `templateConfig(options)`

Signature:

```ts
jails.templateConfig({ tags: [open: string, close: string] }): void
```

Parameters:

- `tags`: two-string array for mustache delimiters.

Return value: not documented.

Side effects: changes global template delimiters from default `{{` and `}}`.

Lifecycle implications: call before templates are processed.

Example:

```ts
jails.templateConfig({ tags: ['@{', '}'] })
```

Related APIs: mustache interpolation.

## `publish(name, data?)`

Signature:

```ts
publish(name: string, data?: any): void
```

Parameters:

- `name`: global event name.
- `data`: optional payload.

Side effects: notifies subscribers globally.

Lifecycle implications: useful for components in different DOM trees.

Example:

```ts
publish('my-component:fetched', data)
```

Related APIs: `subscribe`, component helper `publish`.

## `subscribe(name, fn)`

Signature:

```ts
subscribe(name: string, fn: Function): Function
```

Parameters:

- `name`: global event name.
- `fn`: callback receiving published data.

Return value: unsubscribe function.

Side effects: registers a global subscription.

Lifecycle implications: call returned function in `unmount()` when subscription lifetime is tied to a component.

Example:

```ts
const unsubscribe = subscribe('my-component:fetched', data => {
  console.log(data)
})
```

Related APIs: `publish`, `unmount`.

## `html`

Signature:

```ts
html(strings: TemplateStringsArray, ...values: any[]): string
```

Parameters: template string parts and interpolated values.

Return value: HTML string for template composition.

Side effects: none documented.

Example:

```ts
import { html } from 'jails-js/html'

export const template = ({ children }) => html`
  <section>
    ${children}
    <p>{{ counter }}</p>
  </section>
`
```

Related APIs: `template`, `attributes`.

## `attributes`

Signature:

```ts
attributes(values: Record<string, any>): string
```

Parameters:

- object of attributes to serialize into template HTML.

Return value: attribute string.

Example:

```ts
import { attributes } from 'jails-js/html'

html`<button ${attributes({ id: 'my-button-id' })}>+</button>`
```

Related APIs: `html`, `template`.

# Component Module Exports

## Default controller

Signature:

```ts
export default function componentName(helpers: Component): void | Promise<void>
```

Async controllers are supported. Code after `await` does not run until the awaited Promise resolves.

Side effects: registers lifecycle callbacks, event handlers, external widgets, subscriptions, and state transitions.

## `model`

Signature:

```ts
export const model: Model = {}
export const model = ({ elm, initialState, dependencies }): Model => ({})
```

Return value: initial local state object.

Side effects: should be none.

## `view`

Signature:

```ts
export const view: View = (state: any) => any
```

Return value: render scope object.

Side effects: should be none.

## `template`

Signature:

```ts
export const template: Template = ({ elm, children }) => string
```

Return value: HTML string inserted/rendered for the component.

# Component Helpers

## `main(fn)`

```ts
main(fn: Function): void
```

Registers the entry-point callback for code that should run after the component is mounted.

## `elm`

```ts
elm: HTMLElement
```

Reference to the component custom element.

## `dataset(key)` / `dataset(target, key)`

```ts
dataset(key: string): any
dataset(target: HTMLElement, key: string): any
```

Parses a `data-*` value from the component or target child.

## `query(cssSelector)`

```ts
query(cssSelector: string): Array<Promise<HTMLElement>>
```

Finds child Jails components that may not be ready yet. Each result resolves when the component is available with public methods.

## `dependencies`

```ts
dependencies: Record<string, any>
```

Dependencies object supplied by `register()`.

## `innerHTML(html)` / `innerHTML(target, html)`

```ts
innerHTML(html: string): void
innerHTML(target: HTMLElement, html: string): void
```

Updates a target with an HTML string using DOM diffing.

## `state.set(newprops)` / `state.set(mutator)`

```ts
state.set(newprops: object): Promise<object>
state.set((currentState: object) => void): Promise<object>
```

Updates local state. Object form merges specified properties. Function form receives current state for mutation. Promise resolves after DOM updates and can be used as next-tick behavior.

## `state.get()`

```ts
state.get(): object
```

Returns the current state object.

## `state.protected(props)`

```ts
state.protected(props: Array<string>): void
```

Prevents listed child component props from being overwritten by parent updates.

## `on(event, selector?, callback)`

```ts
on(event: string, cssSelector: string, callback: Function): void
on(event: string, callback: Function): void
on(attributePattern: string, cssSelector: string, callback: Function): void
```

Registers component-scoped delegated events. Attribute-change syntax uses patterns such as `on('[src]', 'iframe', callback)`. Delegated event objects include `delegateTarget`.

## `off(event, callback)`

```ts
off(event: string, callback: Function): void
```

Removes an event listener.

## `emit(event, data?)`

```ts
emit(event: string, data?: any): void
```

Emits a bubbling DOM CustomEvent from the component.

## `trigger(event, data?)` / `trigger(event, selector, data?)`

```ts
trigger(event: string, data?: object): void
trigger(event: string, selector: string, data?: object): void
```

Triggers an event or custom event from the component or a child matched by selector.

## `publish(event, data?)`

```ts
publish(event: string, data?: any): void
```

Publishes a global pub/sub event.

## `subscribe(event, callback)`

```ts
subscribe(event: string, callback: Function): Function
```

Subscribes globally and returns an unsubscribe function.

## `effect(callback)`

```ts
effect(callback: Function): void | Promise<any>
```

Registers a sync or async function that receives parent props when parent updates occur. The callback may override or compose props.

## `unmount(callback)`

```ts
unmount(callback: Function): void
```

Registers cleanup to run when the component element is detached from DOM.

