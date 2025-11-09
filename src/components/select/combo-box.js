import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import InputBase from '../../core/input-base.js';
import SlotCollectorMixin from '../../mixins/slot-collector-mixin.js';

export default class ComboBox extends SlotCollectorMixin(InputBase) {
    static properties = {
        options: { type: Array }, // [{ value, label }]
        isOpen: { state: false }, // Açık / kapalı (yaklaşık)
        disabled: { type: Boolean, reflect: true },
        optionList: { type: Array, state: true, attribute: false }, // internal
    };

    static get observedAttributes() {
        const base = super.observedAttributes ?? [];
        return [...base, 'value', 'options']; // Lit’in kendi listesi + listem
    }

    #clear() {
        this.value = '';
        this.dispatchEvent(new CustomEvent('input', this.#eventInitDict()));
        this.dispatchEvent(new CustomEvent('change', this.#eventInitDict()));
    }

    #optionToDiv(opt, selectedValue) {
        const div = document.createElement('div');
        div.setAttribute('role', 'option');
        div.dataset.value = opt.value;
        div.innerHTML = opt.label ?? opt.innerHTML;

        if (opt.disabled) {
            div.setAttribute('aria-disabled', 'true');
        }

        if (opt.selected || selectedValue === opt.value) {
            div.setAttribute('aria-selected', 'true');
        }

        return div;
    }

    onFormSubmit(e) {}

    #toListElement(raw) {
        if (raw instanceof HTMLOptionElement || typeof raw === 'object') {
            return this.#optionToDiv(raw);
        }

        if (typeof raw === 'string' || typeof raw === 'number') {
            const opt = { value: String(raw), label: String(raw) };
            return this.#optionToDiv(opt);
        }

        throw new TypeError(`Invalid option entry: ${String(raw)}`);
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
        } else if (name === 'options') {
            if (!Array.isArray(this.options)) {
                throw new TypeError('options must be an array');
            }

            this.optionList = this.options.map(o => this.#toListElement(o));
            this.requestUpdate();
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
        const label = html`<label id=${ifDefined(this.labelId)} for=${ifDefined(this.fieldId)}> ${this.inputLabel} </label>`;

        return html`
            ${this.label && !this.hideLabel ? label : ``}
            <div data-open=${this.isOpen}>
                <input type="hidden" id=${ifDefined(this.fieldId)} name=${ifDefined(this.fieldName || this.fieldId)} />
                <input type="search" />
                ${this.required ? null : btnClear}
                <svg class="indicator chevron" width="24" height="24" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
                <div role="listbox" aria-expanded=${this.isOpen ? 'true' : 'false'}>
                    <div disabled ?hidden=${this.optionList?.length > 0}>Kayıt Bulunamadı</div>
                    ${this.optionList}
                </div>
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
            if (!hasOptions && node instanceof HTMLOptionElement) {
                this.optionList.push(this.#optionToDiv(node));
                node.selected && (this.value = node.value);
            }

            node.remove(); // remove all nodes
        }

        this.requestUpdate();
    }

    firstUpdated() {
        this.inputElement = this.renderRoot.querySelector('input[type="hidden"]');
    }

    constructor() {
        super();

        this.value = null;
        this.label = '';
        this.placeholder = 'Seçiniz';
        this.required = false;
        this.options = [];
        this.optionList = [];
        this.isOpen = false;
    }
}

customElements.define('combo-box', ComboBox);
