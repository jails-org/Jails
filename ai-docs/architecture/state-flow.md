# State Flow

## Initial State

Initial component state is composed in this order:

```txt
loop scope -> module model -> html-model
```

`html-model` overrides keys from the module model. A functional model receives:

```ts
{ elm, initialState, dependencies }
```

## Update State

Use `state.set(data)` or `state.set(fn)`.

- Object form merges keys.
- Function form mutates the current internal state object.
- Both schedule a render.
- Calls are debounced with `setTimeout`.

## Save Without Render

`state.save(data | fn)` changes local state without rendering. Use it for cached values or internal data that does not affect the DOM.

## Derived View Data

`view(state)` returns additional render values. If it returns the same object, that object is rendered. If it returns a different object, Jails merges `state` and the view result.

`view()` must be deterministic and side-effect free.

