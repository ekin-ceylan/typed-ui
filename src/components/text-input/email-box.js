import TextControlBase from '../../base/text-control-base.js';
import { isEmpty } from '../../modules/utilities.js';

/**
 * Input component that provides email format validation.
 *
 * The `minlength` attribute allows setting a minimum length for the email address.
 * @example
 * <email-box name="Email" minlength="5"></email-box>
 * @extends TextControlBase
 */
export default class EmailBox extends TextControlBase {
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

    /** @inheritDoc */
    validateLastChar(e) {
        return e.key !== ' '; // Boşluğa izin verme
    }

    /** @inheritDoc */
    validate(value) {
        const base = super.validate(value);

        if (base) return base;
        if (!this.#pattern.test(value)) return this.patternValidationMessage;
    }

    /** @inheritDoc */
    mask(value) {
        return isEmpty(value) ? value : value.toLowerCase();
    }

    #createRegexPattern() {
        const l = "[0-9A-Za-z!#$%&'*+/=?^_`{|}~-]"; // local part pattern
        const d = '[0-9A-Za-z-]'; // domain part pattern;
        const d2 = '[0-9A-Za-z]'; // domain part pattern2;
        const pattern = String.raw`^${l}+(${l}+\.${l}+)*@${d2}(?:${d}{0,61}${d2})?(?:\.${d2}(?:${d}{0,61}${d2})?)*$`;

        return new RegExp(pattern);
    }
}
