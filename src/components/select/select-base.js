import { html } from 'lit';
import InputBase from '../../core/input-base.js';
import SlotCollectorMixin from '../../mixins/slot-collector-mixin.js';

/**
 * Base class for select components providing common functionality for select inputs.
 * This is an abstract class that must be extended.
 * @template {HTMLInputElement | HTMLSelectElement} TElement
 * @abstract
 */
export default class SelectBase extends SlotCollectorMixin(InputBase) {
    // #region STATICS, FIELDS, GETTERS
    static properties = {
        ...super.properties,
        isOpen: { type: Boolean, attribute: false }, // Açık / kapalı
        // options: { type: Array, attribute: false },
    };

    /** @override @type {TElement | null} */
    inputElement = null;
    /** @protected @type {import('lit').TemplateResult} */
    chevron = html`<svg role="presentation" data-chevron width="24" height="24" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
    </svg>`;
    /** @protected @type {import('lit').TemplateResult} */
    get btnClear() {
        return html`
            <button type="button" data-clear ?disabled=${!this.value} @click=${this.clear} aria-label="Seçimi temizle">
                <svg fill="currentColor" viewBox="0 0 460.775 460.775" xml:space="preserve">
                    <path
                        d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55  c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55  c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505  c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55  l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719  c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"
                    />
                </svg>
            </button>
        `;
    }

    // #endregion STATICS, FIELDS, GETTERS

    constructor() {
        super();
        this.value = null;
        this.label = '';
        this.required = false;

        /** @type {Boolean} */
        this.isOpen = false;

        // /** @type {HTMLOptionElement[] | HTMLOptGroupElement[] | SelectBoxOption[] | []} */
        // /** @type {HTMLOptionElement[] | HTMLOptGroupElement[] | []} */
        // this.options = [];
    }
}
