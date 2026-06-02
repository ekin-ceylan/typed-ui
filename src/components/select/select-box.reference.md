# SelectBox Reference for AI Agents

## Purpose

`SelectBox` is a Lit-based select input component that supports both slotted native/custom option nodes and an `options` property API. It exists to provide a consistent input-base experience (labeling, validation, clear button, events) while keeping option normalization and rendering controlled.

## Scope

- Component/module name: `SelectBox`
- Source file path: `src/components/select/select-box.js`
- Related tests path(s): `src/tests/select-inputs/select-box.test.js`
- Related story/docs path(s):
    - `stories/components/select/selectbox/select-box.overview.mdx`
    - `stories/components/select/selectbox/select-box.playground.mdx`
    - `stories/components/select/selectbox/select-box.stories.js`
- Base/parent dependencies:
    - `src/core/select-base.js`
    - `src/models/Option.js`
    - `src/models/OptionGroup.js`
    - `src/models/HtmlBaseModel.js`
    - `src/models/BaseModel.js`

## Core Intent

- User-facing behavior intent:
    - Render a `<select>` with optional placeholder and no-options fallback.
    - Accept options from either slot content or `options` property (with guardrails).
    - Keep `host.value` and `<select>.value` synchronized through user interactions and model updates.
    - Preserve required-state validation semantics inherited from input base flow.
- Main mode(s) or feature variants:
    - Slot-driven options mode (`<option>`, `<optgroup>`, `<custom-option>`, `<custom-optgroup>`)
    - Property-driven options mode (`host.options = [...]`)

## Runtime State Model

- Important private/public state fields:
    - `#optionList: (Option | OptionGroup)[]` normalized render list.
    - `#options: any[]` raw `options` property payload.
    - `#mouseFlag: boolean` tracks mousedown/mouseup open/close behavior.
    - `options` getter/setter enforces array input and normalizes entries.
    - `hasOptions` derived from `#optionList.length > 0`.
    - Inherited fields (from `SelectBase` / input base chain): `value`, `isOpen`, `required`, `invalid`, `validationMessage`, etc.
- Derived state definitions:
    - `noOptionHtml`: disabled fallback option rendered only when there are no normalized options and `noOptionsLabel` is truthy.

## Critical Invariants

1. `options` setter must reject non-array input with `TypeError('options must be an array')`.
2. When `options` property has entries, default-slot option nodes are ignored and a warning is emitted.
3. For default slot parsing, only option/optgroup node types are accepted; invalid node types are rejected and logged.
4. Rendered option nodes come from normalized `Option`/`OptionGroup` models (`#optionList`), not raw payload objects.
5. `dataset` and `ariaset` are explicit allowlisted channels for custom attributes at model level; unknown payload keys remain ignored by `BaseModel.init`.
6. `Option.postInit` must only read `label` attribute for `HTMLOptionElement` sources (object payloads must not be treated as DOM nodes).
7. Validation UI state (`invalid`, `validationMessage`, `aria-invalid`, error message node) is driven by native select validity plus component rules and should remain consistent after blur/change/clear/invalid flow.

## Input Contract

- Supported input shapes/types:
    - `options` accepts arrays containing:
        - `Option` / `OptionGroup` instances
        - `HTMLOptionElement` / `HTMLOptGroupElement`
        - `string` / `number` (normalized into `{ value: String(x), text: String(x) }`)
        - plain objects for option/group payloads
    - Slotted default children support:
        - native `<option>`, `<optgroup>`
        - custom `<custom-option>`, `<custom-optgroup>`
- Invalid inputs and expected failures:
    - Non-array assignment to `options` throws `TypeError`.
    - Invalid default-slot child element returns `false` from `validateNode` and logs error.
    - When `options` already has data, slotted defaults are rejected (`validateNode` returns `false`) and warning is logged.
- Normalization rules:
    - Group-like detection uses `options`, `children`, or collection types (`HTMLCollection`, `HTMLOptionsCollection`, `NodeList`).
    - `BaseModel.init` only assigns keys that already exist on model instance.
    - `HtmlBaseModel` defines `hidden`, `dataset`, `ariaset`.
    - ARIA attributes from DOM-based input are collected into `ariaset` via `HtmlBaseModel.postInit`.
    - Rendering applies `spread(dataset, 'data-')` and `spread(ariaset, 'aria-')`.

## Data Flow

- Input -> normalization -> model/state -> render/output:
    - `options` path: external payload -> `#toOptionElement` -> `Option.init`/`OptionGroup.init` -> `#optionList` -> template map to `htmlElement`.
    - Slot path: slot collector -> `validateNode` -> `Option.init(node)` / `OptionGroup.init(node)` -> `#optionList`.
    - Model render path:
        - `Option.htmlElement` renders `<option>` with selected/disabled/hidden/value/label and custom attr spreads.
        - `OptionGroup.htmlElement` renders `<optgroup>` and child options recursively.
    - Select template renders placeholder option + `noOptionHtml` + normalized options.
- Key transformation points:
    - Primitive entries (`string`/`number`) become option objects.
    - Group detection selects `OptionGroup` vs `Option` model.
    - DOM-sourced ARIA attributes are converted to prefixless `ariaset` keys, then re-prefixed at render.

## Event and Behavior Flow

