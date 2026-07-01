import { isEmpty } from '../../modules/utilities.js';
import PasswordBox from './password-box.js';

export default class ConfirmPasswordBox extends PasswordBox {
    static get properties() {
        return {
            ...super.properties,
            matchSelector: { type: String, attribute: 'match-selector' }, // CSS selector (confirm)
        };
    }

    #matchTarget = null;
    #validateMatchBound = null;

    /**
     * Returns the password mismatch validation message.
     * @returns {String}
     */
    get passwordMismatchMessage() {
        return this.localeMessages.passwordMismatch(this.label);
    }

    constructor() {
        super();

        this.#validateMatchBound = this.#validateMatch.bind(this);
        this.autocomplete = 'new-password';
        /** @type {String} */
        this.matchSelector = undefined;
    }

    /** @inheritdoc */
    updated(changedProperties) {
        super.updated(changedProperties);

        if (changedProperties.has('matchSelector')) {
            this.#matchTargetChanged();
        }
    }

    validate(value) {
        const base = super.validate(value);
        if (base) return base;

        if (this.#matchTarget && this.#matchTarget.value !== value) return this.passwordMismatchMessage;

        return '';
    }

    #matchTargetChanged() {
        this.#matchTarget?.inputElement?.removeEventListener('input', this.#validateMatchBound); // Remove listener from old target's inputElement
        this.#matchTarget = this.matchSelector ? this.ownerDocument.querySelector(this.matchSelector) : null; // Set new target
        this.#matchTarget?.inputElement?.addEventListener('input', this.#validateMatchBound); // Add listener to new target's inputElement
        if (this.interacted) this.checkValidity(); // Revalidate if already interacted
    }

    #validateMatch(_e) {
        if (this.interacted) this.checkValidity();
    }
}
