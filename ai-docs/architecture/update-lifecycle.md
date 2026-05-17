# Update Lifecycle

## Mount Lifecycle

1. Browser connects a registered custom element.
2. Generated element class creates an `AbortController`.
3. If the node has no `tplid`, `start(this)` compiles it as a dynamic target.
4. `Component()` builds helpers and initial state.
5. Initial render runs.
6. Component helper object is stored in an internal `WeakMap`.
7. The module default controller runs.
8. `:mount` is dispatched.
9. `main()` callbacks run after `:mount`.

## State Update Lifecycle

1. Handler calls `state.set(data | fn)`.
2. Jails verifies the root is still in `document.body`.
3. Internal state is merged or mutated.
4. Render is scheduled with a debounced timeout.
5. `view(state)` derives render-only data if present.
6. Template render function returns HTML.
7. `Idiomorph.morph()` updates the component root.
8. `html-static` nodes are skipped.
9. Child component roots are skipped and receive forwarded state separately.
10. Transient loop scope is cleared.
11. The `state.set()` promise resolves.

## Unmount Lifecycle

1. Browser disconnects the custom element.
2. `:unmount` is dispatched.
3. `AbortController.abort()` removes listeners registered with the signal.
4. User cleanup registered with `unmount(fn)` runs.

## AI Notes

- Generate cleanup for anything not covered by the abort signal.
- Do not assume `main()` runs synchronously during controller construction.
- Use the `state.set()` promise when subsequent code depends on rendered DOM.

