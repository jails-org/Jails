# html-if

## Purpose

Conditionally render a node based on a JavaScript expression evaluated against the component view scope.

## Syntax

```html
<div html-if="show">Hello, {{ name }}</div>
<div html-if="!show">Hidden branch</div>
```

## Parameters

- Expression string: any valid JavaScript expression available in the render scope.

## Rendering Behavior

When the expression is truthy, the element participates in rendered output. When falsy, the element is absent from rendered output. Nested mustache expressions and nested directives are evaluated only for the active rendered branch.

## DOM Behavior

The docs show falsy `html-if` nodes removed from output rather than hidden with CSS. Treat the node as created when the condition becomes truthy and removed when it becomes falsy. Any DOM state inside a removed branch is lost unless stored externally.

## Update Behavior

The expression is re-evaluated after state updates and parent prop updates. Toggling false to true recreates the branch from the directive template.

## Performance Characteristics

Cheap for small branches. Expensive branches should be guarded carefully because truthy transitions create DOM and nested directives. Avoid using it for frequent visibility toggles of large subtrees if CSS visibility would preserve DOM state better.

## Common Patterns

- Loading and error states.
- Optional user data after fetch.
- Mutually exclusive branches with `html-if="condition"` and `html-if="!condition"`.

## Anti-patterns

- Using `html-if` for form inputs whose typed value should persist while hidden.
- Running expensive expressions in the condition.
- Depending on event listeners bound directly to children inside the branch; use delegated `on()`.

## Edge Cases

- Falsy values include `false`, `0`, `''`, `null`, `undefined`, and `NaN`.
- If a child component is inside a removed branch, expect its element to be detached and `unmount()` to run.

## Example

```html
<my-component>
  <p html-if="isVisible">Hey! Now you see me</p>
  <button data-toggle>Toggle</button>
</my-component>
```

```ts
export default function myComponent({ main, on, state }) {
  main(() => {
    on('click', '[data-toggle]', toggle)
  })

  const toggle = () => {
    state.set(s => {
      s.isVisible = !s.isVisible
    })
  }
}

export const model = {
  isVisible: true
}
```

## Internal Notes

The repository documents output semantics but does not include runtime code. The removal/recreation behavior is inferred from examples where falsy nodes are absent from final HTML.

# html-for

## Purpose

Repeat an element for each item in an array or object.

## Syntax

```html
<li html-for="item in list">{{ item.name }} {{ $index }}</li>
```

## Parameters

- Item alias: local variable name for each value.
- Iterable expression: array or object expression.
- Auto variables: `$index` for numeric position; `$key` for object key.

## Rendering Behavior

The element carrying `html-for` is used as the repeated template. For each item, Jails renders one copy of that element with the alias, `$index`, and `$key` available to nested expressions and directives.

## DOM Behavior

Copies are inserted where the original directive element appears. If the iterable shrinks, extra copies are removed. If it grows, new copies are created. Nested directives run inside each copy with that item scope.

## Update Behavior

The loop is re-evaluated after state changes. The docs do not specify keyed reconciliation. Assume position-based updates unless runtime source proves keyed behavior. Use stable, small item markup and avoid depending on preserved local DOM state inside loop items.

## Performance Characteristics

Cost grows with item count and nested directive complexity. Deeply nested loops multiply render work. Event delegation keeps listener count low if handlers are registered on the component root.

## Common Patterns

- Lists and menus.
- Rendering object maps with `$key`.
- Combining with `html-if` inside the repeated item.

## Anti-patterns

- Large or nested loops without pagination, virtualization, or static boundaries.
- Directly binding listeners to every item after render.
- Performing filtering/sorting inside the directive expression on every update.

## Edge Cases

- Missing properties render as empty/undefined values depending on expression context.
- Nested `html-if` can leave an otherwise repeated item empty, as shown in the docs.

## Example

```html
<my-component>
  <ul>
    <li html-for="item in list">
      <span html-if="item.show">
        {{ item.name }}
        {{ $index }}
      </span>
    </li>
  </ul>
</my-component>
```

```ts
state.set({
  list: [
    { name: 'Hello', show: true },
    { name: 'Clark', show: true },
    { name: 'Kent' }
  ]
})
```

## Internal Notes

Docs explicitly support arrays and objects and mention `$index` and `$key`. Keyed diffing is not documented.

# html-inner

## Purpose

