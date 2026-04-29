import { html } from 'lit';
import LightComponentBase from '../../core/light-component-base';
import { ifDefined } from '../../modules/utilities';
import { spread } from '../../modules/spread';

export default class Image extends LightComponentBase {
    static get properties() {
        return {
            src: { type: String },
            srcset: { type: String },
            sizes: { type: String },
            decorative: { type: Boolean },
            alt: { type: String },
            width: { type: [Number, String] },
            height: { type: [Number, String] },
            loading: { type: String },
            decoding: { type: String },
            fetchpriority: { type: String },
        };
    }

    get warningFields() {
        return [
            ...super.warningFields,
            {
                fields: ['decorative', 'alt'],
                message: "'alt' attribute is missing. Provide descriptive text, or set 'decorative' to indicate the image is intentionally presentation-only.",
            },
        ];
    }

    constructor() {
        super();

        /** @type {string} Source URL of the image */
        this.src = '';
        /** @type {string} Responsive image candidates */
        this.srcset = '';
        /** @type {string} Slot size hints for srcset selection */
        this.sizes = '';
        /** @type {boolean} Whether the image is decorative and should render with empty alt text */
        this.decorative = false;
        /** @type {string} Alternative text for the image */
        this.alt = '';
        /** @type {number|string|null} Width of the image */
        this.width = null;
        /** @type {number|string|null} Height of the image */
        this.height = null;
        /** @type {'lazy'|'eager'} Loading behavior of the image */
        this.loading = 'lazy';
        /** @type {'async'|'sync'} Decoding behavior of the image */
        this.decoding = 'async';
        /** @type {'high'|'low'|'auto'|undefined} Fetch priority hint for the image request */
        this.fetchpriority = undefined;
    }

    render() {
        const altText = this.decorative ? '' : this.alt;

        return html`<img
            ${spread(this.getScopedAttrs('img'))}
            src=${this.src}
            srcset=${ifDefined(this.srcset)}
            sizes=${ifDefined(this.sizes)}
            alt=${altText}
            width=${ifDefined(this.width)}
            height=${ifDefined(this.height)}
            loading=${ifDefined(this.loading)}
            decoding=${ifDefined(this.decoding)}
            fetchpriority=${ifDefined(this.fetchpriority)}
        />`;
    }
}
