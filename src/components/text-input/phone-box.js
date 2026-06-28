import TextBase from '../../base/text-base';
import { isEmpty } from '../../modules/utilities';
import { mixins } from '../../modules/mixin-utils';
import GhostPlaceholderMixin from '../../mixins/ghost-placeholder-mixin';
import TextControlBase from '../../base/text-control-base';

/** @extends {TextBase} */
export default class PhoneBox extends mixins(TextControlBase, GhostPlaceholderMixin) {
    static get properties() {
        return {
            ...super.properties,
            // maxlength: { type: Number },
            // minlength: { type: Number },
            autounmask: { type: Boolean },
        };
    }

    constructor() {
        super();

        this.type = 'tel';
        this.inputmode = 'tel';
        this.pattern = String.raw`0\(\d{3}\) \d{3} \d{2} \d{2}`;
        this.autocomplete = 'tel';
        this.placeholder = '0(___) ___ __ __';
    }

    mask(value) {
        if (isEmpty(value)) return value;
        value = value.replaceAll(/\D/g, ''); // Sayı olmayan karakterleri kaldır

        if (value.length >= 12) {
            value = value.replace(/^0{0,2}9/, ''); // Ülke kodunu kaldır
        }

        value = value.match(/^0?\d{1,10}/)?.[0] || ''; // Geçerli kısmı al

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
