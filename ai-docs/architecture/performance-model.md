# Performance Model

## Core Assumptions

- Components should be small islands.
- HTML is rendered by the server, static generator, or component template.
- JavaScript enhances only the interactive areas.
- Delegated events reduce listener count.
- DOM morphing preserves stable nodes where possible.
- `html-static` avoids work for externally owned subtrees.

## Cost Centers

- Large component roots increase morphing work.
- Expensive directive expressions run during render.
- Large `html-for` lists can re-render many nodes.
- Parent state updates may trigger child updates.
- Third-party DOM can conflict with morphing unless isolated.

## Recommended Optimizations

- Split large interactive areas into focused custom elements.
- Keep list rows as child components when each row has behavior.
- Use `html-static` for widgets, uncontrolled inputs, canvas, and browser-owned DOM.
- Use `state.save()` for values that do not affect rendering.
- Keep `view()` pure and cheap.
- Prefer event delegation over per-node listeners.

## Anti-Optimizations

- Global stores for every component.
- Large parent components that own unrelated UI.
- Manual DOM caching that conflicts with morphing.
- Complex expressions in HTML attributes.
- Re-rendering on every keystroke when native form state is enough.

