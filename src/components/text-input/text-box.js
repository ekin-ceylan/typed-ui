import { html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import InputBase from '../../core/input-base.js';

export default class TextBox extends InputBase {
    #lastKey = null;

    regexPattern = null;
    globalRegexPattern = null;

    static properties = {
        type: { type: String, reflect: true },
        inputmode: { type: String, reflect: true },
        pattern: { type: String, reflect: true },
        maxlength: { type: Number, reflect: true },
        minlength: { type: Number, reflect: true },
        max: { type: Number, reflect: true },
        min: { type: Number, reflect: true },
        autounmask: { type: Boolean },
        autocomplete: { type: String, reflect: true },
    };

    static get observedAttributes() {
        const base = super.observedAttributes ?? [];
        return [...base, 'value']; // Lit’in kendi listesi + listem
    }

    // #region VALİDASYON MESAJLARI

    get minLengthValidationMessage() {
        return `${this.label} alanı en az ${this.minlength} karakterden oluşmalıdır.`;
    }

    get maxLengthValidationMessage() {
        return `${this.label} alanı en fazla ${this.maxlength} karakterden oluşmalıdır.`;
    }

    get maxValueValidationMessage() {
        return `${this.label} alanı ${this.max} değerinden fazla olamaz.`;
    }

    get minValueValidationMessage() {
        return `${this.label} alanı ${this.min} değerinden az olamaz.`;
    }

    get patternValidationMessage() {
        return `Lütfen geçerli bir ${this.label} giriniz.`;
    }
    // #endregion VALİDASYON MESAJLARI

    // #region OLAY YÖNETİCİLERİ
    onInput(e) {
        e.stopPropagation();
        this.#handleInput(e.target);
        this.#checkValidity(false);
        this.dispatchEvent(new CustomEvent('input', this.#eventInitDict(e)));
    }

    onChange(e) {
        e.stopPropagation();
        if (this.autounmask) this.value = this.unmaskedValue;
        this.dispatchEvent(new CustomEvent('change', this.#eventInitDict(e)));
    }

    onKeydown(e) {
        if (!this.pattern) return;
        this.#lastKey = e.key;
        const keyCode = e.keyCode;

        // değer bir karakter değilse
        if ([8, 9, 27, 13, 46].includes(keyCode) || (35 <= keyCode && keyCode < 40) || e.ctrlKey || e.altKey || e.metaKey) {
            return;
        }

        // Yeni karakter, değeri uyumsuz hale getiriyorsa engelle
        if (!this.validateLastChar(e)) {
            e.preventDefault();
        }
    }

    onBlur(_e) {
        this.#checkValidity(true);
    }

    onInvalid(_e) {
        // e.preventDefault(); // mesaj baloncuğu çıkmaz
        this.#checkValidity(true);
    }

    onFormSubmit(e) {
        if (!this.#checkValidity(true)) {
            e.preventDefault();
        }
    }
    // #endregion OLAY YÖNETİCİLERİ

    mask(value) {
        const masked = this.globalRegexPattern //
            ? value?.match(this.globalRegexPattern)?.join('') || '' //
            : value;

        return masked.toUpperCase();
    }

    unmask(maskedValue) {
        return maskedValue;
    }

    validate(value, _unmaskedValue) {
        if (this.required && !value) return this.requiredValidationMessage;
        if (value?.length > 0 && value.length < this.minlength) return this.minLengthValidationMessage;
        if (value.length > this.maxlength) return this.maxLengthValidationMessage;
        if (Number(value) > this.max) return this.maxValueValidationMessage;
        if (Number(value) < this.min) return this.minValueValidationMessage;
        if (this.regexPattern && !this.regexPattern.test(value)) return this.patternValidationMessage;

        return '';
    }

    validateLastChar(keyDownEvent) {
        return this.regexPattern ? this.regexPattern.test(keyDownEvent.key) : true;
    }

    #handleInput(el) {
        const formattedValue = this.#formatValueAndReplaceCaret(el); // Maskelenmiş değer
        this.unmaskedValue = this.unmask(formattedValue);
        this.value = this.autounmask ? this.unmaskedValue : formattedValue;
        el.value = formattedValue;
        el.unmaskedValue = this.unmaskedValue;
    }

    #formatValueAndReplaceCaret(el) {
        const value = el.value;

        if (!this.pattern || (value !== 0 && !value)) return value;

        const caret = el.selectionStart;
        const formatted = this.mask(value);

        setTimeout(() => {
            if (caret === value.length) return;
            const isDel = this.#lastKey === 'Delete';
            const caretPosition = isDel ? caret - value.length + formatted.length : this.mask(value.slice(0, caret)).length;
            el.setSelectionRange(caretPosition, caretPosition); // İmleci eski konumuna getir
        }, 0);

        return formatted;
    }

    #checkValidity(force = false) {
        const el = this.inputElement;
        const v = el.validity;

        // invalid ise her inputta tekrar kontrol et, valid ise blur olana kadar bekle
        if (!force && !this.ariaInvalid && !v?.valueMissing) {
            return true;
        }

        el.setCustomValidity('');
        this.validationMessage = this.validate(el.value, el.unmaskedValue);
        this.ariaInvalid = !!this.validationMessage;
        el.setCustomValidity(this.validationMessage || '');

        return !this.validationMessage;
    }

    #eventInitDict(originalEvent) {
        return {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: {
                originalEvent,
                inputType: originalEvent?.inputType || 'insertText',
                isComposing: !!originalEvent?.isComposing,
                synthetic: !(originalEvent && originalEvent instanceof Event),
            },
        };
    }

    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);

        if (name === 'value' && this.value != newValue) {
            this.value = newValue;

            this.updateComplete.then(() => {
                this.#handleInput(this.inputElement);
                this.dispatchEvent(new CustomEvent('update', this.#eventInitDict()));
            });
        }
    }

    render() {
        return html`
            ${this.label && !this.hideLabel ? html`<label id=${ifDefined(this.labelId)} for=${ifDefined(this.fieldId)}>${this.inputLabel}</label>` : ``}
            <input
                id=${ifDefined(this.fieldId)}
                name=${ifDefined(this.fieldName || this.fieldId)}
                type=${this.type || 'text'}
                .value=${this.value ?? ''}
                aria-labelledby=${ifDefined(this.labelId)}
                aria-errormessage=${ifDefined(this.errorId)}
                aria-required=${this.required ? 'true' : 'false'}
                ?aria-invalid=${this.ariaInvalid}
                .placeholder=${this.placeholder}
                autocomplete=${ifDefined(this.autocomplete)}
                ?required=${this.required}
                inputmode=${ifDefined(this.inputmode)}
                pattern=${this.pattern || nothing}
                maxlength=${ifDefined(this.maxlength)}
                minlength=${ifDefined(this.minlength)}
                @input=${this.onInput}
                @change=${this.onChange}
                @keydown=${this.onKeydown}
                @blur=${this.onBlur}
                @invalid=${this.onInvalid}
            />
            <span id=${ifDefined(this.errorId)} aria-live="assertive" ?hidden=${!this.validationMessage}>${this.validationMessage}</span>
        `;
    }

    firstUpdated() {
        this.inputElement = this.renderRoot.querySelector('input');

        if (this.pattern) {
            this.regexPattern = new RegExp(this.pattern);
            this.globalRegexPattern = new RegExp(this.pattern, 'g');
        }
    }

    constructor() {
        super();
        this.value = null;
        this.label = '';
        this.placeholder = '';
        this.required = false;
    }
}

customElements.define('text-box', TextBox);
