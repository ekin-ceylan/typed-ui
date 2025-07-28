import { LitElement, html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

export class BaseInput extends LitElement {
    static get properties() {
        return {
            fieldId: { type: String, attribute: 'field-id' },
            fieldName: { type: String, attribute: 'field-name' },
            value: { type: String, reflect: false },
            label: { type: String, reflect: false },
            type: { type: String, reflect: true },
            placeholder: { type: String, reflect: true },
            inputmode: { type: String, reflect: true },
            pattern: { type: String, reflect: true },
            maxlength: { type: Number, reflect: true },
            minlength: { type: Number, reflect: true },
            required: { type: Boolean, reflect: true },
            ariaInvalid: { type: Boolean, attribute: 'aria-invalid', reflect: false },
            validationMessage: { type: String, reflect: false },
        };
    }

    get inputElement() {
        if (!this._inputElement) {
            this._inputElement = this.querySelector('input');
        }

        return this._inputElement;
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

    onInput(e) {
        this.value = e.target.value;
        this.validate();
    }

    validate(force = false) {
        const el = this.inputElement;
        const v = el.validity;

        // invalid ise her inputta tekrar kontrol et, valid ise blur olana kadar bekle
        if (!force && !this.ariaInvalid && !v?.valueMissing) {
            return;
        }

        el.setCustomValidity('');

        if (v?.valid) {
            this.ariaInvalid = false;
            this.validationMessage = '';
            return;
        }

        if (v?.valueMissing) {
            this.validationMessage = `${this.label} alanı gereklidir.`;
        } else if (v?.patternMismatch || v?.typeMismatch) {
            this.validationMessage = `Lütfen geçerli bir ${this.label} giriniz.`;
        } else if (v?.tooShort) {
            this.validationMessage = `${this.label} alanı en az ${el.minLength} karakterden oluşmalıdır.`;
        } else if (v?.tooLong) {
            this.validationMessage = `${this.label} alanı en fazla ${el.maxLength} karakterden oluşmalıdır.`;
        }

        this.ariaInvalid = true;
        el.setCustomValidity(this.validationMessage);
    }

    updated(changedProps) {
        if (changedProps.has('value') && this.inputElement.value !== this.value) {
            this.inputElement.value = this.value;
            this.dispatchEvent(new Event('update', { bubbles: true }));
            this.dispatchEvent(new Event('input', { bubbles: true }));
            this.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    render() {
        return html`
            <label id=${ifDefined(this.labelId)} for=${ifDefined(this.fieldId)}>${this.inputLabel}</label>
            <input
                id=${ifDefined(this.fieldId)}
                name=${ifDefined(this.fieldName || this.fieldId)}
                type=${this.type || 'text'}
                aria-labelledby="${ifDefined(this.labelId)}"
                aria-errormessage="${ifDefined(this.errorId)}"
                aria-required=${this.required ? 'true' : 'false'}
                ?aria-invalid=${this.ariaInvalid}
                .placeholder=${this.placeholder}
                ?required=${this.required}
                inputmode=${ifDefined(this.inputmode)}
                pattern=${ifDefined(this.pattern)}
                maxlength=${ifDefined(this.maxlength)}
                minlength=${ifDefined(this.minlength)}
                @input=${this.onInput}
                @blur=${() => this.validate(true)}
                @invalid=${() => this.validate(true)}
            />
            <span id=${ifDefined(this.errorId)} aria-live="assertive">${this.validationMessage}</span>
        `;
    }

    createRenderRoot() {
        return this; // Shadow DOM'u kapat
    }

    constructor() {
        super();
        this.value = null;
        this.label = '';
        this.required = false;
    }
}

customElements.define('base-input', BaseInput);
