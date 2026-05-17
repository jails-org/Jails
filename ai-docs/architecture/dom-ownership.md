# DOM Ownership Model

## Owner Types

- Server or static generator owns initial HTML.
- Jails owns dynamic directive updates inside a component root.
- Child Jails components own their own roots.
- Browser controls may own internal value state when marked `html-static`.
- Third-party libraries own DOM islands marked `html-static`.

## Parent and Child Components

During parent morphing, a nested component root is not morphed. The parent stores the next loop scope on the child and asks the child component to update with forwarded parent state.

Forwarded state excludes keys registered with `state.protected()`.

## Static DOM

`html-static` on a node makes `beforeNodeMorphed` return `false`. The node and its children remain untouched by the morph.

Use it for:

- third-party widgets
- uncontrolled form fields
- canvas-managed content
- DOM mutated by browser APIs

Do not use it for DOM that should reflect Jails state.

