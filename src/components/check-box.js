import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import SlotCollectorMixin from '../mixins/slot-collector-mixin.js';
import InputBase from '../core/input-base.js';

export default class CheckBox extends SlotCollectorMixin(InputBase) {
    static properties = {
        fieldId: { type: String, attribute: 'field-id' },
        fieldName: { type: String, attribute: 'field-name' },
        label: { type: String, reflect: false },
        placeholder: { type: String, reflect: true },
        required: { type: Boolean, reflect: true },
        ariaInvalid: { type: Boolean, attribute: 'aria-invalid', reflect: false },
    };

    get inputLabel() {
        return this.label || '';
    }

    get labelId() {
        return this.fieldId ? `${this.fieldId}-label` : null;
    }

    onInput(e) {
        this.value = e.target.checked;
        this.#checkValidity();
    }

    #checkValidity() {
        const el = this.inputElement;
        const v = el.validity;

        el.setCustomValidity('');
        this.ariaInvalid = !v?.valid;
        this.validationMessage = v?.valueMissing ? this.requiredValidationMessage : '';
        el.setCustomValidity(this.validationMessage);
    }

    firstUpdated() {
        this.inputElement = this.renderRoot.querySelector('input');
    }

    onFormSubmit(_event) {
        // throw new Error(`${this.constructor.name}: onFormSubmit(submitEvent) override edilmek zorunda.`);
    }

    /** @override @protected @returns {import('lit').TemplateResult} */
    render() {
        return html`
            <label id=${ifDefined(this.labelId)} for=${ifDefined(this.fieldId)}>
                <input
                    id=${ifDefined(this.fieldId)}
                    name=${ifDefined(this.fieldName || this.fieldId)}
                    type="checkbox"
                    .value=${this.value}
                    aria-label=${ifDefined(this.inputLabel)}
                    aria-errormessage=${ifDefined(this.errorId)}
                    aria-required=${this.required ? 'true' : 'false'}
                    ?aria-invalid=${this.ariaInvalid}
                    ?required=${this.required}
                    @input=${this.onInput}
                    @invalid=${this.#checkValidity}
                />
                <span><slot></slot></span>
                <span class="checkmark"></span>
            </label>
            <span class="error" id=${ifDefined(this.errorId)} aria-live="assertive">${this.validationMessage}</span>
        `;
    }

    constructor() {
        super();
        this.value = null;
        this.required = false;
    }
}

customElements.define('check-box', CheckBox);
