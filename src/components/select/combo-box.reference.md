# ComboBox Reference for AI Agents

## Purpose

This document is a self-sufficient operational guide for ComboBox.
It exists so AI agents and developers can answer behavior questions and implement safe changes without repeated deep discovery.
All behavior claims here are intended to be verifiable from implementation and tests.

## Scope

- Component: ComboBox
- Source file: [src/components/select/combo-box.js](src/components/select/combo-box.js)
- Primary tests: [src/tests/select-inputs/combo-box.test.js](src/tests/select-inputs/combo-box.test.js)
- Story behavior reference: [stories/components/select/combobox/combo-box.overview.mdx](stories/components/select/combobox/combo-box.overview.mdx)
- Base class: SelectBase

## Core Intent

ComboBox provides a searchable select experience with two keyboard modes:

- Default mode: open list, navigate active option, select with Enter.
- Native-like mode (`native-behavior`): arrow keys can change selection while closed, and active option is committed on close.

It must keep form semantics, accessibility attributes, and value-display synchronization consistent.

## Runtime State Model

- `#optionList`: normalized internal option list.
- `#options`: external `options` payload source.
- `#selectedOption`: internal selected option reference.
- `selectedOption`: public snapshot object `{ value, label }`.
- `filter`: current search query.
- `activeIndex`: currently active option index for keyboard navigation.
- `isOpen`: popover open state.
- `directionUp`: whether the list opens upward.
- `#focused`: interaction gate for delayed validation feedback.

Derived state:

- `filteredOptions`:
    - returns all options when `filter` is empty.
    - otherwise applies case-insensitive `label.includes(filter)`.

## Critical Invariants

Any code change must preserve all invariants below:

1. Selection consistency:
    - previous internal selection is cleared before setting a new one.
    - selected flags in option objects are accurate.
2. Value consistency:
    - on selection change, `value`, hidden value input, display content, and `selectedOption` stay in sync.
3. Close reset:
    - on list close, `filter === ''` and `activeIndex === -1`.
4. Validation timing:
    - required error is not shown before first user interaction (`#focused` gate), unless forced.
5. Lifecycle cleanup:
    - global listeners and scroll lock are always removed when closing/unmounting.
6. Accessibility wiring:
    - `aria-activedescendant` points to a valid option id only when an active option exists.
7. Input contract:
    - assigning non-array `options` throws `TypeError`.

## Input Contract

Supported input items for `options` normalization:

- `HTMLOptionElement`
- object-like option payload
- string
- number

Slot rules:

- If `options` property is already populated, slotted default nodes are ignored.
- In default slot, only `<option>` elements are accepted.

Invalid input:

- non-array assignment to `options` must throw.

## Data Flow

1. Input source:
    - options are provided by either the `options` property or default-slot option nodes.
2. Normalization:
    - values are converted into a uniform internal option object shape in `#optionList`.
3. Selection mapping:
    - internal selected reference is tracked in `#selectedOption`.
    - public selected snapshot is mirrored in `selectedOption`.
4. Value/render mapping:
    - selected option updates hidden value input, display container content, and component `value`.
5. Filtered projection:
    - `filteredOptions` projects current list using case-insensitive label matching.
6. Render output:
    - listbox options render with role and aria attributes; active option is linked through `aria-activedescendant`.

## Event and Behavior Flow

### Open flow

1. If already open, no-op.
2. Set `isOpen = true`.
3. Show list popover.
4. Lock scrolling and attach global listeners (`scroll`, `pointerdown`, `resize`).
5. Recalculate list size and opening direction.
6. Dispatch `open`.
7. Set `activeIndex` to currently selected option index.
8. Scroll active option into view.

### Close flow

1. If `nativeBehavior` is true, commit active option before closing.
2. Set `isOpen = false` and hide popover.
3. Remove global listeners and unlock scrolling.
4. Blur search input.
5. Reset `filter` and `activeIndex`.
6. Run validity check.
7. Dispatch `close`.

### Selection flow

1. Call internal selection handler.
2. Clear previous selected flag.
3. Set new selected flag.
4. Update public `selectedOption` snapshot.
5. Update hidden input and display area.
6. Set `value`.
7. Dispatch `input` and `change`.

## Interaction Contract

### Closed state

- `Enter` or `Space`: open list and focus search input.
- `ArrowDown` or `ArrowUp`:
    - default mode: no direct commit while closed.
    - native mode: move to adjacent option and commit immediately.
- `Escape`: close and focus combobox container.

### Open state

- `ArrowDown` or `ArrowUp`: move active option and auto-scroll.
- `Enter`:
    - default mode: commit active option.
    - then close and focus combobox container.
- `Tab`: close without explicit commit in default mode, then focus container.
- `Escape`: close and focus container.

## Accessibility Contract

Must keep the following semantics intact:

- Roles: `combobox`, `listbox`, `option`.
- Labeling:
    - visible label path uses `aria-labelledby`.
    - hidden label path uses `aria-label`.
- Validation attrs: `aria-required`, `aria-invalid`, `aria-errormessage`.
- Active option linkage: `aria-activedescendant`.

## Security and Risk Notes

- `innerHTML` usage in option/render pipeline can be unsafe with untrusted content.
- External invalid `value` assignments may clear selection; UX expectations should be explicit.
- Missing listener cleanup can cause leaks and side effects.
- Keyboard and validation flows are coupled to open/close lifecycle; partial edits can introduce regressions.

## Positioning Contract

List positioning logic must keep these guarantees:

- Open upward when below-space is insufficient and above-space is better.
- Clamp list height to available viewport space.
- Keep horizontal alignment anchored to combobox (`left`, `minWidth`).

## Test Coverage Map

Existing tests currently protect:

- Label and input accessibility linkage.
- Hide-label path.
- Required semantics and error rendering.
- Option parsing and selected behavior.
- Keyboard open, navigate, and select.
- Click-to-select and close.
- Filtering behavior.
- Error cleared after valid selection.
- `options` array validation.

Reference tests: [src/tests/select-inputs/combo-box.test.js](src/tests/select-inputs/combo-box.test.js)

Missing or weakly covered areas to add:

- Outside-click and global-scroll close behavior parity.
- Resize-triggered close behavior.
- Direction-up positioning branch and max-height clamping behavior.
- Native mode commit-on-close behavior for non-Enter close paths.

## Change Policy for Agents

1. Limit each patch to one behavior axis when possible (selection, keyboard, validation, positioning).
2. Keep public behavior and ARIA contracts stable unless change is explicitly requested.
3. Re-check lifecycle cleanup when touching open/close logic.
4. Add or update tests for any new behavior.
5. Avoid combining structural refactor and behavior change in one patch unless unavoidable.

## API Examples

Default HTML usage:

```html
<combo-box field-id="city" label="City" placeholder="Pick a city">
    <option value="ank">Ankara</option>
    <option value="ist">Istanbul</option>
</combo-box>
```

Using the options property:

```js
const host = document.querySelector('combo-box');
host.options = [
    { value: 'ank', label: 'Ankara' },
    { value: 'ist', label: 'Istanbul', disabled: true },
];
```

Edge-case input validation:

```js
const host = document.querySelector('combo-box');
// Throws TypeError: options must be an array
host.options = 'not-an-array';
```

## Quick Answer Cheatsheet

Use these facts for fast responses in chat:

- ComboBox uses a hidden value input plus display div and search input.
- `options` must be an array.
- Default keyboard mode commits selection with Enter while open.
- Native mode can commit via arrows while closed and commits active option on close.
- Required validation feedback is interaction-gated.
- `open` and `close` custom events are dispatched on list state transitions.
