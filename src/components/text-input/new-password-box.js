import { html, css } from 'lit';
import { injectStyles } from '../../modules/utilities.js';
import PasswordBox from './password-box.js';

export class NewPasswordBox extends PasswordBox {
    #styleId = 'new-password-box-styles';
    #strengthLabels = ['Şifre çok zayıf', 'Şifre çok zayıf', 'Şifre zayıf', 'Şifre orta', 'Şifre güçlü'];
    #strengthClasses = ['red', 'red', 'orange', 'gold', 'green'];

    static properties = {
        strength: { type: Number, state: true }, // şifre gücü (0-4)
    };

    static styles = css`
        new-password-box {
            --password-strength-height: 4px;
            --password-strength-bg: #e1e1e1;
            --password-strength-radius: 3px;

            position: relative;
            display: inline-block;
        }

        new-password-box .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0 0 0 0);
            white-space: nowrap;
            border: 0;
        }

        new-password-box > .strength {
            margin-top: 4px;
            background: var(--password-strength-bg);
            height: var(--password-strength-height);
            border-radius: var(--password-strength-radius);
            overflow: hidden;
            position: relative;
        }

        new-password-box > .strength > .fill {
            height: 100%;
            width: 0%;
            background: red;
            transition:
                width 0.25s ease,
                background-color 0.25s ease;
        }

        new-password-box > .strength > .fill.red {
            background-color: red;
            width: 25%;
        }

        new-password-box > .strength > .fill.orange {
            background-color: orange;
            width: 50%;
        }

        new-password-box > .strength > .fill.gold {
            background-color: gold;
            width: 75%;
        }

        new-password-box > .strength > .fill.green {
            background-color: green;
            width: 100%;
        }
    `;

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

        injectStyles(this.#styleId, this.constructor.styles.cssText);
    }

    #calcStrength(v) {
        return (v.length >= 8) + /[A-Z]/.test(v) + /\d/.test(v) + /[^A-Za-z0-9]/.test(v);
    }

    render() {
        const base = super.render ? super.render() : html``;

        return html`
            ${base}
            <div class="strength" role="progressbar" aria-valuemin="0" aria-valuemax="4" aria-valuenow=${this.strength} aria-label=${this.#strengthLabel}>
                <div class="fill ${this.#strengthClass}"></div>
            </div>
            <span class="sr-only" aria-live="polite">${this.#strengthLabel}</span>
        `;
    }
}

customElements.define('new-password-box', NewPasswordBox);
