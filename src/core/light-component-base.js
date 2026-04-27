import { LitElement } from 'lit';
import { isEmpty } from '../modules/utilities';
import WarningField from '../models/WarningField';

/**
 * @abstract Base class for components that render into the **light DOM** (no ShadowRoot).
 *
 * Purpose:
 * - Keep page/global styles affecting the component (no style encapsulation).
 * - Provide small shared utilities (e.g. custom event helper).
 *
 * Notes:
 * - Because it extends `LitElement`, instances have `updateComplete`, `requestUpdate`, etc.
 * - `createRenderRoot()` returns `this`, so styles and DOM are not encapsulated. *
 * @extends {LitElement}
 */
export default class LightComponentBase extends LitElement {
    /**
     * Stable component identifier for logs/errors (minify-safe).
     * Falls back to constructor.name when not connected/upgraded.
     * @protected
     * @returns {string}
     */
    get componentName() {
        return this.localName || (this.tagName ? this.tagName.toLowerCase() : '') || this.constructor.name;
    }

    get requiredFields() {
        return [];
    }

    /**
     * Fields that should trigger a warning if not set.
     * @protected
     * @returns {WarningField[]}
     */
    get warningFields() {
        return [];
    }

    /** @override */
    connectedCallback() {
        super.connectedCallback();
        this.#validateRequiredFields();
        this.#validateWarningFields();
    }

    /** @override */
    willUpdate(changedProperties) {
        super.willUpdate(changedProperties);

        if (this.requiredFields.some(fieldName => changedProperties.has(fieldName))) {
            this.#validateRequiredFields();
        }

        if (this.warningFields.some(({ fields }) => fields.some(fieldName => changedProperties.has(fieldName)))) {
            this.#validateWarningFields();
        }
    }

    /** @override @protected Render in light DOM to keep page styles. */
    createRenderRoot() {
        return this; // Shadow DOM'u kapat
    }

    /**
     * Helper to dispatch custom events with consistent options and detail structure.
     * @param {string} eventName
     * @param {Event | null} originalEvent
     * @param {Object | null} data - Additional data to include in event.detail
     */
    dispatchCustomEvent(eventName, originalEvent = null, data = null) {
        this.dispatchEvent(new CustomEvent(eventName, this.#eventInitDict(originalEvent, data)));
    }

    #eventInitDict(originalEvent, data) {
        return {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: {
                ...data,
                originalEvent,
                synthetic: !(originalEvent && originalEvent instanceof Event),
            },
        };
    }

    #validateRequiredFields() {
        for (const fieldName of this.requiredFields) {
            if (isEmpty(this[fieldName])) {
                throw new Error(`${this.componentName}: '${fieldName}' attribute must be set.`);
            }
        }
    }

    #validateWarningFields() {
        for (const warning of this.warningFields) {
            if (!Array.isArray(warning.fields) || warning.fields.length === 0) {
                continue;
            }

            if (warning.fields.some(fieldName => isEmpty(this[fieldName]))) {
                const message = warning.message || `${warning.fields.join(', ')} attribute${warning.fields.length > 1 ? 's are' : ' is'} missing.`;
                console.warn(`${this.componentName}: ${message}`);
            }
        }
    }
}
