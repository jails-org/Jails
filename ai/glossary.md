# Glossary

- Component: a JavaScript module attached to each matching custom element instance.
- Controller: the default export function of a component module.
- Model: required export that initializes component state.
- View: optional export that maps state to render-only values.
- Template: optional export that returns embedded HTML for a component.
- Directive: an HTML attribute interpreted by Jails, such as `html-if` or `html-for`.
- Mustache: default interpolation syntax `{{ expression }}`.
- Render scope: object used to evaluate directives and mustache expressions, normally state transformed by `view`.
- State: component-local mutable data managed by the `state` helper.
- `state.set`: method that updates state and schedules DOM updates.
- Next tick: work performed after `state.set()` resolves its Promise.
- Event delegation: listening at the component root and matching child selectors.
- `delegateTarget`: Jails-added event property containing the matched delegated element.
- Static boundary: a node marked `html-static` whose subtree is skipped by Jails updates.
- Logic featured component: component that supplies behavior for externally provided HTML.
- Fully featured component: component that includes embedded HTML via `template`.
- Dependency injection: passing dependencies through `register()` to the component `dependencies` helper.
- Pub/sub: global publish/subscribe communication for components in separate DOM trees.
- `emit`: helper for bubbling DOM CustomEvents upward.
- `trigger`: helper for programmatically dispatching events.
- `effect`: lifecycle helper for reacting to parent prop updates.
- `unmount`: lifecycle helper for cleanup when the component element is detached.
- SSR: server-side rendering. Jails can enhance SSR HTML.
- SSG: static site generation. Jails can enhance static HTML.
- Island: a focused interactive region inside a mostly static page.

