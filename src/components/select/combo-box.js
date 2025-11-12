import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import InputBase from '../../core/input-base.js';
import SlotCollectorMixin from '../../mixins/slot-collector-mixin.js';

export default class ComboBox extends SlotCollectorMixin(InputBase) {
    // #region STATICS, FIELDS, GETTERS

    static properties = {
        options: { type: Array }, // [{ value, label }]
        selectedOption: { type: Object, state: true, attribute: false }, // internal
        isOpen: { state: false }, // Açık / kapalı (yaklaşık)
        filter: { type: String, state: false }, // Filtre metni
        disabled: { type: Boolean, reflect: true },
    };

    static get observedAttributes() {
        const base = super.observedAttributes ?? [];
        return [...base, 'value', 'options']; // Lit’in kendi listesi + listem
    }

    /** @type {ComboBoxOption[]} */ #optionList = [];
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

    // #endregion STATICS, FIELDS, GETTERS

    // #region EVENT LISTENERS

    onFocusOut(e) {
        if (this.contains(e.relatedTarget)) return;

        this.#closeList();
    }

    onFocus(_e) {
        this.#openList();
    }

    onFocusValue(e) {
        e.target.parentElement.focus();
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

    // #endregion EVENT LISTENERS

    constructor() {
        super();

        this.value = null;
        this.label = '';
        this.placeholder = 'Seçiniz';
        this.required = false;
        this.isOpen = false;
        /** @type {ComboBoxOption[]} */ this.options = [];
        /** @type {ComboBoxOption | null} */ this.selectedOption = null;
    }

    // #region LIFECYCLE METHODS
    firstUpdated() {
        this.inputElement = this.renderRoot.querySelector('input[data-role="value"]');
        this.searchElement = this.renderRoot.querySelector('input[data-role="search"]');
        this.displayElement = this.renderRoot.querySelector('div[data-role="display"]');
    }

    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);

        if (name === 'value' && this.value != newValue) {
            this.value = newValue;
            const matchedOption = this.#optionList.find(o => o.value === this.value) || null;
            matchedOption && this.#onInput(matchedOption);

            this.updateComplete.then(() => {
                this.dispatchEvent(new CustomEvent('update', this.#eventInitDict()));
            });
        } else if (name === 'options') {
            if (!Array.isArray(this.options)) {
                throw new TypeError('options must be an array');
            }

            this.#optionList = this.options.map(o => {
                const opt = this.#toListElement(o);
                opt.selected && this.#onInput(opt);
                return opt;
            });

            this.requestUpdate();
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
                option.selected && this.#onInput(option);
            }

            node.remove(); // remove all nodes
        }

        this.requestUpdate();
    }

    /**
     * Handles option selection.
     * @param {Object} selectedOption
     */
    #onInput(selectedOption) {
        this.isOpen = false;

        if (this.#selectedOption === selectedOption) return;

        this.#selectedOption = selectedOption;
        this.selectedOption = { value: selectedOption?.value, label: selectedOption?.label };
        this.inputElement.value = selectedOption?.value || '';
        this.value = selectedOption?.value || null;
        this.#closeList();
        this.dispatchEvent(new CustomEvent('input', this.#eventInitDict()));
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

    #openList() {
        this.isOpen = true;
    }
    #closeList() {
        this.isOpen = false;
        this.filter = '';
        this.displayElement.innerHTML = this.#selectedOption?.innerHTML || this.placeholder;
        this.#checkValidity();
    }

    #clear() {
        this.#onInput(null);
        this.dispatchEvent(new CustomEvent('input', this.#eventInitDict()));
        this.dispatchEvent(new CustomEvent('change', this.#eventInitDict()));
    }

    /**
     *
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

    #optToDiv(opt) {
        const isSelected = opt.selected || this.inputElement.value === opt.value;

        return html`
            <div role="option" data-value=${opt.value} ?aria-disabled=${!!opt.disabled} ?aria-selected=${isSelected} @click=${_e => this.#onInput(opt)}>
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

    #eventInitDict(originalEvent) {
        return {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: {
                originalEvent,
                synthetic: !(originalEvent && originalEvent instanceof Event),
            },
        };
    }

    /** @override @protected @returns {import('lit').TemplateResult} */
    render() {
        const btnClear = html`
            <button type="button" class="indicator btn-clear" ?disabled=${!this.value} @click=${this.#clear} aria-label="Seçimi temizle">
                <svg fill="currentColor" viewBox="0 0 460.775 460.775" xml:space="preserve">
                    <path
                        d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55  c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55  c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505  c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55  l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719  c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"
                    />
                </svg>
            </button>
        `;

        return html`
            ${this.labelHtml}
            <div role="combobox" ?data-open=${this.isOpen} ?data-filtered=${!!this.filter} tabindex="0" @focusout=${this.onFocusOut}>
                <input
                    id=${ifDefined(this.fieldId)}
                    name=${ifDefined(this.fieldName || this.fieldId)}
                    type="text"
                    .value=${this.value ?? ''}
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
                    data-role="search"
                    autocomplete="off"
                    spellcheck="false"
                    aria-expanded=${this.isOpen}
                    aria-labelledby=${ifDefined(this.labelId)}
                    @focus=${this.onFocus}
                    @input=${e => (this.filter = e.target.value)}
                    tabindex="-1"
                />
                ${this.required ? null : btnClear}
                <svg class="indicator chevron" width="24" height="24" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
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
