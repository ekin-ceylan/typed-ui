import { BaseInput } from './base-input';

export class PhoneBox extends BaseInput {
    #lastKey = null;

    onKeydown(e) {
        this.#lastKey = e.key;
    }

    onInput(e) {
        const el = e.target;
        const value = el.value;
        const caret = el.selectionStart;

        const formatted = this.#formatPhoneNumber(value);
        e.target.value = formatted;

        if (caret !== value.length) {
            const isDel = this.#lastKey === 'Delete';
            const caretPosition = isDel ? caret - value.length + formatted.length : this.#formatPhoneNumber(value.slice(0, caret)).length;
            el.setSelectionRange(caretPosition, caretPosition); // İmleci eski konumuna getir
        }

        super.onInput(e);
    }

    #formatPhoneNumber(value) {
        value = value.replace(/\D/g, ''); // Sayı olmayan karakterleri kaldır
        value = value.slice(0, 11); // İlk 11 karakteri al

        if (value.length > 0 && value[0] !== '0') {
            value = '0' + value;
        }

        if (value.length > 1) {
            const pattern = /(\d)?(\d{1,3})?(\d{1,3})?(\d{1,2})?(\d{1,2})?/;
            value = value.replace(pattern, (_, a, b, c, d, e) => [a, b, c, d, e].filter(Boolean).join(' '));
        }

        return value;
    }

    constructor() {
        super();

        this.type = 'tel';
        this.placeholder = '0 ___ ___ __ __';
        this.pattern = '0 \\d{3} \\d{3} \\d{2} \\d{2}';
        this.inputmode = 'tel';
    }
}

customElements.define('phone-box', PhoneBox);

// Case list
// paste test
/*
0 212 123 45 67
(0212) 123 45 67
+90 212 123 45 67
02121234567
0-212-123-45-67
*/