- Open/close/select/update lifecycle:
    - `mousedown` toggles `isOpen`, sets mouse flag.
    - `mouseup` closes depending on target/flag.
    - `keydown` opens on Space/Enter.
    - `keyup` closes on Escape/Tab/Enter.
    - `input` updates `value`, dispatches custom `input` event.
    - `change` updates `value`, closes dropdown, validates, dispatches custom `change` event.
    - `blur` closes dropdown and validates.
    - `invalid` forces validation state update.
    - Clear button clears value (via base), then dispatches `input` and `change`, then validates.
- Events dispatched and when:
    - `input`, `change`: from corresponding handlers and clear flow.
    - `validate`: dispatched from `#checkValidity` with `{ validationMessage }`.

## Interaction Contract

- Keyboard behavior:
    - `Enter`/`Space` keydown sets `isOpen = true`.
    - `Escape`/`Tab`/`Enter` keyup sets `isOpen = false`.
- Mouse behavior:
    - `mousedown` toggles open state.
    - `mouseup` closes according to option-target/flag logic.
- Closed/open differences:
    - `isOpen` is reflected only through internal state and data attributes (`?data-open`) for styling/behavior hooks.

## Accessibility Contract

- Required roles/attributes/linkages (current behavior):
    - Label-linking via `for`/`id` and `aria-labelledby` when visible label is used.
    - `aria-label` used when `hide-label` is active.
    - `aria-required` is always set (`'true'` or `'false'`).
    - `aria-errormessage` is set only in required/error state as rendered by input-base flow.
    - `aria-invalid` mirrors invalid state.
    - Option/optgroup `aria-*` values can come from `ariaset` in property payload and from slotted DOM ARIA extraction.
- Validation/accessibility guarantees:
    - Required empty selection surfaces error message content and invalid state after interaction.
    - Valid selection clears required error and related ARIA error linkage.

## Security and Risk Notes

- Known unsafe or sensitive surfaces:
    - Custom attribute channels (`dataset`, `ariaset`) are intentionally narrow allowlists. Expanding this to unrestricted passthrough would widen misuse surface.
    - `spread` behavior directly reflects provided keys to attributes (`data-`/`aria-` prefix only); no automatic key casing normalization is enforced here.
- Areas likely to regress:
    - Dual-source initialization (DOM node vs plain object) in model `postInit` hooks.
    - Slot-vs-options precedence behavior and warning/error signaling.
    - Validation lifecycle coupling between focus/blur/change/invalid/clear paths.

## Test Coverage Map

- Existing tests protecting behavior (`src/tests/select-inputs/select-box.test.js`):
    - Accessibility linkage (`label`, `aria-labelledby`, `aria-label`, required semantics).
    - Required validation show/clear behavior.
    - Slotted option and optgroup parsing (native + custom nodes).
    - No-options fallback rendering.
    - Clear button behavior.
    - `options` property normalization basics and array-type guard.
    - `dataset`/`ariaset` rendering for option and optgroup payloads.
    - Slotted ARIA attribute collection to rendered nodes.
    - `validateNode` guard behavior.
    - Keyboard open/close handlers and invalid handler behavior.
- Missing tests that should be added:
    - More granular precedence tests when both slot content and `options` are updated over time.
    - Explicit tests for primitive (`string`/`number`) option entries preserving display/value expectations.
    - Edge tests for dataset/aria key-shape normalization policy (camelCase vs kebab-case), if policy is formalized.

## Change Policy for Agents

- Constraints for safe edits:
    - Preserve allowlist model (`BaseModel.init` key filter); do not introduce unrestricted attribute passthrough without explicit decision.
    - Keep `Option.postInit` source-type guarding intact for dual-path input safety.
    - Keep `options` array guard and slot precedence warning behavior unless intentionally changing API contract.
    - Avoid changing event names (`input`, `change`, `validate`) without coordinated downstream updates.
- What must be tested after edits:
    - Run `src/tests/select-inputs/select-box.test.js`.
    - Re-test validation-related behavior (required blur/change/clear).
    - Re-test both input paths (slot and `options` property), including `dataset`/`ariaset` output.

## API Examples

Realistic options API usage:

```js
host.options = [
    {
        value: 'ank',
        label: 'Ankara',
        dataset: { trackingId: 'city-ank' },
        ariaset: { label: 'Ankara option' },
    },
    {
        label: 'Turkey',
        dataset: { region: 'tr' },
        ariaset: { label: 'Turkey cities' },
        options: [{ value: 'ist', text: 'Istanbul' }],
    },
];
```

Edge-case example (primitive entries + strict array contract):

```js
host.options = ['one', 2]; // valid: normalized to option models

host.options = /** @type {any} */ ('nope');
// throws TypeError: options must be an array
```

## Quick Answer Cheatsheet

- `SelectBox` supports two option sources: slot content and `options` property.
- `options` must be an array; otherwise a `TypeError` is thrown.
- If `options` already has data, slotted default nodes are ignored with a warning.
- Default-slot valid children are only option/optgroup (native and custom select variants).
- Normalized render list is private `#optionList` of `Option | OptionGroup`.
- `dataset` and `ariaset` are explicit custom-attribute channels.
- `dataset` keys render with `data-` prefix; `ariaset` keys render with `aria-` prefix.
- DOM-sourced ARIA attributes are harvested into `ariaset` in `HtmlBaseModel.postInit`.
- Required validation state is synchronized to `aria-invalid` and error-message rendering.
- `validate` custom event is emitted with `{ validationMessage }` after validity checks.
