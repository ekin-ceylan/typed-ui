import { html } from 'lit';
import { ifDefined } from '../modules/utilities.js';
import LightComponentBase from './light-component-base';

/**
 * Base class for input components providing common functionality for form inputs.
 * This is an abstract class that must be extended and have onFormSubmit() implemented.
 * @template {HTMLInputElement | HTMLSelectElement} TElement
 * @abstract @extends LightComponentBase
 */
export default class InputBase extends LightComponentBase {
    /**
     * Component reactive properties
     * @type {import('lit').PropertyDeclarations}
     */
    static properties = {
        ...super.properties,
        fieldId: { type: String, attribute: 'field-id' },
        fieldName: { type: String, attribute: 'field-name' },
        inputClass: { type: String, attribute: 'input-class' },
        value: { type: String },
        label: { type: String },
        hideLabel: { type: Boolean, attribute: 'hide-label' },
        placeholder: { type: String, reflect: true },
        required: { type: Boolean, reflect: true },
        ariaInvalid: { type: String, attribute: false, reflect: false },
        disabled: { type: Boolean, reflect: true },
    };

    get invalid() {
        return this.ariaInvalid === 'true' || this.ariaInvalid === 'grammar' || this.ariaInvalid === 'spelling';
    }

    set invalid(value) {
        this.ariaInvalid = value ? 'true' : undefined;
    }

    /** @type {string} */
    #value = null;

    /** @type {TElement | null} */
    inputElement = null; // DOM input elementi
    /** @type {string | null } */
    validationMessage = '';
    /** @type {string | null } */
    unmaskedValue = null;

    get value() {
        return this.#value;
    }
    set value(val) {
        this.#value = val;
        if (val === this.inputElement?.value) return;
        this.requestUpdate('value');
        this.updateComplete.then(this.handleValueUpdate.bind(this));
    }

    get inputLabel() {
        return this.label && this.label + (this.required ? '*' : '');
    }
    get labelId() {
        return this.fieldId && !this.hideLabel ? `${this.fieldId}-label` : null;
    }
    get errorId() {
        return this.fieldId ? `${this.fieldId}-error` : null;
    }
    /**
     * Returns the HTML template for displaying validation error messages.
     * The span element includes ARIA attributes for accessibility and is hidden when no validation message exists.
     * @returns {import('lit').TemplateResult} Lit HTML template with validation message
     */
    get validationMessageHtml() {
        return html` <span id=${ifDefined(this.errorId)} class="${this.validationMessage ? 'error' : ''}" ?hidden=${!this.validationMessage} aria-live="assertive">
            ${this.validationMessage}
        </span>`;
    }
    get labelHtml() {
        return this.hideLabel ? null : html`<label id=${ifDefined(this.labelId)} for=${ifDefined(this.fieldId)}> ${this.inputLabel} </label>`;
    }
    get requiredValidationMessage() {
        return `${this.label} alanı gereklidir.`;
    }

    constructor() {
        super();

        /** @property {string} Unique identifier for the input field */
        this.fieldId = '';
        /** @property {string} Name attribute for the input field */
        this.fieldName = '';
        /** @property {string} CSS class to apply to the input element */
        this.inputClass = '';
        /** @property {string} Label text for the input field */
        this.label = '';
        /** @property {boolean} Whether to hide the label visually */
        this.hideLabel = false;
        /** @property {string} Placeholder text for the input */
        this.placeholder = '';
        /** @property {boolean} Whether the input is required */
        this.required = false;
        /** @property {boolean} ARIA invalid state for accessibility */
        this.invalid = false;
        /** @property {boolean} Whether the input is disabled */
        this.disabled = false;

        this.#validateAbstracts();
    }

    handleValueUpdate() {
        this.dispatchCustomEvent('update');
    }

    clear() {
        this.value = null;
        this.dispatchCustomEvent('clear');
    }

    /**
     * Abstract handler for the nearest <form> submit. Must be overridden.
     * Typical flow: e.preventDefault(); validate; set validationMessage / invalid;
     * dispatch a custom event with current value. Make async if server-side validation is needed.
     * @abstract @protected
     * @param {SubmitEvent | Event} _event
     */
    onFormSubmit(_event) {
        throw new Error(`${this.constructor.name}: onFormSubmit(submitEvent) override edilmek zorunda.`);
    }

    /** @override */
    connectedCallback() {
        super.connectedCallback();
        this.#validateRequiredFields(['fieldId', 'label']);
        this.#firstUpdateCompleted();
    }

    async #firstUpdateCompleted() {
        await this.updateComplete;
        const form = this.closest('form');
        form?.addEventListener('submit', this.onFormSubmit.bind(this));
    }

    #validateAbstracts() {
        const baseProto = InputBase.prototype;

        for (const name of ['onFormSubmit']) {
            if (this[name] === baseProto[name]) {
                throw new Error(`${this.constructor.name}: ${name}() metodunu override etmelisiniz.`);
            }
        }
    }

    #validateRequiredFields(fieldNames) {
        for (const fieldName of fieldNames) {
            if (!this[fieldName]) {
                throw new Error(`${this.constructor.name}: '${fieldName}' alanı zorunludur.`);
            }
        }
    }
}
