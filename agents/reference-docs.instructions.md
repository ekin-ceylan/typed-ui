# Reference Docs Standard (.reference.md)

This repository uses sidecar reference docs to make module behavior discoverable without repeated deep analysis.

## Scope

- Applies to every file matching `**/*.reference.md`.
- Preferred placement is next to the source module it documents.
- Naming convention:
    - `text-box.js` -> `text-box.reference.md`
    - `combo-box.js` -> `combo-box.reference.md`

## Purpose of a .reference.md File

A `.reference.md` file is an operational module guide for AI agents and developers.
It must be sufficient for safe maintenance work with minimal re-discovery.

## Required Template

Use the section order below unless a section is not relevant.
When not relevant, write `N/A` instead of deleting the section.

**Formatting clarification:**

- The document must start with an H1 title in this format: `<ModuleName> Reference for AI Agents`.
- Do not create a separate `Title` section/subheading in the body.
- Section numbering in headings is optional. You may use numbered or unnumbered headings, as long as the required section order is preserved.

### 1) Purpose

- 1-3 sentences on what the module does and why it exists.

### 2) Scope

- Component/module name
- Source file path
- Related tests path(s)
- Related story/docs path(s)
- Base/parent dependencies if important

### 3) Core Intent

- User-facing behavior intent
- Main mode(s) or feature variants (if any)

### 4) Runtime State Model

- Important private/public state fields
- Derived state definitions

### 5) Critical Invariants

- Non-negotiable behavior guarantees that changes must preserve
- Use numbered list

### 6) Input Contract

- Supported input shapes/types
- Invalid inputs and expected failures
- Normalization rules

### 7) Data Flow

- Input -> normalization -> model/state -> render/output flow
- Mention key transformation points

### 8) Event and Behavior Flow

- Open/close/select/update flow (or module-equivalent lifecycle flow)
- Events dispatched and when

### 9) Interaction Contract (when applicable)

- Keyboard/mouse/touch behavior
- Closed/open (or inactive/active) state differences

### 10) Accessibility Contract (when applicable)

- Required roles/attributes/linkages
- Validation/accessibility guarantees

### 11) Security and Risk Notes

- Known unsafe surfaces
- Areas likely to regress

### 12) Test Coverage Map

- Existing tests that protect behavior
- Missing tests that should be added

### 13) Change Policy for Agents

- Constraints for safe edits
- What must be tested after edits

### 14) API Examples

- At least one realistic usage snippet
- Include edge-case example if helpful

### 15) Quick Answer Cheatsheet

- 5-10 bullets with high-signal facts for rapid responses

## Quality Rules

- Be specific, not generic. Prefer concrete contracts over broad descriptions.
- Keep behavior statements verifiable by code or tests.
- Distinguish clearly between current behavior and proposed future work.
- Separate facts from assumptions.
- Do not promise behavior that is not implemented.

## Maintenance Rules

Update the corresponding `.reference.md` whenever these change:

- Public API or input contract
- State model or critical invariants
- Accessibility/validation semantics
- Event dispatch behavior
- Keyboard/interaction rules
- Security-sensitive rendering/escaping logic

## Review Checklist (for PRs touching module behavior)

- Reference doc still matches implementation.
- Invariants still valid.
- Examples still executable/accurate.
- Test coverage section updated for new behavior.
- Risks section updated if new surface area introduced.

## Notes from Existing Repository References

- `combo-box.reference.md` is the structural baseline for format quality.
- `select-box.reference.md` has strong analysis depth and examples; prefer adding explicit operational sections (interaction, accessibility, tests, change policy, cheatsheet) when updating it.
