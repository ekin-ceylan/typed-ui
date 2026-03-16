import PasswordBox from './password-box.js';

export default class ConfirmPasswordBox extends PasswordBox {
    #matchTarget = null;

    static get properties() {
        return {
            ...super.properties,
            matchSelector: { type: String, attribute: 'match-selector' }, // CSS selector (confirm)
        };
    }

    validate(value) {
        const base = super.validate(value);
        if (base) return base;

        if (this.#matchTarget?.value !== value) return 'Şifreler eşleşmiyor.';
    }

    firstUpdated() {
        super.firstUpdated();
        this.#matchTarget = /** @type {HTMLInputElement } */ (this.getRootNode()).querySelector(this.matchSelector);
    }

    constructor() {
        super();

        this.autocomplete = 'new-password';

        /** @type {String} */
        this.matchSelector = undefined;
    }
}
