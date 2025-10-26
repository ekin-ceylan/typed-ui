import { LitElement } from 'lit';

export default class InputBase extends LitElement {
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

    /**
     * Abstract handler for the nearest <form> submit. Must be overridden.
     * Typical flow: e.preventDefault(); validate; set validationMessage / ariaInvalid;
     * dispatch a custom event with current value.
     * Make async if server-side validation is needed.
     * @abstract
     * @param {SubmitEvent|Event} SubmitEvent
     */
    onFormSubmit(_event) {
        throw new Error(`${this.constructor.name}: onFormSubmit(submitEvent) override edilmek zorunda.`);
    }

    createRenderRoot() {
        return this; // Shadow DOM'u kapat
    }

    connectedCallback() {
        super.connectedCallback();
        this.#firstUpdateCompleted();
    }

    constructor() {
        super();
        this.toggleAttribute('data-not-ready', true);
        this.#validateAbstracts();
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
}
