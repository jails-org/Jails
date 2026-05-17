# Event Flow

## Delegation

`on(event, selector, callback)` attaches one listener to the component root. When an event bubbles, Jails walks from `event.target` to the component root and calls the callback for matching ancestors.

`event.delegateTarget` is the matched element.

## Root Events

`on(event, callback)` listens on the component root. `event.delegateTarget` is the component root.

## Attribute Observers

`on('[src]', 'iframe', callback)` observes attribute changes within the component root. The callback receives:

```ts
{
  target,
  attribute,
  value
}
```

## Component Communication

- Parent to child: state forwarding after parent render.
- Child to parent: bubbling `emit()`.
- Cross tree: `publish()` and `subscribe()`.

## Cleanup

Event listeners registered with `on()` use `AbortController` and are removed on disconnect. Global subscriptions and external resources must be cleaned with `unmount()`.

