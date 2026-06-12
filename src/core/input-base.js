import { html, nothing } from 'lit';
import { ifDefined } from '../modules/utilities.js';
import Keys from '../enums/Keys.js';
import PropValidatorMixin from '../mixins/prop-validator-mixin.js';
import UniqueIdGeneratorMixin from '../mixins/unique-id-generator-mixin.js';
import { lightMixins } from '../modules/mixin-utils.js';

/**
 * Base class for input components providing common functionality for form inputs.
 * @template {HTMLInputElement | HTMLSelectElement} TElement
 */
export default class InputBase extends lightMixins(PropValidatorMixin, UniqueIdGeneratorMixin) {
    // #region STATICS, FIELDS, GETTERS

    /**
     * Component reactive properties
     * @type {import('lit').PropertyDeclarations}
     */
    static get properties() {
        return {
            ...super.properties,
            name: { type: String },
            value: { type: String },
            label: { type: String },
            hideLabel: { type: Boolean, attribute: 'hide-label' },
            clearable: { type: Boolean, attribute: 'clearable' },
            placeholder: { type: String, reflect: true },
            required: { type: Boolean, reflect: true },
            ariaInvalid: { type: String, attribute: false, reflect: false },
            disabled: { type: Boolean, reflect: true },
            readonly: { type: Boolean, reflect: true },
        };
    }

    #focused = false; // Inputun odaklanıp odaklanmadığını takip eder

    /** @type {TElement | null} */
    inputElement = null; // DOM input elementi
    /** @type {string | null } */
    validationMessage = '';

    get focused() {
        return this.#focused;
    }

    get invalid() {
        return this.ariaInvalid === 'true' || this.ariaInvalid === 'grammar' || this.ariaInvalid === 'spelling';
    }
    set invalid(value) {
        this.ariaInvalid = value ? 'true' : undefined;
    }

    get fieldId() {
        return `${this.componentName}-${this.uniqueId}`;
    }
    get labelId() {
        return this.hideLabel ? null : `${this.componentName}-label-${this.uniqueId}`;
    }
    get errorId() {
        return this.validationMessage ? `${this.componentName}-error-${this.uniqueId}` : null;
    }

    get requiredValidationMessage() {
        return `${this.label} alanı gereklidir.`;
    }

    get requiredFields() {
        return [...super.requiredFields, 'label'];
    }

    // #endregion STATICS, FIELDS, GETTERS

    // #region LIFECYCLE METHODS
    constructor() {
        super();

        /** @type {string | number | boolean | null } */
        this.value = '';
        /** @type {string} Name attribute for the input field */
        this.name = '';
        /** @type {string} Label text for the input field */
        this.label = '';
        /** @type {boolean} Whether to hide the label visually */
        this.hideLabel = false;
        /** @type {string} Placeholder text for the input */
        this.placeholder = '';
        /** @type {boolean} Whether the input is required */
        this.required = false;
        /** @type {boolean} ARIA invalid state for accessibility */
        this.invalid = false;
        /** @type {boolean} Whether the input is disabled */
        this.disabled = false;
        /** @type {boolean} Whether the input is readonly */
        this.readonly = false;
        /** @type {boolean} Show clear button */
        this.clearable = false;
    }

    /** @override */
    connectedCallback() {
        super.connectedCallback();
        this.#firstUpdateCompleted();
    }

    updated(changed) {
        super.updated(changed);

        if (changed.has('value') && this.inputElement?.value !== this.value) {
            this.inputElement.value = /** @type {string} */ (this.value);
            this.dispatchCustomEvent('update');
        }
    }

    // #endregion LIFECYCLE METHODS

    // #region PUBLIC API

    /** Clears the input value and dispatches a 'clear' custom event. */
    clear() {
        this.value = '';
    }

    /** Clears the validation message and resets the invalid state. */
    clearValidation() {
        this.validationMessage = '';
        this.invalid = false;
        this.inputElement?.setCustomValidity(this.validationMessage);
    }

