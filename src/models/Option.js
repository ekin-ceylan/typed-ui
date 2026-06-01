import { html } from 'lit';
import { ifDefined } from '../modules/utilities.js';
import { spread } from '../modules/spread.js';
import HtmlBaseModel from './HtmlBaseModel.js';

/**
 * Represents an option model for select elements, encapsulating properties such as `label`, `text`, `value`, `selected`, and `disabled`.
 * - This model extends `HtmlBaseModel` to inherit common HTML-related properties and behaviors, including handling of ARIA attributes and custom data attributes.
 * - The `displayText` getter provides a convenient way to determine the text to be displayed for the option, prioritizing `label`, then `text`, and finally `value`.
 * - The `htmlElement` getter generates the corresponding HTML template for rendering the option element, applying all relevant attributes and properties.
 * @extends HtmlBaseModel
 */
export default class Option extends HtmlBaseModel {
    label = '';
    text = '';
    value = '';
    selected = false;
    disabled = false;

    /**
     * Gets the display text for rendering.
     * Prefers explicit text; falls back to label then value.
     * @returns {string}
     */
    get displayText() {
        return this.label || this.text || this.value;
    }

    get htmlElement() {
        return html`<option
            label=${ifDefined(this.label)}
            value=${this.value}
            ?selected=${this.selected}
            ?disabled=${this.disabled}
            ?hidden=${this.hidden}
            ${spread(this.dataset, 'data-')}
            ${spread(this.ariaset, 'aria-')}
        >
            ${this.displayText}
        </option>`;
    }
}
