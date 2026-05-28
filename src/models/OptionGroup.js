import { html } from 'lit';
import BaseModel from './BaseModel.js';
import Option from './Option.js';

/** Represents an option group model. */
export default class OptionGroup extends BaseModel {
    label = '';
    disabled = false;
    hidden = false;
    #options = [];

    /**
     * Gets or sets the child options of this option group.
     * @type {Option[]}
     */
    get options() {
        return this.#options;
    }

    set options(value) {
        const isCollection =
            (typeof HTMLCollection !== 'undefined' && value instanceof HTMLCollection) ||
            (typeof HTMLOptionsCollection !== 'undefined' && value instanceof HTMLOptionsCollection) ||
            (typeof NodeList !== 'undefined' && value instanceof NodeList);

        const source = Array.isArray(value) || isCollection ? Array.from(value) : null;

        if (!source) {
            this.#options = [];
            return;
        }

        this.#options = source.map(child => (child instanceof Option ? child : Option.init(child)));
    }

    /**
     * Native alias for optgroup children. Helps BaseModel.init map HTMLOptGroupElement.children.
     * @type {Option[]}
     */
    get children() {
        return this.#options;
    }

    set children(value) {
        this.options = value;
    }

    get htmlElement() {
        return html`<optgroup label=${this.label} ?disabled=${this.disabled} ?hidden=${this.hidden}>${this.#options.map(childOption => childOption.htmlElement)}</optgroup>`;
    }

    /**
     * Checks if any option in the group is selected.
     * @return {boolean} True if any option is selected, otherwise false.
     */
    get selected() {
        return this.#options.some(option => option.selected);
    }

    /**
     * Gets the value of the selected option in the group.
     * @return {string} The value of the selected option, or an empty string if none are selected.
     */
    get value() {
        return this.#options.find(option => option.selected)?.value || '';
    }
}
