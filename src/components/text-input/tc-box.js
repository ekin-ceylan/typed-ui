import { html, nothing } from 'lit';
import { checkTcNo, isEmpty } from '../../modules/utilities';
import TextBase from '../../core/text-base';

/** @extends TextBase */
export default class TcBox extends TextBase {
    static get properties() {
        return {
            ...super.properties,
            autocomplete: { type: String },
        };
    }

    #ghostMask1 = '';
    #ghostMask2 = '';
    #digits = 11;

    constructor() {
        super();

        this.inputmode = 'numeric';
        this.minlength = this.#digits;
        this.maxlength = this.#digits;
        this.allowPattern = `[0-9]{1,${this.#digits}}`;
        this.pattern = String.raw`\d{${this.#digits}}`;
    }

    willUpdate(changed) {
        super.willUpdate(changed);

        if (changed.has('value')) {
            const len = this.#digits - this.value.length;
            this.#ghostMask1 = this.value;
            this.#ghostMask2 = '_'.repeat(Math.max(0, len));
        }
    }

    isComplete() {
        return this.value.length === this.#digits;
    }

    validate(value) {
        const validationMessage = super.validate(value);

        if (validationMessage) {
            return validationMessage;
        }

        if (value && !checkTcNo(value)) {
            return this.patternValidationMessage || 'Geçersiz TC Kimlik Numarası';
        }
    }

    /** @override @return {import('lit').TemplateResult} */
    renderAdornment() {
        if (isEmpty(this.#ghostMask1) && isEmpty(this.#ghostMask2)) return nothing;

        // prettier-ignore
        return html` <div aria-hidden="true" data-role="underlay">
            <pre>${this.#ghostMask1}</pre><pre>${this.#ghostMask2}</pre>
        </div> `;
    }
}
