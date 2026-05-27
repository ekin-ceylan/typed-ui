import { html } from 'lit';
import BaseModel from './BaseModel.js';
import { ifDefined } from '../modules/utilities.js';

/** Represents an option model. */
export default class Option extends BaseModel {
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
        return html`<option label=${ifDefined(this.label)} value=${this.value} ?selected=${this.selected} ?disabled=${this.disabled}>${this.displayText}</option>`;
    }
}
