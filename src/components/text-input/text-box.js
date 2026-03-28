import TextBase from '../../core/text-base.js';

/**
 * General purpose text input component. Can be used for various input types such as text, email, password, number, etc. depending on the `type` attribute.
 * - Can be used after defining like `defineElement('text-box', TextBox)` or `customElement.define('text-box', TextBox)`.
 * - The `required`, `pattern`, `maxlength`, `minlength`, `min`, `max` attributes can be used for validation.
 * - The `allow-pattern` attribute determines which characters are allowed to be entered. For example, if `allow-pattern="\d"` then only numeric input is allowed.
 * @example <text-box name="year" required allow-pattern="\d" minlength="4" maxlength="4"></text-box>
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