    /** Resets the input value to its initial state and clears any validation messages. */
    async reset() {
        const valueAttr = this.getAttribute('value');
        this.value = valueAttr || '';
        await this.updateComplete;
        this.clearValidation();
        this.#focused = false;
    }

    // validate() {}

    // #endregion PUBLIC API

    // #region EVENT LISTENERS

    /**
     * Clears the input value and dispatches a 'clear' custom event.
     * @param {Event} event The event that triggered the clear action.
     */
    onClearClick(event) {
        this.clear();
        this.dispatchCustomEvent('clear');
        this.inputElement.focus();
    }

    /**
     * Handles keydown events on the clear button
     * @param {KeyboardEvent} event The keyboard event triggered on the clear button.
     */
    onClearKeyDown(event) {
        /** @type {string[]} */ const stopKeys = [Keys.ENTER, Keys.SPACE];
        if (stopKeys.includes(event.key)) event.stopPropagation();
    }

    /**
     * Handles the form reset event by resetting the input value to its initial state and clearing any validation messages.
     * @param {Event} event
     */
    onFormReset(event) {
        requestAnimationFrame(this.reset.bind(this));
    }

    // #endregion EVENT LISTENERS

    // #region RENDER METHODS

    /**
     * Renders the label text for the input field. By default, it returns the value of the `label` property, but can be overridden by subclasses to provide custom label rendering logic.
     *
     * Implementation example for a required field with an asterisk:
     * ```javascript
     * renderLabelText() {
     *     return html`${this.label}${this.required ? html`<span>*</span>` : nothing}`;
     * }
     * ```
     * @return {import('lit').TemplateResult | string | typeof nothing}
     */
    renderLabelText() {
        return this.label;
    }

    /** @return {import('lit').TemplateResult | typeof nothing} */
    renderLabel() {
        return this.hideLabel ? nothing : html`<label id=${this.labelId} for=${this.fieldId}>${this.renderLabelText()}</label>`;
    }

    /** @return {import('lit').TemplateResult | typeof nothing} */
    renderClearButton() {
        if (!this.clearable || this.readonly || this.disabled) return nothing;
        return html`
            <button type="button" data-clear ?disabled=${!this.value} @click=${this.onClearClick} @keydown=${this.onClearKeyDown} aria-label="Değeri temizle">
                <svg fill="currentColor" viewBox="0 0 460.775 460.775" xml:space="preserve">
                    <path
                        d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55  c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55  c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505  c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55  l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719  c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"
                    />
                </svg>
            </button>
        `;
    }

    /**
     * Returns the HTML template for displaying validation error messages.
     * The span element includes ARIA attributes for accessibility and is hidden when no validation message exists.
     * @returns {import('lit').TemplateResult | typeof nothing} Lit HTML template with validation message
     */
    renderErrorMessage() {
        if (!this.validationMessage) return nothing;
        return html`<span id=${ifDefined(this.errorId)} data-role="error-message" aria-live="assertive">${this.validationMessage}</span>`;
    }
    // #endregion RENDER METHODS

    // #region PRIVATE METHODS
    async #firstUpdateCompleted() {
        await this.updateComplete;
        this.inputElement?.addEventListener('focus', () => (this.#focused = true), { once: true, capture: false });
        this.inputElement?.form?.addEventListener('reset', this.onFormReset.bind(this));
        // this.inputElement?.addEventListener('change', () => (this.#focused = false), { once: true, capture: false });
    }

    // #endregion PRIVATE METHODS
}

// required-sign akışı -> iptal isteyen render günceller
// basemodel iptal

// label renderi de taşımak gerekebilir.
// input ağacını belirle

// hide label input labelden taşınacak
// updated eventini test et her biri için
// base api
// inputElement nasıl ve ne zaman bağlanmalı. hook mu eklemeli yoksa getter mı?
// event listenerler private olmalı
// uniqueId mekanizması
// Selectbase options get set için T tipi kullanmayı dene
// typeahead veya autocomplete eklenecek

// ghost mask mixin dene
// uniqueId mixin dene

// digit-box ekle
