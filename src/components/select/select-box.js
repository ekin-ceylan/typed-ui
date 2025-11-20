import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { classMap } from 'lit/directives/class-map.js';
import InputBase from '../../core/input-base.js';
import SlotCollectorMixin from '../../mixins/slot-collector-mixin.js';

export default class SelectBox extends SlotCollectorMixin(InputBase) {
    #mouseFlag = false;

    // Public & internal reactive properties
    static properties = {
        options: { type: Array, attribute: false }, // [{ value, label }]
        isOpen: { state: false }, // Açık / kapalı (yaklaşık)
        disabled: { type: Boolean, reflect: true },
    };

    static get observedAttributes() {
        const base = super.observedAttributes ?? [];
        return [...base, 'value']; // Lit’in kendi listesi + listem
    }

    /** @type {HTMLOptionElement[] | HTMLOptGroupElement[]} */
    #optionList = [];
    #options = [];

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
        if (raw instanceof HTMLOptionElement) {
            return raw;
        }

        if (typeof raw === 'string' || typeof raw === 'number') {
            const opt = document.createElement('option');
            opt.value = String(raw);
            opt.label = String(raw);

            return opt;
        }

        if (raw && typeof raw === 'object') {
            const opt = document.createElement('option');
            Object.assign(opt, raw);

            return opt;
        }

        throw new TypeError(`Invalid option entry: ${String(raw)}`);
    }

    #completeOptionUpdate() {
        this.requestUpdate();
        this.updateComplete.then(() => {
            this.value = this.inputElement?.value || this.value;
        });
    }

    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);

        if (name === 'value' && this.value != newValue) {
            this.value = newValue;

            this.updateComplete.then(() => {
                this.dispatchEvent(new CustomEvent('update', this.#eventInitDict()));
            });
        }
    }

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
                    ${this.#optionList}
                </select>

                ${this.required ? null : btnClear}

                <svg class="indicator chevron" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
            </div>
            ${this.required ? this.validationMessageHtml : null}
        `;
    }

    /**
     * @override @protected Binds the collected nodes to the select box options.
     * @param {NodeList} collectedNodes - The nodes to bind.
     */
    bindSlots(collectedNodes) {
        const hasOptions = this.options?.length > 0;

        for (const node of collectedNodes) {
            const isAllowedType = node instanceof HTMLOptionElement || node instanceof HTMLOptGroupElement;

            if (!hasOptions && isAllowedType) {
                this.#optionList.push(node);
                continue;
            }

            node.remove(); // remove all other nodes
        }

        this.#completeOptionUpdate();
    }

    firstUpdated() {
        this.inputElement = this.renderRoot.querySelector('select');
    }

    constructor() {
        super();

        this.value = null;
        this.label = '';
        this.placeholder = 'Seçiniz';
        this.required = false;
        this.options = [];
        this.isOpen = false;
    }
}

customElements.define('select-box', SelectBox);

// test case: başlangıç değeri varsa seçili gelsin
