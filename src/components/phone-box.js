import { BaseInput } from './base-input';

export class PhoneBox extends BaseInput {
    onInput(e) {
        let value = e.target.value;
        const formatted = this.#formatPhoneNumber(value);
        e.target.value = formatted;
        super.onInput(e);
    }

    #formatPhoneNumber(value) {
        value = value.replace(/\D/g, ''); // Sayı olmayan karakterleri kaldır

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
        this.maxlength = 15;
    }
}

customElements.define('phone-box', PhoneBox);
