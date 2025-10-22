import { LitElement, html, css } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { classMap } from 'lit/directives/class-map.js';
import { injectStyles } from '../../modules/utilities.js';

export default class SelectBox extends LitElement {
    #styleId = 'select-box-styles';
    #mouseFlag = false;
    selectElement = null; // DOM select elementi

    // Public & internal reactive properties
    static properties = {
        fieldId: { type: String, attribute: 'field-id' },
        fieldName: { type: String, attribute: 'field-name' },
        value: { type: String, attribute: false }, // Seçili değer
        label: { type: String },
        hideLabel: { type: Boolean, attribute: 'hide-label' },
        placeholder: { type: String, reflect: true },
        required: { type: Boolean, reflect: true },
        ariaInvalid: { type: Boolean, attribute: 'aria-invalid' },
        validationMessage: { state: true },
        options: { type: Array }, // [{ value, label }]
        isOpen: { state: false }, // Açık / kapalı (yaklaşık)
        disabled: { type: Boolean, reflect: true },
    };

    static styles = css`
        select-box {
            --sbx-placeholder-color: #757575;
            --sbx-placeholder-focus-color: #111;

            --sbx-indicator-size: 16px;

            --sbx-clear-color: #6c6c6c;
            --sbx-clear-hover: #3e3e3e;
            --sbx-clear-active: #222;
            --sbx-clear-bg-hover: rgba(0, 0, 0, 0.05);
            --sbx-clear-bg-active: rgba(0, 0, 0, 0.1);
            --sbx-clear-right-distance: 28px;

            --sbx-chevron-right-distance: 12px;
        }

        select-box[data-not-ready] * {
            display: none;
            pointer-events: none;
        }

        select-box > div {
            position: relative;
            display: inline-block;
        }

        select-box > div > select {
            appearance: none;
            -webkit-appearance: none;
            -moz-appearance: none;

            box-sizing: border-box;
            padding-right: calc(var(--sbx-clear-right-distance) + var(--sbx-indicator-size));
            text-overflow: ellipsis;
            width: 100%;
        }

        select-box > div > select.placeholder {
            color: var(--sbx-placeholder-color);
        }
        select-box > div > select.placeholder:focus {
            color: var(--sbx-placeholder-focus-color);
        }

        select-box > div > select ~ .indicator {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);

            width: var(--sbx-indicator-size);
            height: var(--sbx-indicator-size);
            transition: all 0.2s;
        }

        select-box > div > select ~ .btn-clear {
            border: none;
            background: none;
            line-height: 0px;
            padding: 4px;
            right: var(--sbx-clear-right-distance);
            border-radius: 2px;
        }

        select-box > div > select ~ .btn-clear {
            color: var(--sbx-clear-color);
        }

        select-box > div > select ~ .btn-clear:not(:disabled) {
            cursor: pointer;
        }

        select-box > div > select ~ .btn-clear:not(:disabled):hover {
            background: var(--sbx-clear-bg-hover);
            color: var(--sbx-clear-hover);
        }

        select-box > div > select ~ .btn-clear:not(:disabled):active {
            background: var(--sbx-clear-bg-active);
            transform: translateY(-50%) scale(0.85);
            color: var(--sbx-clear-active);
        }

        select-box > div > select ~ .btn-clear:disabled {
            opacity: 0.35;
            pointer-events: none;
        }

        select-box > div > select ~ .btn-clear > svg {
            color: inherit;
            fill: currentColor;
        }

        select-box > div > select ~ .chevron {
            right: var(--sbx-chevron-right-distance);
            pointer-events: none;
        }

        select-box > div > select[aria-expanded='true'] ~ .chevron {
            transform: translateY(-50%) rotate(180deg);
        }
    `;

    static get observedAttributes() {
        const base = super.observedAttributes ?? [];
        return [...base, 'value']; // Lit’in kendi listesi + listem
    }

    get inputLabel() {
        return this.label && this.label + (this.required ? '*' : '');
    }

    get labelId() {
        return this.fieldId ? `${this.fieldId}-label` : null;
    }

    get errorId() {
        return this.fieldId ? `${this.fieldId}-error` : null;
    }

    get requiredValidationMessage() {
        return `${this.label} alanı gereklidir.`;
    }

    // #region EVENT LISTENERS
    onInput(e) {
        e.stopPropagation();
        this.value = e.target.value;
        this.isOpen = false;
        this.#checkValidity(false);
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
        const el = this.selectElement;
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

    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);

        if (name === 'value' && this.value != newValue) {
            this.value = newValue;

            this.updateComplete.then(() => {
                this.dispatchEvent(new CustomEvent('update', this.#eventInitDict()));
            });
        }
    }

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

        const validationMessage = html`<span
            id=${ifDefined(this.errorId)}
            class="${this.validationMessage ? 'error' : ''}"
            ?hidden=${!this.validationMessage}
            aria-live="assertive"
        >
            ${this.validationMessage}
        </span>`;

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
                    aria-expanded=${String(this.isOpen)}
                    @input=${this.onInput}
                    @change=${this.onChange}
                    @mousedown=${this.onMousedown}
                    @mouseup=${this.onMouseup}
                    @keydown=${this.onKeydown}
                    @keyup=${this.onKeyup}
                    @blur=${this.onBlur}
                    @invalid=${this.onInvalid}
                    ?data-has-value=${this.value}
                >
                    <option value="" disabled selected hidden>${this.placeholder}</option>
                    <option disabled ?hidden=${this.options?.length > 0}>Kayıt Bulunamadı</option>
                    ${this.options.map(
                        opt => html`<option value=${opt.value} ?selected=${opt.selected} style="line-height:100px; padding:16px 8px; font-family:sans-serif">${opt.label}</option>`
                    )}
                </select>

                ${this.required ? null : btnClear}

                <svg class="indicator chevron" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
            </div>
            ${this.required ? validationMessage : null}
        `;
    }

    connectedCallback() {
        super.connectedCallback();
        // Eğer options boşsa ve kullanıcı host içine <option> yazdıysa onları topla
        if (!this.options || this.options.length === 0) {
            const userOptions = Array.from(this.querySelectorAll(':scope > option'));

            this.options = userOptions?.map(o => {
                const opt = {
                    value: o.getAttribute('value') ?? '',
                    label: (o.textContent || '').trim(),
                    selected: o.hasAttribute('selected'),
                };
                o.remove();

                return opt;
            });
        }
    }

    firstUpdated() {
        this.selectElement = this.renderRoot.querySelector('select');
        const form = this.closest('form');
        form?.addEventListener('submit', this.onFormSubmit.bind(this));
        this.removeAttribute('data-not-ready');
    }

    createRenderRoot() {
        return this; // Shadow DOM'u kapat
    }

    constructor() {
        super();
        this.setAttribute('data-not-ready', '');
        injectStyles(this.#styleId, this.constructor.styles.cssText);

        this.value = null;
        this.label = '';
        this.placeholder = '';
        this.required = false;
        this.options = [];
        this.isOpen = false;
    }
}

customElements.define('select-box', SelectBox);
