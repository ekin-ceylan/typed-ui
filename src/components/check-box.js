import { LitElement, html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

export class CheckBox extends LitElement {
    static properties = {
        fieldId: { type: String, attribute: 'field-id' },
        fieldName: { type: String, attribute: 'field-name' },
        value: { type: String, reflect: false },
        label: { type: String, reflect: false },
        placeholder: { type: String, reflect: true },
        required: { type: Boolean, reflect: true },
        ariaInvalid: { type: Boolean, attribute: 'aria-invalid', reflect: false },
        validationMessage: { type: String, attribute: false, reflect: false },
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

    onInput(e) {
        this.value = e.target.checked;
        this.validate();
    }

    validate() {
        const el = this.inputElement;
        const v = el.validity;

        el.setCustomValidity('');

        if (v?.valid) {
            this.ariaInvalid = false;
            this.validationMessage = '';
            return;
        }

        if (v?.valueMissing) {
            this.validationMessage = `${this.label} alanı gereklidir.`;
        }

        this.ariaInvalid = true;
        el.setCustomValidity(this.validationMessage);
    }

    #replaceSlot() {
        const slot = this.renderRoot.querySelector('.slot');
        const fragment = document.createDocumentFragment();

        for (let i = 0; i < this.childNodes.length; ) {
            const child = this.childNodes[i];

            if (child === this.labelElement || child === this.errorElement || child.nodeType === Node.COMMENT_NODE) {
                i++;
                continue;
            }

            if (child.nodeType === Node.TEXT_NODE) {
                const text = child.textContent?.trim();

                if (text !== '') {
                    const textNode = document.createTextNode(text);
                    fragment.appendChild(textNode);
                }
            } else {
                fragment.appendChild(child.cloneNode(true));
            }

            child.remove(); // Taşınan düğümleri kaldır
        }

        slot.innerHTML = ''; // Önceki içeriği temizle
        slot.appendChild(fragment); // Yeni içeriği ekle
    }

    firstUpdated() {
        this.inputElement = this.renderRoot.querySelector('input');
        this.labelElement = this.renderRoot.querySelector('label');
        this.errorElement = this.renderRoot.querySelector('span.error');

        this.#replaceSlot();
    }

    createRenderRoot() {
        return this; // Shadow DOM'u kapat
    }

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
                    @invalid=${() => this.validate(true)}
                />
                <span class="slot"></span>
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
