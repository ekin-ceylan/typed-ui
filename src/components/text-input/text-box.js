import { html, nothing } from 'lit';
import { ifDefined, isEmpty } from '../../modules/utilities.js';
import InputBase from '../../core/input-base.js';

/**
 * @extends {InputBase<HTMLInputElement>}
 */
export default class TextBox extends InputBase {
    static get properties() {
        return {
            ...super.properties,
            type: { type: String, reflect: true },
            inputmode: { type: String, reflect: true },
            allowPattern: { type: String, attribute: 'allow-pattern' },
            pattern: { type: String, reflect: true },
            maxlength: { type: Number, reflect: true },
            minlength: { type: Number, reflect: true },
            max: { type: Number, reflect: true },
            min: { type: Number, reflect: true },
            autounmask: { type: Boolean },
            autocomplete: { type: String, reflect: true },
            spellcheck: { type: Boolean, reflect: true },
        };
    }

    /** @type {RegExp|null} The compiled regex pattern for single character validation */
    regexPattern = null;

    /** @type {RegExp|null} The compiled regex pattern with global flag for masking operations */
    globalRegexPattern = null;

    /** @type {RegExp|null} The compiled allow-pattern regex for single character filtering */
    allowRegexPattern = null;

    /** @type {RegExp|null} The compiled allow-pattern regex with global flag for filtering operations */
    globalAllowRegexPattern = null;

    /** @type {String|null} The last key pressed during keydown event */
    #lastKey = null;

    /** @type {string | null } */
    #maskedValue = null;

    /** @returns {String} The name attribute for the input element */
    get name() {
        return this.fieldName || this.fieldId;
    }

    /** @returns {String|null} The last key pressed during keydown event */
    get lastKey() {
        return this.#lastKey;
    }

