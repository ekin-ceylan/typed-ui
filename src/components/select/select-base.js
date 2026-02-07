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
        noOptionsLabel: { type: String, attribute: 'no-options-label' },
        isOpen: { type: Boolean, attribute: false }, // Açık / kapalı
        // options: { type: Array, attribute: false },
    };

    /** @override @type {TElement | null} */
    inputElement = null;
    /** @protected @type {import('lit').TemplateResult} */
    chevron = html`<svg role="presentation" data-chevron width="24" height="24" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
    </svg>`;

    // #endregion STATICS, FIELDS, GETTERS

    constructor() {
        super();
        this.value = null;
        this.label = '';
        this.required = false;

        /** @type {Boolean} */
        this.isOpen = false;

        /** @type {String} */
        this.noOptionsLabel = 'Kayıt Bulunamadı';

        // /** @type {HTMLOptionElement[] | HTMLOptGroupElement[] | SelectBoxOption[] | []} */
        // /** @type {HTMLOptionElement[] | HTMLOptGroupElement[] | []} */
        // this.options = [];
    }
}
