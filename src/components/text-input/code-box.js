import { isEmpty } from '../../modules/utilities';
import TextBox from './text-box';

/**
 * A custom input component for entering codes consisting of a specific number of digits. Ideal for verification codes, PINs, or one-time passwords (OTP).
 * Only numeric input is accepted, and missing digits are automatically masked with the `_` character.
 *
 * `autounmask: true` - The component value is returned as a string without masking characters.
 *
 * `inputmode: numeric` - Ensures only numeric keys are shown on virtual keyboards.
 *
 * @extends TextBox
 * @property {number} digits - The required number of digits (default: 1)
 * @example <code-box digits="6"></code-box>
 */
export default class CodeBox extends TextBox {
    static get properties() {
        return {
            ...super.properties,
            digits: { type: Number }, // Girilmesi gereken rakam sayısı
        };
    }

    #matchRegex = null;
    #testRegex = null;

    get matchRegex() {
        return this.#matchRegex;
    }

    constructor() {
        super();

        /** @type {number} */
        this.digits = 1;
        this.autounmask = true;
        this.inputmode = 'numeric';
    }

    willUpdate(changed) {
        if (changed.has('digits')) {
            const newVal = Number(this.digits);
            this.digits = newVal > 0 ? newVal : 1;
            this.minlength = this.digits;
            this.#createRegexPatterns();
        }

        if (changed.has('minlength') && this.minlength !== this.digits) this.minlength = this.digits;
        if (changed.has('autounmask') && !this.autounmask) this.autounmask = true;
        if (changed.has('inputmode') && this.inputmode !== 'numeric') this.inputmode = 'numeric';

        super.willUpdate(changed);
    }

    firstUpdated() {
        super.firstUpdated();

        this.placeholder = isEmpty(this.placeholder) ? this.mask('') : this.placeholder;

        this.inputElement.addEventListener('focus', e => {
            if (this.value === '') this.inputElement.value = this.mask('');
        });

        this.inputElement.addEventListener('blur', e => {
            if (this.value === '') this.inputElement.value = this.value;
        });

        this.inputElement.addEventListener('click', this.#fixCaret.bind(this));
        this.inputElement.addEventListener('focus', this.#fixCaret.bind(this));
        this.inputElement.addEventListener('keydown', e => {
            if (!['ArrowLeft', 'ArrowRight', 'ArrowDown', 'Home', 'End'].includes(e.key)) return;
            this.#fixCaret(e);
        });
    }

    // #region masking
    mask(value) {
        value = String(value || '');
        return value.match(this.matchRegex)?.join('').padEnd(this.digits, '_').slice(0, this.digits) || '';
    }

    unmask(value) {
        if (isEmpty(value)) return value;
        return value.match(this.matchRegex)?.join('') || '';
    }

    validateLastChar(e) {
        const value = this.inputElement.value;
        const caret = this.inputElement.selectionStart;
        const caretEnd = this.inputElement.selectionEnd;
        const key = e.key;

        const newValue = (value.slice(0, caret) + key + value.slice(caretEnd)).replaceAll(/\D/g, '');

        return this.#testRegex.test(newValue); // Yeni karakter eklendiğinde değer paternle uyumlu mu?
    }

    replaceCaret(caret, _value) {
        const unmaskedLength = this.unmaskedValue.length;

        if (caret <= unmaskedLength) return caret;
        return unmaskedLength;
    }

    /**
     * Formats the input value and adjusts the caret position accordingly.
     * @param {Event} e
     */
    #fixCaret(e) {
        const element = /** @type {HTMLInputElement} */ (e.target);
        const lastDigit = this.unmaskedValue.slice(-1);
        const limit = lastDigit ? this.maskedValue.lastIndexOf(lastDigit) + 1 : 0;
        const direction = element.selectionDirection;
        const caretEnd = element.selectionEnd;
        const caretStart = element.selectionStart;
        const isKeyboardEvent = e instanceof KeyboardEvent;
        const endKeys = new Set(['ArrowDown', 'End']);

        if (isKeyboardEvent && (endKeys.has(this.lastKey) || ('ArrowRight' === this.lastKey && direction === 'forward' && limit <= caretEnd))) {
            e.preventDefault();

            if (endKeys.has(this.lastKey) || (!e.shiftKey && caretStart !== caretEnd)) {
                element.setSelectionRange(limit, limit);
                return;
            }
        }

        const newCaretStart = Math.min(caretStart, limit);
        const newCaretEnd = Math.min(caretEnd, limit);

        if (caretStart !== newCaretStart || caretEnd !== newCaretEnd) {
            element.setSelectionRange(newCaretStart, newCaretEnd, direction);
        }
    }

    // #endregion masking

    validate(_maskedValue) {
        return super.validate(this.unmaskedValue);
    }

    isComplete() {
        return /** @type {string} */ (this.value)?.length === this.digits;
    }

    #createRegexPatterns() {
        this.#matchRegex = new RegExp(String.raw`\d{0,${this.digits}}`, 'g');
        this.#testRegex = new RegExp(String.raw`^\d{1,${this.digits}}$`);
    }
}