Set an element's inner text/content from a state expression while allowing fallback HTML content before JavaScript mounts.

## Syntax

```html
<strong html-inner="name">Some default value</strong>
```

## Parameters

- Expression string evaluated against the render scope.

## Rendering Behavior

Equivalent in purpose to `{{ }}` interpolation but targeted at a specific element.

## DOM Behavior

After mount, the element's existing child content is replaced with the expression result.

## Update Behavior

Re-evaluated when state changes. The element remains stable while its content changes.

## Performance Characteristics

Lower structural cost than replacing a whole branch. Best for scalar text or simple content.

## Common Patterns

- Counters.
- Labels with server-rendered fallback content.
- Progressive enhancement where the pre-JS content should be meaningful.

## Anti-patterns

- Injecting untrusted HTML.
- Using for complex nested markup that should be represented as explicit HTML/directives.

## Edge Cases

- Existing fallback content is visible until Jails mounts.
- If expression is `null` or `undefined`, output should be treated as empty or literal based on runtime behavior; avoid ambiguous values.

## Example

```html
<hello-world>
  <button class="btn add">+</button>
  <span html-inner="counter">0</span>
  <button class="btn subtract">-</button>
</hello-world>
```

## Internal Notes

Docs state it "does exactly what `{{ }}` does" but outputs into a specific element.

# html-model

## Purpose

Provide initial state from markup for a component instance.

## Syntax

```html
<my-component html-model="{ counter: 5 }">
  <p>{{ counter }}</p>
</my-component>
```

## Parameters

- JavaScript object expression.

## Rendering Behavior

Initial state includes values from `html-model`. Docs state it overrides props from the current `model`.

## DOM Behavior

The directive is an initialization mechanism. It is not rendered as a normal application attribute after Jails processes directives.

## Update Behavior

Used at component bootstrap. Later updates should use `state.set()` or parent props.

## Performance Characteristics

Cheap. Good for per-instance configuration without additional JavaScript modules.

## Common Patterns

- Initial counter values.
- Per-component options from server-rendered HTML.

## Anti-patterns

- Storing large serialized payloads in HTML attributes.
- Treating `html-model` as reactive after mount.

## Edge Cases

- Syntax must be a valid JavaScript expression, not strict JSON only.
- Prefer `data-*` plus function `model` when values need explicit parsing.

## Example

```html
<my-component html-model="{ counter: 5 }">
  <span html-inner="counter"></span>
</my-component>
```

## Internal Notes

Function models receive `initialState`, which is documented as retrieved from `html-model`.

# html-*

## Purpose

Bind standard HTML attributes to JavaScript expressions while keeping inactive attributes quiet before JavaScript loads.

## Syntax

```html
<img html-src="imageUrl" alt="">
<div html-class="loading ? 'is-loading' : ''"></div>
<button html-disabled="isSaving">Save</button>
```

## Parameters

- Attribute name after `html-`: the real DOM attribute to write.
- Expression string: value to evaluate.

## Rendering Behavior

Jails evaluates the expression and writes the real attribute after stripping the `html-` prefix.

## DOM Behavior

The source directive attribute is not intended to remain as the final public attribute. Boolean attributes are present only for truthy values and stripped for falsy values. Documented boolean attributes include `selected`, `checked`, `readonly`, `disabled`, and `autoplay`.

## Update Behavior

Re-evaluated after state changes. Attribute values change on the same element.

## Performance Characteristics

Efficient for scalar attributes. Use `html-src` to avoid premature network requests before JavaScript has valid URLs.

## Common Patterns

- Conditional classes.
- Delayed `src` values for images/iframes.
- Boolean form states.

## Anti-patterns

- Using `html-class` for very complex class composition inside markup.
- Assuming falsy boolean attributes remain with `"false"` values.

## Edge Cases

- Boolean attributes differ from string attributes: falsy removes the attribute.
- Attribute change listeners can observe changes with `on('[src]', 'iframe', callback)`.

## Example

```html
<my-component html-class="loading ? 'is-loading' : ''">
  <img html-src="imageUrl" alt="">
</my-component>
```

## Internal Notes

Docs explicitly say all `html-*` attributes accept JavaScript expressions and the template system strips the prefix.

# html-static

## Purpose

Create a static DOM region that Jails skips during virtual DOM updates/diffing.

## Syntax

```html
<div class="swiper" html-static>...</div>
<input type="number" value="1" html-static>
```

## Parameters

No value required.

