import { html, nothing } from 'lit';
import TextBase from '../../core/text-base';
import { isEmpty } from '../../modules/utilities';

/** @extends {TextBase} */
export default class PhoneBox extends TextBase {
    static get properties() {
        return {
            ...super.properties,
            // maxlength: { type: Number },
            // minlength: { type: Number },
            autounmask: { type: Boolean },
        };
    }

    #ghostMask1 = '';
    #ghostMask2 = '';

    willUpdate(changed) {
        super.willUpdate(changed);

        if (changed.has('value')) {
            const len = this.value.length;
            this.#ghostMask1 = this.maskedValue;
            this.#ghostMask2 = '0(___) ___ __ __'.slice(len);
        }
    }

    constructor() {
        super();

        this.type = 'tel';
        this.inputmode = 'tel';
        this.pattern = String.raw`0\(\d{3}\) \d{3} \d{2} \d{2}`;
        this.autocomplete = 'tel';
        this.placeholder = '0(242) 123 45 67';
    }

    mask(value) {
        if (isEmpty(value)) return value;
        value = value.replaceAll(/\D/g, ''); // Sayı olmayan karakterleri kaldır
        value = value.slice(0, 11); // İlk 11 karakteri al

        if (value.length > 0 && value[0] !== '0') {
            value = '0' + value;
        }

        if (value.length > 1) {
            const pattern = /(\d)?(\d{1,3})?(\d{1,3})?(\d{1,2})?(\d{1,2})?/;
            value = value.replace(pattern, (_, a, b, c, d, e) => {
                let area = b?.length > 0 ? `(${b}` : '';
                area += b?.length === 3 ? ')' : '';
                const num = [c, d, e].filter(Boolean).join(' ');

                return `${a}${area} ${num}`.trimEnd();
            });
        }

        return value;
    }

    validateLastChar(keyDownEvent) {
        const val = keyDownEvent.target.value;
        const key = keyDownEvent.key;
        const caret = keyDownEvent.target.selectionStart;
        const caretEnd = keyDownEvent.target.selectionEnd;

        const newValue = (val.slice(0, caret) + key + val.slice(caretEnd)).replaceAll(/\D/g, '');

        if (newValue.length > 11) return false; // Maksimum uzunluk 11 olmalı

        return /\d/.test(keyDownEvent.key);
    }

    /** @override @return {import('lit').TemplateResult | typeof nothing} */
    renderAdornment() {
        if (isEmpty(this.#ghostMask1) && isEmpty(this.#ghostMask2)) return nothing;

        // prettier-ignore
        return html` <div aria-hidden="true" data-role="underlay">
                <pre>${this.#ghostMask1}</pre><pre>${this.#ghostMask2}</pre>
            </div> `;
    }
}

// Case list
// paste test
/*
0 212 123 45 67
(0212) 123 45 67
+90 212 123 45 67
02121234567
0-212-123-45-67
*/
