import { html } from 'lit';
import { spread } from '../modules/spread.js';
import { ifDefined, sanitizeHtml } from '../modules/utilities.js';
import Option from './Option.js';

/**
 * Represents a combo option model that can have child options (optgroup).
 * @extends Option
 */
export default class ComboOption extends Option {
    #safeInnerHTML = '';
    id = '';

    get innerHTML() {
        return this.#safeInnerHTML;
    }
    set innerHTML(val) {
        this.#safeInnerHTML = sanitizeHtml(val);
    }

    /**
     * Gets the content to be displayed for the combo option.
     * @returns {string} The sanitized innerHTML if set, otherwise the displayText.
     */
    get displayContent() {
        return this.innerHTML || sanitizeHtml(this.displayText);
    }

    /**
     * Converts the combo option model to an HTML template.
     * @param {boolean} isActive
     * @returns {import('lit').TemplateResult}
     */
    toHtml(isActive) {
        return html`
            <div
                id=${ifDefined(this.id)}
                role="option"
                ?hidden=${this.hidden}
                ${spread(this.dataset, 'data-')}
                ${spread(this.ariaset, 'aria-')}
                ?data-active=${isActive}
                data-value=${this.value}
                ?aria-disabled=${!!this.disabled}
                ?aria-selected=${this.selected}
                .innerHTML=${this.displayContent}
            ></div>
        `;
    }

    constructor(data = {}) {
        super(data);

        this.innerHTML = data.innerHTML ?? '';
        this.id = data.id ?? '';
    }
}
