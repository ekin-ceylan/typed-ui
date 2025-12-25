import { html } from 'lit';
import { ifDefined } from '../modules/utilities.js';
import LightComponentBase from './light-component-base';

export default class InputBase extends LightComponentBase {
    /**
     * Component reactive properties
     * @type {import('lit').PropertyDeclarations}
     */
    static properties = {
        fieldId: { type: String, attribute: 'field-id' },
        fieldName: { type: String, attribute: 'field-name' },
        inputClass: { type: String, attribute: 'input-class' },
        value: { type: String },
        label: { type: String },
        hideLabel: { type: Boolean, attribute: 'hide-label' },
        placeholder: { type: String, reflect: true },
        required: { type: Boolean, reflect: true },
        ariaInvalid: { type: String, attribute: 'aria-invalid' },
    };

    /** @type {string} */
    #value = null;

    /** @type {HTMLInputElement | HTMLSelectElement | null} */
    inputElement = null; // DOM input elementi
    /** @type {string | null } */
    validationMessage = '';

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
        return this.fieldId ? `${this.fieldId}-label` : null;
    }
    get errorId() {
        return this.fieldId ? `${this.fieldId}-error` : null;
    }
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
     * Typical flow: e.preventDefault(); validate; set validationMessage / ariaInvalid;
     * dispatch a custom event with current value. Make async if server-side validation is needed.
     * @abstract
     * @param {SubmitEvent | Event} _event
     */
    onFormSubmit(_event) {
        throw new Error(`${this.constructor.name}: onFormSubmit(submitEvent) override edilmek zorunda.`);
    }

    /** @override */
    connectedCallback() {
        super.connectedCallback();
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
}
