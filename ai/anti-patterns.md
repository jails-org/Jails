# Anti-patterns

## Side effects in template expressions

Why harmful: directive and mustache expressions are render logic. Side effects can run repeatedly and unpredictably during updates.

Symptoms: duplicate requests, counters changing during render, inconsistent DOM.

Performance impact: unnecessary I/O or CPU work on every update.

Recommended alternative: move side effects into controller functions called from `main()` or event handlers.

## Deeply nested `html-for`

Why harmful: repeated loops multiply DOM creation and update work.

Symptoms: slow state updates, input lag, large DOM trees.

Performance impact: O(n*m) or worse render work depending on nesting and directives.

Recommended alternative: flatten data, paginate, virtualize, or make heavy regions static/external.

## Mutating Jails-managed DOM with third-party libraries

Why harmful: Jails may diff the same subtree and overwrite external mutations.

Symptoms: widgets reset after state updates, duplicated nodes, lost event state.

Performance impact: unnecessary reconciliation and library reinitialization.

Recommended alternative: put the external library subtree under `html-static`.

## Assuming `state.set()` updates DOM synchronously

Why harmful: docs expose a Promise specifically for after-update work.

Symptoms: focus/measure code reads old nodes or missing new nodes.

Performance impact: repeated layout work or failed retries.

Recommended alternative: use `state.set(...).then(...)`.

## Using `event.target` in delegated handlers

Why harmful: the real event target may be a child inside the selected element.

Symptoms: missing `dataset`, wrong element updates, brittle DOM traversal.

Performance impact: extra defensive queries.

Recommended alternative: use `event.delegateTarget`.

## Global pub/sub for local parent-child communication

Why harmful: global channels hide ownership and make event flow harder to trace.

Symptoms: unrelated components reacting to events, forgotten unsubscriptions.

Performance impact: unnecessary global fan-out.

Recommended alternative: use `emit()` and delegated `on()` for DOM-reachable communication.

## Storing browser-owned input values in state unnecessarily

Why harmful: every keystroke can trigger state updates and DOM reconciliation.

Symptoms: cursor jumps, overwritten user input, excessive renders.

Performance impact: high-frequency input renders.

Recommended alternative: use normal inputs or `html-static` and read values on submit/input handlers.

## Giant embedded `template` functions

Why harmful: large string templates mix structure, rendering rules, and business assumptions.

Symptoms: difficult review, duplicated markup, hard-to-test components.

Performance impact: more client-side HTML generation where server-rendered HTML may be cheaper.

Recommended alternative: use logic-featured components with external HTML, or split template fragments.

## Undeclared state shape

Why harmful: missing model keys make templates and controllers less inferable.

Symptoms: `undefined` render output, inconsistent initial branches.

Performance impact: extra defensive conditions and update churn.

Recommended alternative: define all local state keys in `model`.

## Expensive derived values stored as persistent state

Why harmful: render-only values clutter state and can become stale.

Symptoms: duplicated fields such as `counter` and `counterLabel` falling out of sync.

Performance impact: extra state writes.

Recommended alternative: use pure `view(state)` for render-only derivations.

