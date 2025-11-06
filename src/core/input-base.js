import { LitElement, html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

export default class InputBase extends LitElement {
    /**
     * Component reactive properties
     * @type {import('lit').PropertyDeclarations}
     */
    static properties = {
        fieldId: { type: String, attribute: 'field-id' },
        fieldName: { type: String, attribute: 'field-name' },
        value: { type: String, attribute: false },
        label: { type: String },
        hideLabel: { type: Boolean, attribute: 'hide-label' },
        placeholder: { type: String, reflect: true },
        required: { type: Boolean, reflect: true },
        ariaInvalid: { type: String, attribute: 'aria-invalid' },
    };

    /** @type {HTMLInputElement | HTMLSelectElement | null} */
    inputElement = null; // DOM input elementi
    /** @type {string | null } */
    validationMessage = '';

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
    get requiredValidationMessage() {
        return `${this.label} alanı gereklidir.`;
    }

    constructor() {
        super();
        this.toggleAttribute('data-not-ready', true);
        this.#validateAbstracts();
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
        this.toggleAttribute('data-not-ready', false);
    }

    #validateAbstracts() {
        const baseProto = InputBase.prototype;

        for (const name of ['onFormSubmit']) {
            if (this[name] === baseProto[name]) {
                throw new Error(`${this.constructor.name}: ${name}() metodunu override etmelisiniz.`);
            }
        }
    }

    /** @override @protected Render in light DOM to keep page styles. */
    createRenderRoot() {
        return this; // Shadow DOM'u kapat
    }
}
