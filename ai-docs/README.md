# Jails AI Docs

This directory is an AI-first documentation corpus generated from the Jails framework source, existing docs, README examples, and architecture notes.

## Structure

- `canonical/`: idiomatic examples with metadata.
- `directives/`: machine-readable directive contracts.
- `patterns/`: recommended implementation patterns.
- `anti-patterns/`: unsafe or unstable patterns and migrations.
- `architecture/`: runtime mental models and system behavior.
- `schemas/`: JSON schemas for AI and IDE integrations.
- `training/`: JSONL instruction examples.
- `examples/`: space for expanded examples.
- `tests/`: behavioral contracts extracted from implementation and docs.
- `playbooks/`: generation and refactor workflows.

## Source Basis

- Framework source: `/Users/edu/Sites/jails-org/jails/src`
- Types: `/Users/edu/Sites/jails-org/jails/types.d.ts`
- Existing docs: `docs/reference`, `docs/web-components.md`, `_architecture`
- README examples: `/Users/edu/Sites/jails-org/jails/readme.md`

No formal test suite was found in the analyzed framework repo. Test contracts are therefore source-derived.