## Rendering Behavior

The marked node and all children are excluded from Jails template updates after recognition.

## DOM Behavior

The browser, user input, or third-party library may mutate the subtree without Jails reconciling it back to template state. The node remains in DOM unless surrounding non-static directives remove it.

## Update Behavior

State updates skip the marked subtree. Directives and mustache expressions inside `html-static` should be treated as inert after the static boundary.

## Performance Characteristics

Reduces diff work for large immutable regions and prevents conflict with libraries that mutate DOM. Useful for form controls where browser-managed value persistence is desired.

## Common Patterns

- Third-party widgets such as Swiper or Chart.js wrappers.
- Inputs, textareas, and selects whose live value should be browser-owned.
- Static server-rendered markup inside an otherwise reactive component.

## Anti-patterns

- Placing dynamic text inside `html-static` and expecting it to update.
- Marking the entire component static when only one widget subtree needs protection.
- Mixing Jails-managed state writes with third-party mutation on the same DOM nodes.

## Edge Cases

- If an ancestor `html-if` removes the static node, the static subtree is still detached.
- Events from static children still bubble to component delegated listeners unless stopped.

## Example

```html
<app-swiper>
  <input type="number" value="1" min="1" max="9" html-static>
  <p>Chosen page: {{ page }}</p>
  <div class="swiper mySwiper" html-static>
    <div class="swiper-wrapper">
      <div class="swiper-slide">Slide 1</div>
    </div>
  </div>
</app-swiper>
```

```ts
import Swiper from 'swiper'

export default function appSwiper({ main, on, elm, state }) {
  const wrapper = elm.querySelector('.swiper')
  const swiper = new Swiper(wrapper)

  main(() => {
    on('input', 'input[type=number]', goTo)
  })

  const goTo = e => {
    const page = Number(e.target.value) || 1
    swiper.slideTo(page - 1)
    state.set({ page })
  }
}

export const model = {
  page: 1
}
```

## Internal Notes

Docs explicitly state `html-static` bypasses DOM diffing and skips virtual DOM updates for the specified node and children.

# mustache interpolation

## Purpose

Insert expression results into text positions in component HTML.

## Syntax

```html
<p>Hello, {{ name }}</p>
```

## Parameters

- Expression between configured delimiters. Default delimiters are `{{` and `}}`.

## Rendering Behavior

Expression result is written into the rendered text/content position.

## DOM Behavior

The text node content changes when the expression result changes.

## Update Behavior

Re-evaluated after state updates. Delimiters can be changed globally with `templateConfig({ tags: ['@{', '}'] })`.

## Performance Characteristics

Good for scalar output. Prefer derived values in `view` for formatting.

## Common Patterns

- Labels, counters, names.
- Displaying `$index` inside loops.

## Anti-patterns

- Large logic expressions.
- Expressions with side effects.

## Edge Cases

- Markers may be visible before JavaScript mounts unless placed inside native `<template>` or replaced by `html-inner` fallback.

## Example

```html
<p>Counter: {{ counter }}</p>
```

## Internal Notes

Docs state directives and mustache delimiters process values as valid JavaScript expressions.

# template element

## Purpose

Hide markup from initial page rendering until Jails or application logic needs it.

## Syntax

```html
<template>
  <div html-if="userData">Welcome, {{ userData.name }}!</div>
</template>
```

## Parameters

Native HTML `<template>` content.

## Rendering Behavior

The browser does not render `<template>` contents directly. Jails leverages this native behavior to prevent unresolved markers from appearing on initial load.

## DOM Behavior

Content remains inert in the template until cloned/processed by the template system.

## Update Behavior

Use inside component trees for data-dependent fragments that should not appear before data is available.

## Performance Characteristics

Improves first paint correctness by preventing placeholder flash. It does not itself optimize later diff cost unless combined with conditional/static directives.

## Common Patterns

- Data-dependent user panels.
- Fragments that should not show mustache placeholders before mount.

## Anti-patterns

- Wrapping all component HTML in `<template>` when SSR-visible content should appear immediately.

## Edge Cases

- Native template content is not displayed by the browser, so accessibility content inside it is unavailable until rendered.

## Example

```html
<my-component>
  <h1>Server-rendered heading</h1>
  <template>
    <div html-if="userData">Welcome, {{ userData.name }}!</div>
  </template>
</my-component>
```

## Internal Notes

This is native HTML behavior intentionally reused by Jails.

