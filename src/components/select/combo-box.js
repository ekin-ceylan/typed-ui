import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import SelectBase from './select-base.js';

export default class ComboBox extends SelectBase {
    // #region STATICS, FIELDS, GETTERS

    static properties = {
        selectedOption: { type: Object, state: true, attribute: false }, // internal
        filter: { type: String, state: false }, // Filtre metni
        nativeBehavior: { type: Boolean, attribute: 'native-behavior' }, // native select gibi davranır
        activeIndex: { type: Number, state: true, attribute: false },
    };

    /** @type {ComboBoxOption[]} */ #optionList = [];
    #options = [];
    /** @type {ComboBoxOption | null} */ #selectedOption = null;

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

        /** @type {ComboBoxOption[]} */ this.options = [];
        /** @type {ComboBoxOption | null} */ this.selectedOption = null;
        this.activeIndex = -1;
    }

    // #region LIFECYCLE METHODS
    firstUpdated() {
        this.inputElement = this.renderRoot.querySelector('input[data-role="value"]');
        this.searchElement = this.renderRoot.querySelector('input[data-role="search"]');
        this.displayElement = this.renderRoot.querySelector('div[data-role="display"]');
        this.comboboxDiv = this.renderRoot.querySelector('div[role="combobox"]');
        this.clearButton = this.renderRoot.querySelector('button[data-role="clear"]');

        this.#setInputAndDisplay(this.#selectedOption);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);

        if (name === 'value' && this.value != newValue) {
            this.value = newValue;
            const matchedOption = this.#optionList.find(o => o.value === this.value) || null;
            matchedOption && this.#onSelect(matchedOption);

            this.updateComplete.then(() => {
                this.dispatchEvent(new CustomEvent('update', this.#eventInitDict()));
            });
        }
    }

    // #endregion LIFECYCLE METHODS

    /**
     * @override @protected Binds the collected nodes to the combo box options.
     * @param {NodeList} collectedNodes - The nodes to bind.
     */
    bindSlots(collectedNodes) {
        const hasOptions = this.options?.length > 0;

        for (const node of collectedNodes) {
            if (!hasOptions && node instanceof HTMLOptionElement) {
                const option = this.#parseOption(node);
                this.#optionList.push(option);
                option.selected && this.#onSelect(option);
            }

            node.remove(); // remove all nodes
        }

        this.requestUpdate();
    }

    // #region EVENT LISTENERS

    /**
     * Handles focus out event to close the list.
     * @param {FocusEvent} e
     */
    onFocusOut(e) {
        if (this.contains(e.relatedTarget)) return;

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
                this.renderRoot.querySelector('div[role="option"][data-active]')?.click();
            }

            this.comboboxDiv.focus();
        } else if (!this.isOpen && (key === ' ' || key === 'Enter')) {
            e.preventDefault();
            this.searchElement.focus();
        }
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
        this.dispatchEvent(new CustomEvent('input', this.#eventInitDict()));

        if (this.#selectedOption === selectedOption) return;

        this.#selectedOption = selectedOption;
        this.selectedOption = { value: selectedOption?.value, label: selectedOption?.label };
        this.#setInputAndDisplay(selectedOption);
        this.value = selectedOption?.value || null;
        this.dispatchEvent(new CustomEvent('change', this.#eventInitDict()));
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
        this.ariaInvalid = !v?.valid;
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
        this.dispatchEvent(new CustomEvent('open', this.#eventInitDict()));
        this.activeIndex = this.filteredOptions.indexOf(this.#selectedOption);
        this.#scrollToActive(true);
    }

    #closeList() {
        this.isOpen = false;
        this.searchElement.blur();
        this.filter = '';
        this.activeIndex = -1;
        this.#checkValidity();
        this.dispatchEvent(new CustomEvent('close', this.#eventInitDict()));
    }

    #clear() {
        this.#onSelect(null);
    }

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
        const isSelected = opt.selected || this.inputElement?.value === opt.value;
        const isActive = this.activeIndex === -1 ? isSelected : this.activeIndex === i;
        const optionId = this.#createOptionId(i);

        return html`
            <div
                id=${optionId}
                role="option"
                ?data-active=${isActive && this.isOpen}
                data-value=${opt.value}
                ?aria-disabled=${!!opt.disabled}
                ?aria-selected=${isSelected}
                @click=${opt.disabled ? undefined : _e => this.onOptionClick(opt)}
                @mouseenter=${_e => {
                    this.activeIndex = i;
                }}
            >
                ${unsafeHTML(opt.innerHTML)}
            </div>
        `;
    }

    #toListElement(raw) {
        if (raw instanceof HTMLOptionElement || typeof raw === 'object') {
            return this.#parseOption(raw);
        }

        if (typeof raw === 'string' || typeof raw === 'number') {
            const opt = { value: String(raw), label: String(raw) };
            return this.#parseOption(opt);
        }

        throw new TypeError(`Invalid option entry: ${String(raw)}`);
    }

    #eventInitDict() {
        return {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: {
                value: this.selectedOption?.value || null,
                label: this.selectedOption?.label || '',
                open: this.isOpen,
                synthetic: true,
            },
        };
    }

    // #endregion PRIVATE METHODS

    /** @override @protected @returns {import('lit').TemplateResult} */
    render() {
        const activeDescendantId = this.activeIndex >= 0 ? this.#createOptionId(this.activeIndex) : undefined;
        const btnClear = html`
            <button type="button" class="indicator btn-clear" ?disabled=${!this.value} @click=${this.#clear} data-role="clear" aria-label="Seçimi temizle">
                <svg fill="currentColor" viewBox="0 0 460.775 460.775" xml:space="preserve">
                    <path
                        d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55  c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55  c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505  c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55  l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719  c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"
                    />
                </svg>
            </button>
        `;

        const chevron = html` <svg class="indicator chevron" width="24" height="24" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>`;

        return html`
            ${this.labelHtml}
            <div
                role="combobox"
                aria-activedescendant=${ifDefined(activeDescendantId)}
                ?data-open=${this.isOpen}
                ?data-filtered=${!!this.filter}
                ?data-has-value=${this.inputElement?.value}
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
                    aria-errormessage=${ifDefined(this.required ? this.errorId : undefined)}
                    aria-required=${this.required ? 'true' : 'false'}
                    ?aria-invalid=${this.ariaInvalid}
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
                ${this.required ? null : btnClear} ${chevron}
                <div id=${this.fieldId + '-list'} role="listbox" aria-expanded=${this.isOpen ? 'true' : 'false'}>
                    <div aria-disabled ?hidden=${this.filteredOptions?.length > 0}>Kayıt Bulunamadı</div>
                    ${this.filteredOptions.map(this.#optToDiv.bind(this))}
                </div>
            </div>
            ${this.required ? this.validationMessageHtml : null}
        `;
    }
}

customElements.define('combo-box', ComboBox);

// search forma dahil edilmemeli
// aria-activedescendant="opt-3"
// aria-controls
// value var ama seçeneklerde yok -> seçenekler güncellendiğinde vlaue eşleşmeli
