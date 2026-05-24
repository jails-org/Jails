# FAQ

## What is Jails?

Jails is a JavaScript framework for enhancing custom elements in existing HTML. Components are behavior modules attached to DOM islands.

## Does Jails require client-side rendering for the whole page?

No. The documented model favors SSR, SSG, CMS, or static HTML for first paint, then Jails enhances selected components.

## How do updates happen?

Use `state.set()`. Jails updates directive-managed DOM and resolves the returned Promise after the DOM update cycle.

## Is `state.set()` synchronous?

Do not rely on synchronous DOM updates. Use `state.set(...).then(...)` for post-render work.

## How does event delegation work?

`on(event, selector, callback)` attaches listening behavior to the component root and matches child elements by selector. Use `event.delegateTarget` to access the matched element.

## When should I use `emit()`?

Use `emit()` for child-to-parent or local DOM-tree communication. It dispatches bubbling custom events.

## When should I use `publish()` and `subscribe()`?

Use global pub/sub for components in different DOM trees where bubbling DOM events do not provide a natural path.

## How should stores be structured?

Use component-local state as the default. Parent components may pass props down. Use global pub/sub for messages, not as a hidden global state replacement unless the application deliberately builds that layer.

## How do directives interact?

Nested directives evaluate inside the scope of their parent. `html-for` adds item variables such as the item alias and `$index`; nested `html-if` can conditionally render content per item. `html-static` stops updates for its node and children.

## How does `html-if` affect DOM state?

Falsy conditions remove the node from rendered output according to docs examples. Treat state inside that subtree as discarded when removed.

## How does `html-for` preserve items?

The docs do not specify keyed reconciliation. Assume repeated output is based on iterable order. Avoid relying on per-item DOM preservation unless verified against runtime source.

## Why use `html-static`?

Use it when a subtree is immutable, browser-owned, or mutated by an external library. Jails skips diffing the node and children.

## What are boolean `html-*` attributes?

Attributes such as `selected`, `checked`, `readonly`, `disabled`, and `autoplay` are present for truthy expressions and removed for falsy expressions.

## What is the difference between `html-inner` and mustache?

Both output expression values. `html-inner` targets a specific element and allows fallback content before JavaScript mounts.

## How do I avoid mustache placeholders flashing before mount?

Use server-rendered fallback content with `html-inner`, or place data-dependent fragments inside native `<template>`.

## How do reusable components receive services?

Pass services through `register(name, module, dependencies)` and read them from the component `dependencies` helper.

## How should cleanup work?

Register cleanup with `unmount()` for subscriptions, timers, observers, and third-party library instances.

