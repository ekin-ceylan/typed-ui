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
        this.dispatchCustomEvent('input', e);
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

    clear() {
        super.clear();
        this.dispatchCustomEvent('input');
        this.dispatchCustomEvent('change');
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

                ${this.required ? null : this.btnClear} ${this.chevron}
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
