import { isEmpty } from '../../modules/utilities';
import TextBox from './text-box';

export default class EmailBox extends TextBox {
    #pattern = null;

    validateLastChar(e) {
        return e.key !== ' '; // Boşluğa izin verme
    }

    validate(value, unmaskedValue) {
        const base = super.validate(value, unmaskedValue);

        if (base) return base;
        if (!this.#pattern.test(value)) return this.patternValidationMessage;
    }

    mask(value) {
        return isEmpty(value) ? value : value.toLowerCase();
    }

    #createRegexPattern() {
        const l = "[0-9A-Za-z!#$%&'*+/=?^_`{|}~-]"; // local part pattern
        const d = '[0-9A-Za-z-]'; // domain part pattern;
        const d2 = '[0-9A-Za-z]'; // domain part pattern2;
        const pattern = `^${l}+(${l}+\\.${l}+)*@${d2}(?:${d}{0,61}${d2})?(\\.${d2}(?:${d}{0,61}${d2})?)*$`;

        return new RegExp(pattern);
    }

    constructor() {
        super();

        this.#pattern = this.#createRegexPattern();

        this.inputmode = 'email';
        this.autocomplete = 'email';
        this.placeholder = '____@____.___';
        this.maxlength = 254;
        this.pattern = null;
    }
}
