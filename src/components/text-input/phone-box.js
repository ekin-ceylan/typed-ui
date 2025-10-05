import { BaseInput } from './base-input';

export class PhoneBox extends BaseInput {
    mask(value) {
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

    validateLastChar(keyDownEvent) {
        const val = keyDownEvent.target.value;
        const key = keyDownEvent.key;
        const caret = keyDownEvent.target.selectionStart;
        const caretEnd = keyDownEvent.target.selectionEnd;

        const newValue = (val.slice(0, caret) + key + val.slice(caretEnd)).replace(/\D/g, '');

        if (newValue.length > 11) return false; // Maksimum uzunluk 11 olmalı

        return /\d/.test(keyDownEvent.key);
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
