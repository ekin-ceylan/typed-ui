import InputBase from '../../core/input-base.js';
import SlotCollectorMixin from '../../mixins/slot-collector-mixin.js';

export default class SelectBase extends SlotCollectorMixin(InputBase) {
    // #region STATICS, FIELDS, GETTERS
    static properties = {
        options: { type: Array, attribute: false },
        isOpen: { state: false }, // Açık / kapalı
        disabled: { type: Boolean, reflect: true },
    };

    static get observedAttributes() {
        const base = super.observedAttributes ?? [];
        return [...base, 'value']; // Lit’in kendi listesi + listem
    }
    // #endregion STATICS, FIELDS, GETTERS

    constructor() {
        super();

        this.value = null;
        this.label = '';
        this.placeholder = 'Seçiniz';
        this.required = false;
        this.isOpen = false;

        // /** @type {HTMLOptionElement[] | HTMLOptGroupElement[] | SelectBoxOption[] | []} */
        // this.options = [];
    }

    // clear() {
    //     this.value = null;
    // }
}
