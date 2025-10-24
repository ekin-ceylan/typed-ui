import { LitElement } from 'lit';

export default class BaseElement extends LitElement {
    inputElement = null; // DOM input elementi

    static properties = {
        fieldId: { type: String, attribute: 'field-id' },
        fieldName: { type: String, attribute: 'field-name' },
        value: { type: String, attribute: false },
        label: { type: String },
        hideLabel: { type: Boolean, attribute: 'hide-label' },
        placeholder: { type: String, reflect: true },
        required: { type: Boolean, reflect: true },
        ariaInvalid: { type: Boolean, attribute: 'aria-invalid' },
        validationMessage: { state: true },
    };

    get inputLabel() {
        return this.label && this.label + (this.required ? '*' : '');
    }

    get labelId() {
        return this.fieldId ? `${this.fieldId}-label` : null;
    }

    get errorId() {
        return this.fieldId ? `${this.fieldId}-error` : null;
    }

    get requiredValidationMessage() {
        return `${this.label} alanı gereklidir.`;
    }

    createRenderRoot() {
        return this; // Shadow DOM'u kapat
    }

    async #firstUpdateCompleted() {
        await this.updateComplete;
        this.toggleAttribute('data-not-ready', false);
    }

    connectedCallback() {
        super.connectedCallback();
        this.#firstUpdateCompleted();
    }

    constructor() {
        super();
        this.toggleAttribute('data-not-ready', true);
    }
}
