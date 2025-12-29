import { html } from 'lit';
import { ifDefined } from '../../modules/utilities.js';
import InputBase from '../../core/input-base.js';

export default class RangeSelect extends InputBase {
    static properties = {
        min: { type: Number },
        max: { type: Number },
        step: { type: Number },
    };

    onInput(e) {
        this.value = e.target.value;
        // this.#checkValidity();
    }

    /**
     * @protected Handles the invalid event for the text box.
     * @param {Event & { target: HTMLInputElement }} event
     */
    onInvalid(event) {
        // e.preventDefault(); // mesaj baloncuğu çıkmaz
        // this.#checkValidity(true);
    }

    onFormSubmit(_event) {
        // throw new Error(`${this.constructor.name}: onFormSubmit(submitEvent) override edilmek zorunda.`);
    }

    /** @override @protected @returns {import('lit').TemplateResult} */
    render() {
        const label = html`<label id=${ifDefined(this.labelId)} for=${ifDefined(this.fieldId)}> ${this.inputLabel} </label>`;

        return html`
            ${this.label && !this.hideLabel ? label : ``}

            <div>
                <data value=${this.min} aria-hidden="true">${this.min}</data>
                <input
                    id=${ifDefined(this.fieldId)}
                    name=${ifDefined(this.fieldName || this.fieldId)}
                    .value=${this.value ?? ''}
                    ?required=${this.required}
                    ?disabled=${this.disabled}
                    aria-labelledby=${ifDefined(this.labelId)}
                    aria-errormessage=${ifDefined(this.required ? this.errorId : undefined)}
                    aria-required=${this.required ? 'true' : 'false'}
                    ?aria-invalid=${this.ariaInvalid}
                    @input=${this.onInput}
                    @invalid=${this.onInvalid}
                    type="range"
                    min=${this.min}
                    max=${this.max}
                    step=${this.step}
                />
                <data value=${this.max} aria-hidden="true">${this.max}</data>
                <output for=${ifDefined(this.fieldId)}>${this.value}</output>
            </div>
            ${this.required ? this.validationMessageHtml : null}
        `;
    }

    firstUpdated() {
        this.inputElement = this.renderRoot.querySelector('input');
    }

    constructor() {
        super();
        this.min = 0;
        this.max = 100;
        /** @type {number} */
        this.step = 1;
        this.value = String(this.min || 0);
        this.label = '';
        this.required = false;
    }
}
