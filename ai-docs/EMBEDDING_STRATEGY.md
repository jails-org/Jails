# Embedding Strategy

## Chunk Priority

1. Canonical examples
2. Test contracts
3. Directive reference
4. Architecture documents
5. Anti-pattern library
6. API and helper summaries
7. Training JSONL rows

## Chunking Rules

- Chunk by file section, not by fixed token count, when headings are available.
- Keep each canonical example as one chunk including metadata, HTML, JavaScript, invariants, and anti-patterns.
- Keep each directive JSON object as one chunk.
- Keep each pattern or anti-pattern object as one chunk.
- Keep architecture chunks under one conceptual topic: rendering, DOM ownership, state flow, event flow, lifecycle, performance, SSR.

## Metadata

Attach these fields to each chunk:

```json
{
  "framework": "jails-js",
  "contentType": "canonical-example | directive | pattern | anti-pattern | architecture | test-contract | schema | playbook",
  "topic": "",
  "source": "repo-derived",
  "stability": "stable | internal | inferred",
  "retrievalPriority": 1
}
```

## Retrieval Guidance

- For code generation, retrieve canonical examples first, then directive reference, then coding guidelines.
- For bug fixing, retrieve test contracts, anti-patterns, and the relevant directive object.
- For architecture questions, retrieve `LLM.md`, rendering model, DOM ownership model, and state flow.
- For IDE hints, retrieve directive schema plus directive reference.
- For refactors, retrieve pattern library and anti-pattern migration notes.
- For lifecycle or API questions, retrieve `architecture/update-lifecycle.md` and `architecture/api-contracts.md`.

## Weighting

- Canonical examples: 35 percent
- Test contracts: 20 percent
- Directives: 20 percent
- Architecture: 15 percent
- Anti-patterns: 10 percent

## Exclusions

- Do not embed generated Docusaurus boilerplate.
- Do not embed minified or bundled output unless source files are absent.
- Do not prioritize marketing descriptions over runtime contracts.
