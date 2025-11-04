import { html } from 'lit';
import PasswordBox from './password-box.js';

export default class NewPasswordBox extends PasswordBox {
    #strengthLabels = ['Şifre çok zayıf', 'Şifre çok zayıf', 'Şifre zayıf', 'Şifre orta', 'Şifre güçlü'];
    #strengthClasses = ['red', 'red', 'orange', 'gold', 'green'];

    static properties = {
        strength: { type: Number, state: true }, // şifre gücü (0-4)
    };

    get #strengthLabel() {
        return this.#strengthLabels[this.strength] || 'Şifre yok';
    }

    get #strengthClass() {
        return this.#strengthClasses[this.strength] || '';
    }

    onInput(e) {
        super.onInput(e);
        this.strength = this.#calcStrength(e.target.value || '');
    }

    validate(value) {
        const base = super.validate(value);
        if (base) return base;

        if (this.strength < 3) return `Lütfen güçlü bir şifre belirleyin.`;
    }

    constructor() {
        super();

        this.autocomplete = 'new-password';
    }

    #calcStrength(v) {
        return (v.length >= 8) + /[A-Z]/.test(v) + /\d/.test(v) + /[^A-Za-z0-9]/.test(v);
    }

    render() {
        const base = super.render ? super.render() : html``;

        return html`
            ${base}
            <div class="strength" role="progressbar" aria-valuemin="0" aria-valuemax="4" aria-valuenow=${this.strength} aria-valuetext=${this.#strengthLabel}>
                <div class="fill ${this.#strengthClass}"></div>
            </div>
            <span class="sr-only" aria-live="polite">${this.#strengthLabel}</span>
        `;
    }
}

customElements.define('new-password-box', NewPasswordBox);
