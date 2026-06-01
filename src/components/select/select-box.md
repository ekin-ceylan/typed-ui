# SelectBox Analysis Note

Purpose: This note captures the current SelectBox behavior and prior analysis so a new chat can continue without re-discovery.

## Scope

- Component: SelectBox
- File: src/components/select/select-box.js
- Related model flow: Option / OptionGroup / HtmlBaseModel / BaseModel
- Focus topic: slot + options API behavior for custom attributes (`data-*`, `aria-*`)

## Current Status (Implemented)

1. Safe attribute passthrough support is now implemented at model level.

- `dataset` (prefixless keys) is supported and rendered with `data-` prefix.
- `ariaset` (prefixless keys) is supported and rendered with `aria-` prefix.

2. Shared HTML model behavior has been extracted.

- `HtmlBaseModel` now defines shared fields:
    - `hidden`
    - `dataset`
    - `ariaset`

3. ARIA collection from slotted DOM nodes is implemented.

- `HtmlBaseModel.postInit` reads `aria-*` from `HTMLElement` inputs and maps them to prefixless `ariaset` keys.

4. Type-compiler issue for hook override was fixed.

- `BaseModel` now defines a typed static-constructor contract (`BaseModelCtor`) so `this.postInit(...)` is type-safe in `init`.

5. Build status

- `npm run build` succeeds after these changes.

## Current Data Flow

1. Input options can come from:

- `options` property
- slotted `<option>` / `<optgroup>` nodes

2. Both paths are normalized into model objects:

- Option
- OptionGroup

3. Rendering is model-driven:

- SelectBox renders `this.#optionList.map(option => option.htmlElement)`
- Option and OptionGroup define the final DOM template and apply:
    - `spread(dataset, 'data-')`
    - `spread(ariaset, 'aria-')`

## Key Technical Findings

1. Normalization is still allowlist-based by design.

- `BaseModel.init` only copies keys declared on model instances.
- Unknown attributes are still ignored.

2. Known custom attribute channels are now explicit.

- `dataset` and `ariaset` are first-class model fields.
- This keeps behavior controlled and predictable.

3. Slot and options APIs are aligned for supported channels.

- Slot path: `ariaset` can be auto-filled from `HTMLElement` aria attrs via `postInit`.
- Options API path: caller must provide `dataset` / `ariaset` explicitly.

## Existing Guardrails in SelectBox

1. `options` must be an array; otherwise TypeError.
2. If `options` property is already set, slotted nodes are ignored with warning.
3. In default slot, only option/optgroup node types are accepted.

## Current API Contract

1. Option/OptionGroup model payload supports:

- core fields (`value`, `label`, `selected`, etc.)
- `dataset: Record<string, string | number | boolean | null | undefined>`
- `ariaset: Record<string, string | null | undefined>`

2. Prefix rule:

- `dataset` keys are prefixless and rendered with `data-`.
- `ariaset` keys are prefixless and rendered with `aria-`.

3. Options API usage:

- For non-DOM input objects, caller must pass `dataset` / `ariaset` explicitly.

4. Scope limit:

- No generic unrestricted passthrough.
- Unknown keys continue to be ignored.

## API Examples

1. Options API example (option-level):

```js
host.options = [
    {
        value: 'ank',
        label: 'Ankara',
        dataset: { trackingId: 'city-ank' },
        ariaset: { label: 'Ankara option' },
    },
];
```

2. Options API example (optgroup-level):

```js
host.options = [
    {
        label: 'Turkey',
        dataset: { region: 'tr' },
        ariaset: { label: 'Turkey cities' },
        options: [{ value: 'ank', text: 'Ankara' }],
    },
];
```

3. Prefix reminder:

- `dataset` and `ariaset` keys are prefixless.
- Example: `dataset.testId` -> `data-testId`, `ariaset.label` -> `aria-label`.

## Non-Goals

- No unrestricted passthrough for arbitrary attributes.
- No event attribute passthrough such as `onclick` / `on*`.
- No style passthrough via model payload.
- No implicit support promise for prefixed payload keys like `data-test` or `aria-label`.

## Why This Direction

1. Maintains component safety and predictability.
2. Enables practical use cases:

- test selectors (`data-testid`, `data-*`)
- analytics metadata
- accessibility refinements (`aria-*`)

3. Avoids opening a broad attack/misuse surface.

## Remaining Work

1. Add/refresh tests for the new contract:

- options API: `dataset` and `ariaset` rendering
- slot path: aria collection into `ariaset`
- parity checks between slot and options paths

2. Decide whether dataset key normalization should be kebab-cased.

- Current prefixing behavior is direct (`prefix + key`).
- If needed, add a normalization policy and tests.

## Historical Note

- Earlier state: custom attrs were dropped end-to-end.
- Current state: controlled custom attrs are supported through explicit `dataset`/`ariaset` fields.

## Suggested Next Step for New Chat

Use this note as baseline context, then:

1. Confirm exact public API examples for docs.
2. Add regression tests for both input paths.
3. Decide and lock dataset key-normalization behavior.

## Quick Summary

SelectBox now supports controlled custom attrs through explicit model fields (`dataset`, `ariaset`) and prefixed rendering (`data-`, `aria-`). The BaseModel hook typing issue is resolved, build is passing, and the main pending work is contract tests plus dataset key-normalization policy.
