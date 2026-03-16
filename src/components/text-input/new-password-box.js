import { html, nothing } from 'lit';
import PasswordBox from './password-box.js';

export default class NewPasswordBox extends PasswordBox {
    #strengthLabels = ['Şifre yok', 'Şifre çok zayıf', 'Şifre çok zayıf', 'Şifre zayıf', 'Şifre orta', 'Şifre güçlü'];

    static get properties() {
        return {
            ...super.properties,
            strength: { type: Number, state: true }, // şifre gücü (0-4)
        };
    }

    onInput(e) {
        super.onInput(e);
        this.strength = this.#calcStrength(e.target.value || '');
    }

    validate(value) {
        const base = super.validate(value);
        if (base) return base;

        if (this.strength < 4) return `Lütfen daha güçlü bir şifre belirleyin.`;
    }

    constructor() {
        super();

        /** @type {number} */
        this.strength = 0;
        this.autocomplete = 'new-password';
    }

    /** @returns {string} */
    getStrengthMessage(strength) {
        return this.#strengthLabels[strength];
    }

    /** @return {import('lit').TemplateResult | typeof nothing} */
    renderStrengthBar(strength, strengthMessage) {
        return html`<div role="progressbar" aria-label="Şifre gücü" aria-valuemin="0" aria-valuemax="5" aria-valuenow=${strength} aria-valuetext=${strengthMessage}>
            <div role="presentation" data-strength="${strength}"></div>
        </div>`;
    }

    /** @return {import('lit').TemplateResult | typeof nothing} */
    renderStrengthLabel(strengthMessage) {
        return html`<span data-visually-hidden role="status">${strengthMessage}</span>`;
    }

    #calcStrength(v) {
        return Number(!!v) + Number(v.length >= 8) + Number(/[A-Z]/.test(v)) + Number(/\d/.test(v)) + Number(/[^A-Za-z0-9]/.test(v));
    }

    render() {
        const strengthMessage = this.getStrengthMessage(this.strength);
        const base = super.render ? super.render() : nothing;

        return html`${base} ${this.renderStrengthBar(this.strength, strengthMessage)} ${this.renderStrengthLabel(strengthMessage)}`;
    }
}
