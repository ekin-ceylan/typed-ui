import { html } from 'lit';
import { checkTcNo, isEmpty } from '../../modules/utilities';
import TextBox from './text-box';

/** @extends TextBox */
export default class TcBox extends TextBox {
    #ghostMask1 = '';
    #ghostMask2 = '';
    #digits = 11;
    #allowPattern = `[0-9]{1,${this.#digits}}`;

    /** @override @type {import('lit').TemplateResult} */
    get overlayDiv() {
        if (isEmpty(this.#ghostMask1) && isEmpty(this.#ghostMask2)) return html``;

        // prettier-ignore
        return html` <div aria-hidden="true" data-role="underlay">
            <pre>${this.#ghostMask1}</pre><pre>${this.#ghostMask2}</pre>
        </div> `;
    }

    constructor() {
        super();

        this.inputmode = 'numeric';
        this.minlength = this.#digits;
        this.maxlength = this.#digits;
        this.allowPattern = this.#allowPattern;
        this.type = 'text';
    }

    willUpdate(changed) {
        if (changed.has('minlength')) this.minlength = this.#digits;
        if (changed.has('maxlength')) this.maxlength = this.#digits;
        if (changed.has('inputmode')) this.inputmode = 'numeric';
        if (changed.has('type')) this.type = 'text';
        if (changed.has('allowPattern')) this.allowPattern = this.#allowPattern;

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
}
