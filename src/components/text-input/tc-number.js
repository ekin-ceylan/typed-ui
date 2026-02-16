import { checkTcNo, isEmpty } from '../../modules/utilities';
import TextBox from './text-box';

/** @extends TextBox */
export default class TcNumber extends TextBox {
    constructor() {
        super();
        this.type = 'text';
        this.minlength = 11;
        this.inputmode = 'numeric';
        this.autounmask = true;
    }

    firstUpdated() {
        super.firstUpdated();
        this.inputElement.addEventListener('click', this.#fixCaret.bind(this));
        this.inputElement.addEventListener('focus', this.#fixCaret.bind(this));
        this.inputElement.addEventListener('keydown', e => {
            if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
            this.#fixCaret(e);
        });
    }

    // #region masking
    mask(value) {
        if (isEmpty(value)) return value;
        return (
            value
                .match(/\d{1,11}/g)
                ?.join('')
                .padEnd(11, '_')
                .slice(0, 11) || ''
        );
    }

    unmask(value) {
        if (isEmpty(value)) return value;
        return value.match(/\d{1,11}/g)?.join('') || '';
    }

    validateLastChar(e) {
        const value = this.inputElement.value;
        const caret = this.inputElement.selectionStart;
        const caretEnd = this.inputElement.selectionEnd;
        const key = e.key;

        const newValue = (value.slice(0, caret) + key + value.slice(caretEnd)).replaceAll(/\D/g, '');

        return /^\d{1,11}$/.test(newValue); // Yeni karakter eklendiğinde değer paternle uyumlu mu?
    }

    replaceCaret(caret, _value, maskedValue) {
        const unmaskedLength = this.unmask(maskedValue).length;

        if (caret <= unmaskedLength) return caret;
        return unmaskedLength;
    }

    /**
     * Formats the input value and adjusts the caret position accordingly.
     * @param {Event} e
     */
    #fixCaret(e) {
        const element = /** @type {HTMLInputElement} */ (e.target);
        const formatted = this.mask(element.value);
        const unmaskedLength = this.unmask(formatted).length;
        const direction = element.selectionDirection;
        const caretEnd = element.selectionEnd;
        const caretStart = element.selectionStart;

        if (e instanceof KeyboardEvent && ['ArrowRight', 'End'].includes(this.lastKey) && direction === 'forward' && unmaskedLength <= caretEnd) {
            e.preventDefault();

            if (!e.shiftKey && caretStart !== caretEnd) {
                element.setSelectionRange(unmaskedLength, unmaskedLength);
                return;
            }
        }

        const newCaretStart = Math.min(caretStart, unmaskedLength);
        const newCaretEnd = Math.min(caretEnd, unmaskedLength);

        if (caretStart !== newCaretStart || caretEnd !== newCaretEnd) {
            element.setSelectionRange(newCaretStart, newCaretEnd, direction);
        }
    }

    // #endregion masking

    validate(_value, unmaskedValue) {
        const validationMessage = super.validate(unmaskedValue, unmaskedValue);

        if (validationMessage) {
            return validationMessage;
        }

        if (unmaskedValue && !checkTcNo(unmaskedValue)) {
            return this.patternValidationMessage || 'Geçersiz TC Kimlik Numarası';
        }
    }

    isComplete() {
        return this.value.length === this.minlength;
    }
}
