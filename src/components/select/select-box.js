import { html } from 'lit';
import { ifDefined } from '../../modules/utilities.js';
import SelectBase from './select-base.js';

/** @extends {SelectBase<HTMLSelectElement>} */
export default class SelectBox extends SelectBase {
    // #region STATICS, FIELDS, GETTERS

    /** @type {SelectBoxOption[]} */
    #optionList = []; // işlenmiş seçenek listesi
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

    get hasOptions() {
        return this.#optionList?.length > 0;
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
     * @override Validates nodes for slot binding.
     * @param {HTMLElement|Text} node
     * @param {String} slotName
     * @returns {Boolean}
     */
    validateNode(node, slotName) {
        if (slotName != 'default') return true;

        const hasOptions = this.options?.length > 0;
        const isAllowedType = node instanceof HTMLOptionElement || node instanceof HTMLOptGroupElement;

        if (hasOptions) {
            console.warn('Options are already set via property. Ignoring slotted nodes.');
            return false;
        }

        if (!isAllowedType) {
            console.error('Only <option> and <optgroup> elements are allowed as children of <select-box>.');
            return false;
        }

        const option = new SelectBoxOption(node);
        this.#optionList.push(option);
        option.selected && (this.value = option.value);

        return false;
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
        this.invalid = !v?.valid;
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
                    class=${ifDefined(this.inputClass)}
                    .value=${this.value ?? ''}
                    ?required=${this.required}
                    ?disabled=${this.disabled}
                    aria-labelledby=${ifDefined(this.labelId)}
                    aria-errormessage=${ifDefined(this.required ? this.errorId : undefined)}
                    aria-required=${this.required ? 'true' : 'false'}
                    aria-invalid=${ifDefined(this.ariaInvalid)}
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
                    <option disabled ?hidden=${this.hasOptions || !this.noOptionsLabel}>${this.noOptionsLabel}</option>
                    ${this.#optionList.map(option => option.htmlElement)}
                </select>

                ${this.required ? null : this.btnClear} ${this.chevron}
            </div>
            ${this.required ? this.validationMessageHtml : null}
        `;
    }
}

// test case: başlangıç değeri varsa seçili gelsin

class SelectBoxOption {
    label = '';
    #value = '';
    #selected = false;
    disabled = false;
    options = []; // alt seçenekler (optgroup için)

    get value() {
        return this.isOptGroup ? this.options.find(opt => opt.selected)?.value || '' : this.#value;
    }

    set value(value) {
        if (this.isOptGroup) return;
        this.#value = value;
    }

    get selected() {
        return this.isOptGroup ? this.options.some(opt => opt.selected) : this.#selected;
    }

    set selected(value) {
        if (this.isOptGroup) return;
        this.#selected = value;
    }

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
