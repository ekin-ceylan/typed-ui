import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { classMap } from 'lit/directives/class-map.js';
import SelectBase from './select-base.js';

export default class SelectBox extends SelectBase {
    // #region STATICS, FIELDS, GETTERS

    /** @type {SelectBoxOption[]} */
    #optionList = [];
    #options = [];
    #mouseFlag = false;

    get options() {
        return this.#options;
    }
    set options(val) {
        if (!Array.isArray(val)) {
            throw new TypeError('options must be an array');
        }
        this.#options = val;
        this.#optionList = val.map(o => this.#toOptionElement(o));
        this.#completeOptionUpdate();
    }

    // #endregion STATICS, FIELDS, GETTERS

    constructor() {
        super();

        /** @type {HTMLOptionElement[] | HTMLOptGroupElement[] | SelectBoxOption[] | []} */
        this.options = [];
    }

    // #region LIFECYCLE METHODS

    firstUpdated() {
        this.inputElement = this.renderRoot.querySelector('select');
    }

    // #endregion LIFECYCLE METHODS

    /**
     * @override @protected Binds the collected nodes to the select box options.
     * @param {NodeList} collectedNodes - The nodes to bind.
     */
    bindSlots(collectedNodes) {
        if (this.options?.length > 0) {
            collectedNodes.map(node => node.remove()); // detach nodes
            return;
        }

        this.options = collectedNodes.reduce((acc, node) => {
            const isAllowedType = node instanceof HTMLOptionElement || node instanceof HTMLOptGroupElement;
            if (isAllowedType) {
                acc.push(new SelectBoxOption(node));
            }
            node.remove(); // remove nodes

            return acc;
        }, []);
    }

    // #region EVENT LISTENERS
    onInput(e) {
        e.stopPropagation();
        this.value = e.target.value;
        this.isOpen = false;
        this.#checkValidity();
        this.dispatchEvent(new CustomEvent('input', this.#eventInitDict(e)));
    }

    onBlur(_e) {
        this.isOpen = false;
        this.#checkValidity();
    }

    onMouseup(e) {
        if (e.target instanceof HTMLOptionElement || !this.#mouseFlag) {
            this.isOpen = false;
        }

        this.#mouseFlag = false;
    }

    onMousedown(_e) {
        this.#mouseFlag = true;
        this.isOpen = !this.isOpen;
    }

    onKeydown(e) {
        if (e.key === ' ' || e.key === 'Enter') {
            this.isOpen = true;
        }
    }

    onKeyup(e) {
        if (e.key === 'Escape' || e.key === 'Tab' || e.key === 'Enter') {
            this.isOpen = false;
        }
    }

    onInvalid(_e) {
        // e.preventDefault(); // mesaj baloncuğu çıkmaz
        this.#checkValidity();
    }

    onFormSubmit(e) {
        if (!this.#checkValidity()) {
            e.preventDefault();
        }
    }
    // #endregion EVENT LISTENERS

    // #region PRIVATE METHODS
    #clear() {
        this.value = '';
        this.dispatchEvent(new CustomEvent('input', this.#eventInitDict()));
        this.dispatchEvent(new CustomEvent('change', this.#eventInitDict()));
    }

    #checkValidity() {
        const el = this.inputElement;
        const v = el.validity;

        el.setCustomValidity('');
        this.ariaInvalid = !v?.valid;
        this.validationMessage = v?.valueMissing ? this.requiredValidationMessage : '';
        el.setCustomValidity(this.validationMessage);

        return !this.validationMessage;
    }

    #eventInitDict(originalEvent) {
        return {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: {
                originalEvent,
                synthetic: !(originalEvent && originalEvent instanceof Event),
            },
        };
    }

    #toOptionElement(raw) {
        if (raw instanceof SelectBoxOption) {
            return raw;
        }

        if (raw instanceof HTMLOptionElement || raw instanceof HTMLOptGroupElement) {
            return new SelectBoxOption(raw);
        }

        if (typeof raw === 'string' || typeof raw === 'number') {
            return new SelectBoxOption({ value: String(raw), label: String(raw) });
        }

        if (raw && typeof raw === 'object') {
            return new SelectBoxOption(raw);
        }

        throw new TypeError(`Invalid option entry: ${String(raw)}`);
    }

    #completeOptionUpdate() {
        this.requestUpdate();
        this.updateComplete.then(() => {
            this.value = this.inputElement?.value || this.value;
        });
    }

    // #endregion PRIVATE METHODS

    /** @override @protected @returns {import('lit').TemplateResult} */
    render() {
        const btnClear = html`
            <button type="button" class="indicator btn-clear" ?disabled=${!this.value} @click=${this.#clear} aria-label="Seçimi temizle">
                <svg fill="currentColor" viewBox="0 0 460.775 460.775" xml:space="preserve">
                    <path
                        d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55  c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55  c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505  c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55  l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719  c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"
                    />
                </svg>
            </button>
        `;

        const label = html`<label id=${ifDefined(this.labelId)} for=${ifDefined(this.fieldId)}> ${this.inputLabel} </label>`;

        return html`
            ${this.label && !this.hideLabel ? label : ``}

            <div>
                <select
                    id=${ifDefined(this.fieldId)}
                    name=${ifDefined(this.fieldName || this.fieldId)}
                    class=${classMap({ placeholder: !this.value })}
                    .value=${this.value ?? ''}
                    ?required=${this.required}
                    ?disabled=${this.disabled}
                    aria-labelledby=${ifDefined(this.labelId)}
                    aria-errormessage=${ifDefined(this.required ? this.errorId : undefined)}
                    aria-required=${this.required ? 'true' : 'false'}
                    ?aria-invalid=${this.ariaInvalid}
                    @input=${this.onInput}
                    @mousedown=${this.onMousedown}
                    @mouseup=${this.onMouseup}
                    @keydown=${this.onKeydown}
                    @keyup=${this.onKeyup}
                    @blur=${this.onBlur}
                    @invalid=${this.onInvalid}
                    ?data-has-value=${this.value}
                    ?data-open=${this.isOpen}
                >
                    <option value="" disabled selected hidden>${this.placeholder}</option>
                    <option disabled ?hidden=${this.#optionList?.length > 0}>Kayıt Bulunamadı</option>
                    ${this.#optionList.map(option => option.htmlElement)}
                </select>

                ${this.required ? null : btnClear}

                <svg class="indicator chevron" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
            </div>
            ${this.required ? this.validationMessageHtml : null}
        `;
    }
}

customElements.define('select-box', SelectBox);

// test case: başlangıç değeri varsa seçili gelsin

class SelectBoxOption {
    label = '';
    value = '';
    selected = false;
    disabled = false;
    options = []; // alt seçenekler (optgroup için)

    get isOptGroup() {
        return this.options?.length > 0;
    }

    get htmlElement() {
        if (this.isOptGroup) {
            return html`<optgroup label=${this.label}>${this.options.map(childOption => childOption.htmlElement)}</optgroup>`;
        }
        return html`<option value=${this.value} ?selected=${this.selected} ?disabled=${this.disabled}>${this.label}</option>`;
    }

    constructor(option) {
        this.value = option?.value || '';
        this.label = option?.label || '';
        this.selected = option?.selected || false;
        this.disabled = option?.disabled || false;

        if (option instanceof HTMLOptGroupElement) {
            this.options = Array.from(option.children)
                .filter(child => child instanceof HTMLOptionElement)
                .map(child => new SelectBoxOption(child));
        } else {
            this.options = option?.options || [];
        }
    }
}
