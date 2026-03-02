import TextBase from '../../core/text-base';
import { isEmpty } from '../../modules/utilities';

export default class EmailBox extends TextBase {
    static get properties() {
        return {
            ...super.properties,
            minlength: { type: Number },
        };
    }

    #pattern = null;

    constructor() {
        super();

        this.#pattern = this.#createRegexPattern();

        this.inputmode = 'email';
        this.autocomplete = 'email';
        this.maxlength = 254;
    }

    validateLastChar(e) {
        return e.key !== ' '; // Boşluğa izin verme
    }

    validate(value) {
        const base = super.validate(value);

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
}
