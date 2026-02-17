import { html } from 'lit';
import { ifDefined } from '../modules/utilities.js';
import SlotCollectorMixin from '../mixins/slot-collector-mixin.js';
import InputBase from '../core/input-base.js';

export default class CheckBox extends SlotCollectorMixin(InputBase) {
    static get properties() {
        return {
            ...super.properties,
            fieldId: { type: String, attribute: 'field-id' },
            fieldName: { type: String, attribute: 'field-name' },
            label: { type: String },
            required: { type: Boolean, reflect: true },
            checked: { type: Boolean },
            checkedValue: { type: String, attribute: 'checked-value' },
            uncheckedValue: { type: String, attribute: 'unchecked-value' },
            indeterminate: { type: Boolean, reflect: true },
        };
    }

    get inputLabel() {
        return this.label || '';
    }

    get labelId() {
        return this.fieldId ? `${this.fieldId}-label` : null;
    }

    get descriptionId() {
        return this.fieldId ? `${this.fieldId}-description` : null;
    }

    /**
     *
     * @param {InputEvent} e
     */
    onInput(e) {
        const input = /** @type {HTMLInputElement} */ (e.target);
        this.value = input.checked ? this.checkedValue : this.uncheckedValue;
        this.#checkValidity();
    }

    /**
     * @param {MouseEvent} e
     */
    onClick(e) {
        if (this.readonly) {
            e.preventDefault();
            e.stopImmediatePropagation();
        }
    }

    #checkValidity() {
        const el = this.inputElement;
        const v = el.validity;

        el.setCustomValidity('');
        this.invalid = !v?.valid;
        this.validationMessage = v?.valueMissing ? this.requiredValidationMessage : '';
        el.setCustomValidity(this.validationMessage);
    }

    #syncIndeterminate() {
        if (this.inputElement) {
            this.inputElement.indeterminate = !!this.indeterminate;
        }
    }

    firstUpdated() {
        this.inputElement = this.renderRoot.querySelector('input');
        this.#syncIndeterminate();
    }

    updated(changed) {
        if (changed.has('indeterminate')) {
            this.#syncIndeterminate();
        }
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
                    name=${ifDefined(this.fieldName)}
                    type="checkbox"
                    value=${ifDefined(this.checkedValue)}
                    ?checked=${ifDefined(this.checked)}
                    aria-describedby=${ifDefined(this.descriptionId)}
                    aria-errormessage=${ifDefined(this.errorId)}
                    aria-required=${this.required ? 'true' : 'false'}
                    aria-invalid=${ifDefined(this.ariaInvalid)}
                    ?aria-readonly=${this.readonly}
                    ?required=${this.required}
                    ?disabled=${this.disabled}
                    @input=${this.onInput}
                    @click=${this.onClick}
                    @invalid=${this.#checkValidity}
                />
                <span id=${ifDefined(this.descriptionId)}><slot></slot></span>
            </label>
            <span data-role="error-message" id=${ifDefined(this.errorId)} aria-live="assertive">${this.validationMessage}</span>
        `;
    }

    constructor() {
        super();
        this.value = null;
        this.required = false;

        /** @type {boolean} */
        this.checked = undefined;

        /** @type {boolean} */
        this.indeterminate = false;

        /** @type {string|boolean|number} */
        this.checkedValue = 'on';

        /** @type {string|boolean|number} */
        this.uncheckedValue = null;
    }
}
