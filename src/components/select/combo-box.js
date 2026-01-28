import { html } from 'lit';
import { ifDefined } from '../../modules/utilities.js';
import SelectBase from './select-base.js';

/** @extends {SelectBase<HTMLInputElement>} */
export default class ComboBox extends SelectBase {
    // #region STATICS, FIELDS, GETTERS

    static properties = {
        ...super.properties,
        selectedOption: { type: Object, state: true, attribute: false }, // internal
        filter: { type: String, state: false }, // Filtre metni
        nativeBehavior: { type: Boolean, attribute: 'native-behavior' }, // native select gibi davranır
        activeIndex: { type: Number, state: true, attribute: false },
        directionUp: { type: Boolean, attribute: false, reflect: false }, // açılır kutu yönü
    };

    /** @type {ComboBoxOption[]} */
    #optionList = [];
    /** @type {ComboBoxOption | null} */
    #selectedOption = null;
    #options = [];

    get filteredOptions() {
        if (!this.filter) {
            return this.#optionList;
        }

        return this.#optionList?.filter(opt => {
            const searchValue = this.filter?.toLowerCase() || '';
            const optionText = opt.label.toLowerCase();
            return optionText.includes(searchValue);
        });
    }

    get options() {
        return this.#options;
    }
    set options(val) {
        if (!Array.isArray(val)) {
            throw new TypeError('options must be an array');
        }
        this.#options = val;
        this.#optionList = this.options.map(o => {
            const opt = this.#toListElement(o);
            opt.selected && this.#onSelect(opt);
            return opt;
        });

        this.requestUpdate();
    }

    // #endregion STATICS, FIELDS, GETTERS

    constructor() {
        super();

        /** @type {ComboBoxOption[]} */
        this.options = [];
        /** @type {ComboBoxOption | null} */
        this.selectedOption = null;
        /** @type {string} */
        this.filter = '';
        /** @type {Boolean} */
        this.nativeBehavior = false;

        this.activeIndex = -1;
    }

    // #region LIFECYCLE METHODS
    firstUpdated() {
        this.inputElement = this.renderRoot.querySelector('input[data-role="value"]');
        /** @type {HTMLInputElement} */
        this.searchElement = this.renderRoot.querySelector('input[data-role="search"]');
        /** @type {HTMLDivElement} */
        this.displayElement = this.renderRoot.querySelector('div[data-role="display"]');
        /** @type {HTMLDivElement} */
        this.comboboxDiv = this.renderRoot.querySelector('div[role="combobox"]');
        /** @type {HTMLDivElement} */
        this.listboxDiv = this.renderRoot.querySelector('div[role="listbox"]');
        this.clearButton = this.renderRoot.querySelector('button[data-role="clear"]');

        this.#setInputAndDisplay(this.#selectedOption);

        if (globalThis.getComputedStyle(this.listboxDiv).overscrollBehavior != 'contain') this.listboxDiv.style.overscrollBehavior = 'contain';
    }

    handleValueUpdate() {
        const matchedOption = this.#optionList.find(o => o.value === this.value) || null;
        matchedOption && this.#onSelect(matchedOption);
        this.dispatchCustomEvent('update');
    }

    disconnectedCallback() {
        super.disconnectedCallback();

        if (this.isOpen) {
            this.#unlockBodyScroll();
        }
    }

    // #endregion LIFECYCLE METHODS

    /**
     * @override Validates nodes for slot binding.
     * @param {HTMLElement|Text} node
     * @param {String} slotName
     * @returns {Boolean}
     */
    validateNode(node, slotName) {
        if (slotName != 'default') return true;

        const hasOptions = this.options?.length > 0;
        const isAllowedType = node instanceof HTMLOptionElement;

        if (hasOptions) {
            console.warn('Options are already set via property. Ignoring slotted nodes.');
            return false;
        }

        if (!isAllowedType) {
            console.error('Only <option> elements are allowed as children of <combo-box>.');
            return false;
        }

        const option = this.#parseOption(node);
        this.#optionList.push(option);
        option.selected && this.#onSelect(option);

        return false;
    }

    /**
     * @override Clears the current selection.
     */
    clear() {
        super.clear();
        this.#onSelect(null);
    }

    // #region EVENT LISTENERS

    /**
     * Handles focus out event to close the list.
     * @param {FocusEvent} e
     */
    onFocusOut(e) {
        const rt = e.relatedTarget;
        const isNode = rt instanceof Node || rt instanceof Element;

        if (isNode && this.contains(rt)) return;

        this.#closeList();
    }

    onFocusSearch(_e) {
        this.#openList();
    }

    onFocusValue(e) {
        e.target.parentElement.focus();
    }

    onInputSearch(e) {
        this.filter = e.target.value;
        this.activeIndex = 0;
        this.#scrollToActive();
    }

    onKeydown(e) {
        if (e.target === this.clearButton) return;

        const isArrowKey = e.key === 'ArrowDown' || e.key === 'ArrowUp';
        const key = e.key;

        if (key === 'Escape') {
            this.#closeList();
            this.comboboxDiv.focus();
        } else if (this.nativeBehavior && isArrowKey) {
            e.preventDefault();
            const [option, idx] = this.#getAdjacentOption(key === 'ArrowDown');

            if (option) {
                this.activeIndex = idx;
                this.#onSelect(option);
                this.#scrollToActive();
            }
        } else if (isArrowKey && this.isOpen) {
            e.preventDefault();
            this.activeIndex = this.#getAdjacentIndex(key === 'ArrowDown');
            this.#scrollToActive();
        } else if (this.isOpen && (key === 'Tab' || key === 'Enter')) {
            e.preventDefault();

            if (this.nativeBehavior) {
                this.#closeList();
            } else {
                /** @type {HTMLDivElement} */
                const opt = this.renderRoot.querySelector('div[role="option"][data-active]');
                opt.click();
            }

            this.comboboxDiv.focus();
        } else if (!this.isOpen && (key === ' ' || key === 'Enter')) {
            e.preventDefault();
            this.searchElement.focus();
        }

        // yazmaya başladığımızda arama yapılır
    }

    onInvalid(_e) {
        // e.preventDefault(); // mesaj baloncuğu çıkmaz
        this.#checkValidity();
    }

    onFormSubmit(e) {
        if (!this.#checkValidity()) {
            e.preventDefault();
        }
    }

    onOptionClick(option) {
        this.#onSelect(option);
        this.#closeList();
    }

    // #endregion EVENT LISTENERS

    // #region PRIVATE METHODS
    /**
     * Handles option selection.
     * @param {ComboBoxOption} selectedOption
     */
    #onSelect(selectedOption) {
        this.dispatchCustomEvent('input');

        if (this.#selectedOption === selectedOption) return;

        this.#selectedOption && (this.#selectedOption.selected = false);
        this.#selectedOption = selectedOption;
        this.#selectedOption && (this.#selectedOption.selected = true);
        this.selectedOption = { value: selectedOption?.value, label: selectedOption?.label };
        this.#setInputAndDisplay(selectedOption);
        this.value = selectedOption?.value || null;
        this.dispatchCustomEvent('change');
    }

    #setInputAndDisplay(selectedOption) {
        if (!this.inputElement || !this.displayElement) return;

        this.inputElement.value = selectedOption?.value || '';
        this.displayElement.innerHTML = selectedOption?.innerHTML || this.placeholder;
    }

    #checkValidity() {
        const el = this.inputElement;
        const v = el.validity;

        el.setCustomValidity('');
        this.invalid = !v?.valid;
        this.validationMessage = v?.valueMissing ? this.requiredValidationMessage : '';
        el.setCustomValidity(this.validationMessage);

        return !this.validationMessage;
    }

    /**
     * Gets the adjacent option based on the current selection.
     * @param {Boolean} next
     * @returns {[ComboBoxOption|null, number]} The adjacent option and its index.
     */
    #getAdjacentOption(next) {
        const direction = next ? 1 : -1;
        let idx = this.filteredOptions.indexOf(this.#selectedOption) + direction;
        while (this.filteredOptions[idx]?.disabled) idx += direction;
        const option = this.filteredOptions[idx] || null;

        return [option, idx];
    }

    /**
     * Gets the adjacent index based on the current active index.
     * @param {Boolean} next
     * @returns {number} The adjacent index.
     */
    #getAdjacentIndex(next) {
        const direction = next ? 1 : -1;
        let idx = this.activeIndex + direction;
        while (this.filteredOptions[idx]?.disabled) idx += direction;

        return this.filteredOptions[idx] ? idx : this.activeIndex;
    }

    #scrollToActive(instant = false) {
        requestAnimationFrame(() => {
            const listbox = this.renderRoot.querySelector('div[role="listbox"]');
            const option =
                this.renderRoot.querySelector('div[role="listbox"] div[role="option"][data-active]') ||
                this.renderRoot.querySelector('div[role="listbox"] div:nth-child(1 of [role="option"])');

            if (!option || !listbox) return;

            const optionRect = option.getBoundingClientRect();
            const listRect = listbox.getBoundingClientRect();
            const offset = optionRect.top - listRect.top;
            const scroll = listbox.scrollTop + (offset - listRect.height / 2 + optionRect.height / 2);
            listbox.scrollTo({ top: scroll, behavior: instant ? 'auto' : 'smooth' });
        });
    }

    #openList() {
        this.isOpen = true;
        this.listboxDiv?.showPopover();
        this.#lockBodyScroll();
        this.#calcListSizeAndDirection();
        this.dispatchCustomEvent('open');
        this.activeIndex = this.filteredOptions.indexOf(this.#selectedOption);
        this.#scrollToActive(true);
    }

    #closeList() {
        this.isOpen = false;
        this.listboxDiv?.hidePopover();
        this.#unlockBodyScroll();
        this.searchElement.blur();
        this.filter = '';
        this.activeIndex = -1;
        this.#checkValidity();
        this.dispatchCustomEvent('close');
    }

    #calcListSizeAndDirection() {
        requestAnimationFrame(() => {
            const rect = this.comboboxDiv.getBoundingClientRect();
            const listbox = this.listboxDiv;
            const style = globalThis.getComputedStyle(listbox);

            const maxHeight = Number.parseFloat(style.maxHeight) || window.innerHeight;
            const borderTop = Number.parseFloat(style.borderTopWidth) || 0;
            const borderBottom = Number.parseFloat(style.borderBottomWidth) || 0;

            const topEdge = rect.top;
            const bottomEdge = rect.bottom;
            const borderY = borderTop + borderBottom;
            const spaceBelow = window.innerHeight - bottomEdge;
            const spaceAbove = topEdge;
            const listHeight = Math.min(listbox.scrollHeight + borderY, maxHeight);

            this.directionUp = spaceBelow < listHeight && spaceAbove > spaceBelow;

            if (this.directionUp) {
                const effectiveHeight = Math.min(listHeight, spaceAbove);
                listbox.style.height = `${effectiveHeight}px`;
                listbox.style.top = `${topEdge - effectiveHeight}px`;
            } else {
                const effectiveHeight = Math.min(listHeight, spaceBelow);
                listbox.style.height = `${effectiveHeight}px`;
                listbox.style.top = `${bottomEdge}px`;
            }

            listbox.style.minWidth = `${rect.width}px`;
            this.requestUpdate();
        });
    }

    #lockBodyScroll() {
        globalThis.addEventListener('scroll', this.#preventDefault, { passive: true, capture: true });
        globalThis.addEventListener('wheel', this.#preventDefault, { passive: false });
        globalThis.addEventListener('touchmove', this.#preventDefault, { passive: false });
    }

    #unlockBodyScroll() {
        globalThis.removeEventListener('scroll', this.#preventDefault, { capture: true });
        globalThis.removeEventListener('wheel', this.#preventDefault);
        globalThis.removeEventListener('touchmove', this.#preventDefault);
    }

    #preventDefault = e => {
        const el = this.listboxDiv;
        const path = e.composedPath();
        const isInside = path.includes(el);

        if (e.type === 'scroll') {
            if (!isInside) this.#closeList();
            return;
        }

        if (!isInside) {
            e.preventDefault();
            return;
        }

        const delta = e.deltaY;
        const scrollTop = el.scrollTop;
        const scrollHeight = el.scrollHeight;
        const height = el.clientHeight;

        const noScroll = scrollHeight <= height;
        const cannotScrollUp = delta < 0 && scrollTop <= 0;
        const cannotScrollDown = delta > 0 && scrollTop + height >= scrollHeight - 1;

        if (noScroll || cannotScrollUp || cannotScrollDown) {
            e.preventDefault();
        }
    };

    /**
     * @typedef {Object} ComboBoxOption
     * @property {string} value
     * @property {string} label
     * @property {boolean} [disabled]
     * @property {boolean} [selected]
     * @property {string} [innerHTML]
     * Parses an HTMLOptionElement into a plain object.
     * @param {HTMLOptionElement } opt
     * @returns {ComboBoxOption}
     */
    #parseOption(opt) {
        const isSelected = opt.selected || this.value === opt.value;

        return {
            value: opt.value,
            label: opt.textContent?.trim() || opt.label || opt.value,
            disabled: !!opt.disabled,
            selected: isSelected,
            innerHTML: opt.innerHTML || opt.label || opt.value,
        };
    }

    #createOptionId(index) {
        return `${this.fieldId}-option-${index}`;
    }

    #optToDiv(opt, i) {
        const isActive = this.activeIndex === -1 ? opt.selected : this.activeIndex === i;
        const optionId = this.#createOptionId(i);

        return html`
            <div
                id=${optionId}
                role="option"
                ?data-active=${isActive && this.isOpen}
                data-value=${opt.value}
                ?aria-disabled=${!!opt.disabled}
                ?aria-selected=${opt.selected}
                @click=${opt.disabled ? undefined : _e => this.onOptionClick(opt)}
                @mouseenter=${_e => {
                    this.activeIndex = i;
                }}
                .innerHTML=${opt.innerHTML}
            ></div>
        `;
    }

    #toListElement(raw) {
        if (raw instanceof HTMLOptionElement || typeof raw === 'object') {
            return this.#parseOption(raw);
        }

        if (typeof raw === 'string' || typeof raw === 'number') {
            const opt = /** @type {HTMLOptionElement} */ ({ value: String(raw), label: String(raw) });
            return this.#parseOption(opt);
        }

        throw new TypeError(`Invalid option entry: ${String(raw)}`);
    }

    // #endregion PRIVATE METHODS

    /** @override @protected @returns {import('lit').TemplateResult} */
    render() {
        const activeDescendantId = this.activeIndex >= 0 ? this.#createOptionId(this.activeIndex) : undefined;

        return html`
            ${this.labelHtml}
            <div
                role="combobox"
                aria-activedescendant=${ifDefined(activeDescendantId)}
                ?data-open=${this.isOpen}
                ?data-filtered=${!!this.filter}
                ?data-has-value=${this.inputElement?.value}
                ?data-up=${this.directionUp}
                tabindex="0"
                @focusout=${this.onFocusOut}
                @keydown=${this.onKeydown}
            >
                <input
                    id=${ifDefined(this.fieldId)}
                    name=${ifDefined(this.fieldName || this.fieldId)}
                    type="text"
                    ?required=${this.required}
                    aria-labelledby=${ifDefined(this.labelId)}
                    aria-label=${ifDefined(this.hideLabel ? this.label : undefined)}
                    aria-errormessage=${ifDefined(this.required ? this.errorId : undefined)}
                    aria-required=${this.required ? 'true' : 'false'}
                    aria-invalid=${ifDefined(this.ariaInvalid)}
                    aria-readonly="true"
                    @invalid=${this.onInvalid}
                    @focus=${this.onFocusValue}
                    data-role="value"
                    tabindex="-1"
                />
                <div data-role="display" aria-haspopup="listbox" .innerHTML=${this.placeholder}></div>
                <input
                    type="search"
                    .value=${this.filter || ''}
                    autocomplete="off"
                    spellcheck="false"
                    aria-expanded=${this.isOpen}
                    aria-labelledby=${ifDefined(this.labelId)}
                    @focus=${this.onFocusSearch}
                    @input=${this.onInputSearch}
                    data-role="search"
                    tabindex="-1"
                />
                ${this.required ? null : this.btnClear} ${this.chevron}
                <div id=${this.fieldId + '-list'} role="listbox" popover="manual" aria-expanded=${this.isOpen ? 'true' : 'false'}>
                    <div aria-disabled ?hidden=${this.filteredOptions?.length > 0}>
                        <slot name="no-options">${this.noOptionsLabel}</slot>
                    </div>
                    ${this.filteredOptions.map(this.#optToDiv.bind(this))}
                </div>
            </div>
            ${this.required ? this.validationMessageHtml : null}
        `;
    }
}

// clear butonunu klavyeden tetikle
// search forma dahil edilmemeli
// aria-activedescendant="opt-3"
// aria-controls
// value var ama seçeneklerde yok -> seçenekler güncellendiğinde vlaue eşleşmeli
