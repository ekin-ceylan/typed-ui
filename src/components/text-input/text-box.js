import TextBase from '../../core/text-base.js';

/**
 * @extends {TextBase}
 */
export default class TextBox extends TextBase {
    static get properties() {
        return {
            ...super.properties,
            type: { type: String },
            inputmode: { type: String, reflect: true },
            pattern: { type: String, reflect: true },
            allowPattern: { type: String, attribute: 'allow-pattern' },
            maxlength: { type: Number },
            minlength: { type: Number },
            max: { type: Number, reflect: true },
            min: { type: Number, reflect: true },
            autounmask: { type: Boolean },
            autocomplete: { type: String },
            spellcheck: { type: Boolean, reflect: true },
        };
    }

    constructor() {
        super();

        this.spellcheck = true;
    }
}