    /** @type {string | null } */
    get unmaskedValue() {
        return this.unmask(this.#maskedValue);
    }

    get value() {
        return this.autounmask ? this.unmaskedValue : this.#maskedValue;
    }
    set value(val) {
        this.#maskedValue = this.mask(val);
    }

    // #region VALIDATION MESSAGES

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

    // #endregion VALIDATION MESSAGES

    // #region LIFECYCLE

    constructor() {
        super();
        this.value = null;
        this.label = '';
        this.placeholder = '';
        this.required = false;

        /** @type {String} The type attribute for the input element (e.g., 'text', 'email', 'tel') */
        this.type = 'text';

        /** @type {String} The inputmode attribute for the input element (e.g., 'numeric', 'decimal', 'tel') */
        this.inputmode = undefined;

        /** @type {String} Regex source to allow/filter characters during masking */
        this.allowPattern = undefined; //'[a-zA-ZçÇğĞıİöÖşŞüÜâÂîÎ ]';

        /** @type {String} The regex pattern for input validation */
        this.pattern = undefined;

        /** @type {Number} The maximum length of the input value */
        this.maxlength = undefined;

        /** @type {Number} The minimum length of the input value */
        this.minlength = undefined;

        /** @type {Number} The maximum numeric value allowed */
        this.max = undefined;

        /** @type {Number} The minimum numeric value allowed */
        this.min = undefined;

        /** @type {Boolean} Whether to unmask the value on change event */
        this.autounmask = false;

        /** @type {String} The autocomplete attribute for the input element */
        this.autocomplete = undefined;

        /** @type {Boolean} Whether spellcheck is enabled for the input element */
        this.spellcheck = false;
    }

    firstUpdated() {
        this.inputElement = this.renderRoot.querySelector('input');
        this.inputElement?.form?.addEventListener('formdata', this.handleFormData.bind(this));
        this.#createRegexPatterns();
        // this.#handleInitValue();
    }

    /** @override */
    updated(changedProperties) {
        super.updated?.(changedProperties);

        // Recompile patterns when they change at runtime (attribute or property update).
        if (changedProperties.has('allowPattern') || changedProperties.has('pattern')) {
            this.#createRegexPatterns();
        }
    }

    // #endregion LIFECYCLE

    // #region PUBLIC API

    handleFormData(event) {
        const inputName = this.inputElement?.name;

        if (!inputName || !this.autounmask) return;
        if (event.formData.get(inputName) === undefined) return;

        event.formData.set(inputName, this.unmaskedValue);
    }

    /** @override */
    handleValueUpdate() {
        if (this.#maskedValue === this.inputElement?.value) return;
        this.inputElement.value = this.#maskedValue;
        this.dispatchEvent(new CustomEvent('update', this.#eventInitDict()));
    }

    /**
     * Checks if the input value is complete based on the defined constraints.
     * @returns {boolean} True if the input value is complete, otherwise false.
     */
    isComplete() {
        return false;
    }

    /**
     * Masks the input value by applying the global regex pattern.
     * @param {String} value - The value to be masked
     * @returns {String} The masked value
     */
    mask(value) {
        if (isEmpty(value)) return value;

        const re = this.globalAllowRegexPattern;
        const filtered = re ? (value.match(re) ?? []).join('') : value;

        return filtered;
    }

    /**
     * Unmasks the input value by reversing the masking process.
     * @param {String} maskedValue - The masked value to be unmasked
     * @returns {String} The unmasked value
     */
    unmask(maskedValue) {
        return maskedValue;
    }

    /**
     * Validates the input value against defined constraints (required, length, numeric range, pattern).
     * @param {String} value - The value to validate
     * @param {String} unmaskedValue - The unmasked value (currently unused)
     * @returns {String} Empty string if valid, otherwise returns the appropriate validation error message
     */
    validate(value, unmaskedValue) {
        if (this.required && !value) return this.requiredValidationMessage;
        if (value?.length > 0 && value?.length < this.minlength) return this.minLengthValidationMessage;
        if (value?.length > this.maxlength) return this.maxLengthValidationMessage;
        if (Number(value) > this.max) return this.maxValueValidationMessage;
        if (Number(value) < this.min) return this.minValueValidationMessage;
        if (!isEmpty(value) && this.regexPattern && !this.regexPattern.test(value)) return this.patternValidationMessage;

        return '';
    }

    /**
     * @protected Validates the last character entered.
     * @param   {KeyboardEvent & { target: HTMLInputElement }} keyDownEvent
     * @returns {Boolean} Whether the last character is valid or not.
     */
    validateLastChar(keyDownEvent) {
        return this.allowRegexPattern ? this.allowRegexPattern.test(keyDownEvent.key) : true;
    }

    /**
     * Calculates the new caret position after formatting the input value.
     * @param {number} caretPostition - The current position of the caret in the input value
     * @param {string} snapshotValue - The snapshot value of the input at the time of input event
     * @param {string} maskedValue - The masked value of the input
     * @returns {number} The new caret position after formatting
     */
    replaceCaret(caretPostition, snapshotValue, maskedValue) {
        const maskedLength = maskedValue.length;
        const valueLength = snapshotValue.length;

        if (caretPostition === valueLength) return maskedLength; // imleç sona
        if (this.lastKey == 'Delete') return caretPostition - valueLength + maskedLength;
        return this.mask(snapshotValue.slice(0, caretPostition)).length; // imleci eski konumuna
    }

    // #endregion PUBLIC API

    // #region EVENT LISTENERS
    /**
     * @protected Handles the input event for the text box.
     * @param {InputEvent & { target: HTMLInputElement }} e
     * @returns {void}
     */
    onInput(e) {
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
        if (e.isComposing) return;

        this.#lastKey = e.key;
        const keyCode = e.code;
        const allowedKeys = ['Backspace', 'Tab', 'Escape', 'Enter', 'Delete', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'Process'];

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
     * @param {Event & { target: HTMLInputElement }} event
     */
    onInvalid(event) {
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
    // #endregion EVENT LISTENERS

    /**
     * Handles input processing by formatting the value, updating unmasked value, and setting the final value.
     * @param {HTMLInputElement} element - The input element to process
     * @returns {void}
     */
    #handleInput(element) {
        const value = element.value;

        if (isEmpty(value)) {
            this.#maskedValue = value;
            this.inputElement.value = value;
            return;
        }

        const caret = element.selectionStart;
        this.#maskedValue = this.mask(value);
        const newCaretPosition = this.replaceCaret(caret, value, this.#maskedValue);

        element.value = this.#maskedValue;
        element.setSelectionRange(newCaretPosition, newCaretPosition);
    }

    #checkValidity(force = false) {
        const el = this.inputElement;
        const v = el.validity;

        // invalid ise her inputta tekrar kontrol et, valid ise blur olana kadar bekle
        if (!force && !this.invalid && !v?.valueMissing && !this.isComplete()) {
            return true;
        }

        el.setCustomValidity('');
        this.validationMessage = this.validate(el.value, this.unmaskedValue);
        this.invalid = !!this.validationMessage;
        el.setCustomValidity(this.validationMessage || '');
        this.requestUpdate('validationMessage');

        return !this.validationMessage;
    }

    /**
     * Creates an event initialization dictionary for custom events.
     * @param {InputEvent | Event & { target: HTMLInputElement }} [originalEvent] - The original browser event that triggered this custom event
     * @returns {Object} An event initialization object with bubbles, cancelable, composed, and detail properties
     */
    #eventInitDict(originalEvent) {
        const isInputEvent = originalEvent instanceof InputEvent;

        return {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: {
                originalEvent,
                inputType: isInputEvent ? originalEvent.inputType : 'insertText',
                isComposing: !!(isInputEvent && originalEvent?.isComposing),
                synthetic: !(originalEvent && originalEvent instanceof Event),
            },
        };
    }

    // async #handleInitValue() {
    //     return;
    //     await this.updateComplete;

    //     if (this.inputElement && this.value != null) {
    //         this.inputElement.value = this.value;
    //         this.inputElement.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    //     }
    // }

    #createRegexPatterns() {
        this.allowRegexPattern = this.allowPattern ? new RegExp(this.allowPattern) : null;
        this.globalAllowRegexPattern = this.allowPattern ? new RegExp(this.allowPattern, 'g') : null;

        this.regexPattern = this.pattern ? new RegExp(this.pattern) : null;
        this.globalRegexPattern = this.pattern ? new RegExp(this.pattern, 'g') : null;
    }

    /** @override @protected @returns {import('lit').TemplateResult} */
    render() {
        return html`
            ${this.label && !this.hideLabel ? html`<label id=${ifDefined(this.labelId)} for=${ifDefined(this.fieldId)}>${this.inputLabel}</label>` : ``}
            <input
                id=${ifDefined(this.fieldId)}
                name=${ifDefined(this.name)}
                class=${ifDefined(this.inputClass)}
                type=${this.type || 'text'}
                ?disabled=${this.disabled}
                aria-labelledby=${ifDefined(this.labelId)}
                aria-label=${ifDefined(this.hideLabel ? this.label : undefined)}
                aria-errormessage=${ifDefined(this.errorId)}
                aria-required=${this.required ? 'true' : 'false'}
                aria-invalid=${ifDefined(this.ariaInvalid)}
                .placeholder=${this.placeholder}
                autocomplete=${ifDefined(this.autocomplete)}
                ?required=${this.required}
                .spellcheck=${this.spellcheck}
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
            ${this.validationMessageHtml}
        `;
    }
}
