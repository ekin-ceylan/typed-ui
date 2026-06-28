import { html, nothing } from 'lit';
import { ifDefined } from '../../modules/utilities.js';
import SelectBase from '../../base/select-base.js';
import { spread } from '../../modules/spread.js';
import Option from '../../models/Option.js';
import OptionGroup from '../../models/OptionGroup.js';
import CustomOption from './custom-option.js';
import CustomOptgroup from './custom-optgroup.js';

/** @extends {SelectBase<HTMLSelectElement>} */
export default class SelectBox extends SelectBase {
    // #region STATICS, FIELDS, GETTERS

    /** @type {(Option | OptionGroup)[]} */
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

    /**
     * Renders a disabled option element with the noOptionsLabel if there are no options available and a label is provided. Otherwise, returns an empty template.
     * @return {import('lit').TemplateResult | typeof nothing} The template for the no options message or an empty template if there are options or no label is provided.
     */
    get noOptionHtml() {
        const isHidden = this.hasOptions || !this.noOptionsLabel;
        return isHidden ? nothing : html`<option disabled>${this.noOptionsLabel}</option>`;
    }

    // #endregion STATICS, FIELDS, GETTERS

    // #region LIFECYCLE METHODS

    constructor() {
        super();
        /** @type {HTMLOptionElement[] | HTMLOptGroupElement[] | Option[] | OptionGroup[] | []} */
        this.options = [];
    }

    firstUpdated() {
        this.inputElement = this.renderRoot.querySelector('select');
    }

    updated(changed) {
        super.updated(changed);

        if (changed.has('value')) {
            this.#checkValidity();
        }
    }

    // #endregion LIFECYCLE METHODS

    /** @inheritdoc */
    validateNode(node, slotName, hiddenByCollector) {
        if (slotName != 'default') return true;

        const hasOptions = this.options?.length > 0;
        const isOptionElement = node instanceof HTMLOptionElement || node instanceof CustomOption;
        const isOptGroupElement = node instanceof HTMLOptGroupElement || node instanceof CustomOptgroup;
        const isAllowedType = isOptionElement || isOptGroupElement;

        if (hasOptions) {
            console.warn('Options are already set via property. Ignoring slotted nodes.');
            return false;
        }

        if (!isAllowedType) {
            console.error(`Only <option> and <optgroup> elements are allowed as children of ${this.tagName.toLowerCase()}.`);
            return false;
        }

        const option = isOptionElement ? new Option(node) : new OptionGroup(node);
        option.hidden = !hiddenByCollector;
        this.#optionList.push(option);
        if (option.selected) this.value = option.value; // ilk seçili olan değeri alır, birden fazla seçili varsa ilkini alır

        return false;
    }

    /** @inheritdoc */
    afterSlotsBinded() {
        this.inputElement.value = /** @type {string} */ (this.value || '');
    }

    // #region EVENT LISTENERS
    onInput(e) {
        e.stopPropagation();
        this.value = e.target.value;
        this.dispatchCustomEvent('input', e);
    }

    onChange(e) {
        e.stopPropagation();
        this.value = e.target.value;
        this.isOpen = false;
        this.#checkValidity();
        this.dispatchCustomEvent('change', e);
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
        this.#checkValidity(true);
    }

    /** @override Clears the input value and dispatches a 'clear' custom event. */
    onClearClick(event) {
        super.onClearClick(event);
        this.dispatchCustomEvent('input');
        this.dispatchCustomEvent('change');
        this.#checkValidity(true);
    }

    // #endregion EVENT LISTENERS

    // #region PRIVATE METHODS

    #checkValidity(force) {
        if (!this.focused && !force) return true; // etkileşime girilmediyse

        const el = this.inputElement;
        const v = el.validity;

        el.setCustomValidity('');
        this.invalid = !v?.valid; // TODO custom validasyon ekle
        this.validationMessage = v?.valueMissing ? this.requiredValidationMessage : '';
        el.setCustomValidity(this.validationMessage);
        this.dispatchCustomEvent('validate', null, { validationMessage: this.validationMessage });

        return !this.validationMessage;
    }

    #toOptionElement(raw) {
        if (raw instanceof Option || raw instanceof OptionGroup) return raw;
        if (raw instanceof HTMLOptionElement) return new Option(raw);
        if (raw instanceof HTMLOptGroupElement) return new OptionGroup(raw);

        if (typeof raw === 'string' || typeof raw === 'number') {
            return new Option({ value: String(raw) });
        }

        if (raw && typeof raw === 'object') {
            return this.#isGroupLike(raw) ? new OptionGroup(raw) : new Option(raw);
        }

        throw new TypeError(`Invalid option entry: ${String(raw)}`);
    }

    #completeOptionUpdate() {
        this.requestUpdate();
        this.updateComplete.then(() => {
            this.value = this.inputElement?.value || this.value;
        });
    }

    #isGroupLike(object) {
        const optionsValue = object.options;
        const childrenValue = object.children;
        const hasArrayOptions = Array.isArray(optionsValue);
        const hasArrayChildren = Array.isArray(childrenValue);
        const hasCollectionChildren =
            (typeof HTMLCollection !== 'undefined' && childrenValue instanceof HTMLCollection) ||
            (typeof HTMLOptionsCollection !== 'undefined' && childrenValue instanceof HTMLOptionsCollection) ||
            (typeof NodeList !== 'undefined' && childrenValue instanceof NodeList);

        return hasArrayOptions || hasArrayChildren || hasCollectionChildren;
    }

    // #endregion PRIVATE METHODS

    /** @override @protected @returns {import('lit').TemplateResult} */
    render() {
        return html`${this.renderLabel()}
            <div>
                <select
                    ${spread(this.getScopedAttrs('select'))}
                    id=${this.fieldId}
                    name=${ifDefined(this.name)}
                    ?required=${this.required}
                    ?disabled=${this.disabled}
                    aria-labelledby=${ifDefined(this.labelId)}
                    aria-label=${ifDefined(this.hideLabel ? this.label : undefined)}
                    aria-errormessage=${ifDefined(this.required ? this.errorId : undefined)}
                    aria-required=${this.required ? 'true' : 'false'}
                    aria-invalid=${ifDefined(this.ariaInvalid)}
                    @input=${this.onInput}
                    @change=${this.onChange}
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
                    ${this.noOptionHtml} ${this.#optionList.map(option => option.htmlElement)}
                </select>

                ${this.renderClearButton()} ${this.renderIndicator()}
            </div>
            ${this.renderErrorMessage()}`;
    }
}

// test case: başlangıç değeri varsa seçili gelsin
