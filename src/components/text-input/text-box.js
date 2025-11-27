import { html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import InputBase from '../../core/input-base.js';

export default class TextBox extends InputBase {
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

    regexPattern = null;
    globalRegexPattern = null;
    #lastKey = null;

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

    // #region LIFECYCLE

    constructor() {
        super();
        this.value = null;
        this.label = '';
        this.placeholder = '';
        this.required = false;

        this.autounmask = false;
    }

    firstUpdated() {
        this.inputElement = this.renderRoot.querySelector('input');

        if (this.pattern) {
            this.regexPattern = new RegExp(this.pattern);
            this.globalRegexPattern = new RegExp(this.pattern, 'g');
        }
    }

    handleValueUpdate() {
        this.#handleInput(this.inputElement);
        this.dispatchEvent(new CustomEvent('update', this.#eventInitDict()));
    }

    // #endregion LIFECYCLE

    // #region PUBLIC API
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

    /**
     * @protected Validates the last character entered.
     * @param   {KeyboardEvent & { target: HTMLInputElement }} keyDownEvent
     * @returns {Boolean} Whether the last character is valid or not.
     */
    validateLastChar(keyDownEvent) {
        return this.regexPattern ? this.regexPattern.test(keyDownEvent.key) : true;
    }

    // #endregion PUBLIC API

    // #region OLAY YÖNETİCİLERİ
    /**
     * @protected Handles the input event for the text box.
     * @param {InputEvent & { target: HTMLInputElement }} e
     * @returns {void}
     */
    onInput(e) {
        console.log('TextBox onInput');
        e.stopPropagation();
        this.#handleInput(e.target);
        this.#checkValidity(false);
        this.dispatchEvent(new CustomEvent('input', this.#eventInitDict(e)));
    }

    /**
     * @protected Handles the change event for the text box.
     * @param {Event & { target: HTMLInputElement }} e
     * @returns {void}
     */
    onChange(e) {
        e.stopPropagation();
        if (this.autounmask) this.value = this.unmaskedValue;
        this.dispatchEvent(new CustomEvent('change', this.#eventInitDict(e)));
    }

    /**
     * @protected Handles the keydown event for the text box.
     * @param {KeyboardEvent & { target: HTMLInputElement }} e
     * @returns {void}
     */
    onKeydown(e) {
        if (!this.pattern) return;
        this.#lastKey = e.key;
        const keyCode = e.code;
        const allowedKeys = ['Backspace', 'Tab', 'Escape', 'Enter', 'Delete', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];

        // değer bir karakter değilse
        if (allowedKeys.includes(keyCode) || e.ctrlKey || e.altKey || e.metaKey) {
            return;
        }

        // Yeni karakter, değeri uyumsuz hale getiriyorsa engelle
        if (!this.validateLastChar(e)) {
            e.preventDefault();
        }
    }

    /**
     * @protected Handles the blur event for the text box.
     * @param {Event} _e
     */
    onBlur(_e) {
        this.#checkValidity(true);
    }

    /**
     * @protected Handles the invalid event for the text box.
     * @param {InvalidEvent} _e
     */
    onInvalid(_e) {
        // e.preventDefault(); // mesaj baloncuğu çıkmaz
        this.#checkValidity(true);
    }

    /**
     * @protected Handles the form submit event for the text box.
     * @param {SubmitEvent} e
     */
    onFormSubmit(e) {
        if (!this.#checkValidity(true)) {
            e.preventDefault();
        }
    }
    // #endregion OLAY YÖNETİCİLERİ

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
            const isDel = this.#lastKey == 'Delete';
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

    /** @override @protected @returns {import('lit').TemplateResult} */
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
}

customElements.define('text-box', TextBox);
