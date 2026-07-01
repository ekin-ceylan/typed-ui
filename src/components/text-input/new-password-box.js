import { html, nothing } from 'lit';
import PasswordBox from './password-box.js';

/**
 * New password input component. Extends the PasswordBox component to provide additional functionality for new password inputs, such as password strength validation and display.
 * - Can be used after defining like `defineElement('new-password-box', NewPasswordBox)` or `customElement.define('new-password-box', NewPasswordBox)`.
 * - The `required`, `pattern`, `maxlength`, `minlength`, `min`, `max` attributes can be used for validation.
 * - The `allow-pattern` attribute determines which characters are allowed to be entered. For example, if `allow-pattern="\d"` then only numeric input is allowed.
 * @example <new-password-box name="new-password" required allow-pattern="\S" minlength="8"></new-password-box>
 * @extends {PasswordBox}
 */
export default class NewPasswordBox extends PasswordBox {
    static get properties() {
        return {
            ...super.properties,
            strength: { type: Number, state: true, noAccessor: true, attribute: false }, // şifre gücü (0-4)
            minStrength: { type: Number, attribute: 'min-strength' }, // minimum şifre gücü (0-4)
        };
    }

    /**
     * Calculates the strength of the given password value.
     * @returns {number}
     */
    get strength() {
        return this.calculatePasswordStrength(this.value || '');
    }

    get passwordStrengthValidationMessage() {
        return this.localeMessages.passwordStrengthValidationMessage(this.label);
    }

    /** @returns {string} */
    get strengthMessage() {
        return this.localeMessages.passwordStrengthLabel(this.strength);
    }

    constructor() {
        super();
        this.autocomplete = 'new-password';
        this.minStrength = 4; // varsayılan minimum şifre gücü
    }

    validate(value) {
        const base = super.validate(value);
        if (base) return base;

        if (this.strength < this.minStrength) return this.passwordStrengthValidationMessage;
    }

    /**
     * Calculates the strength of the given password value and returns a number between 0 and 4, where 0 is no password and 4 is strong password.
     * It can be overridden in subclasses to provide custom password strength calculation logic.
     * @param {string} value The password value to evaluate.
     * @protected
     * @returns {number}
     */
    calculatePasswordStrength(value) {
        const v = value;

        if (!v) return 0;
        if (v.length < 8) return 1; // minimum uzunluk kontrolü
        // Güç kriterleri: büyük harf, rakam, özel karakter
        return Number(/[A-Z]/.test(v)) + Number(/\d/.test(v)) + Number(/[^A-Za-z0-9]/.test(v)) + 1; // 1-4 arası değer döndürür
    }

    /** @return {import('lit').TemplateResult | typeof nothing} */
    renderStrengthBar(strength, strengthMessage) {
        return html`<div
            role="progressbar"
            aria-label=${this.localeMessages.passwordStrengthAriaLabel}
            aria-valuemin="0"
            aria-valuemax="5"
            aria-valuenow=${strength}
            aria-valuetext=${strengthMessage}
        >
            <div role="presentation" data-strength=${strength}></div>
        </div>`;
    }

    /** @return {import('lit').TemplateResult | typeof nothing} */
    renderStrengthLabel(strengthMessage) {
        return html`<span data-visually-hidden role="status">${strengthMessage}</span>`;
    }

    /** @override */
    render() {
        const message = this.strengthMessage;
        const base = super.render ? super.render() : nothing;

        return html`${base} ${this.renderStrengthBar(this.strength, message)} ${this.renderStrengthLabel(message)}`;
    }
}
