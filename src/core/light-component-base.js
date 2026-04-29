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

    /**
     * Fields that are required for the component to function correctly.
     * Subclasses should override this getter to specify their required fields.
     * @protected
     * @returns {string[]}
     */
    get requiredFields() {
        return [];
    }

    /**
     * Fields that should trigger a warning if not set.
     * Each entry has a `fields` array (field names to check/watch) and a `message` string.
     * If any field in the array is empty, the warning is shown.
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
    }

    /** @override */
    updated(changedProperties) {
        super.updated(changedProperties);

        if (this.warningFields.some(w => w.fields.some(f => changedProperties.has(f)))) {
            this.#validateWarningFields();
        }
    }

    /** @override @protected Render in light DOM to keep page styles. */
    createRenderRoot() {
        return this; // Shadow DOM'u kapat
    }

    /**
     * Collects host attributes that carry the given `prefix:` scope, strips
     * the prefix, and returns a plain object ready for the `spread` directive.
     *
     * Convention: write `prefix:attr-name="value"` on the custom element to
     * forward an attribute to a specific inner element without touching the host.
     *
     * @example
     * // In HTML:
     * // <typed-image img:fetchpriority="high" img:aria-hidden="true" />
     *
     * // In render():
     * // html`<img ${spread(this.getScopedAttrs('img'))} src=${this.src} />`
     *
     * @param {string} prefix - Scope name, e.g. `'img'`, `'input'`, `'label'`.
     * @returns {Record<string, string>}
     */
    getScopedAttrs(prefix) {
        const scopePrefix = `${prefix}:`;
        /** @type {Record<string, string>} */
        const result = {};
        for (const { name, value } of this.attributes) {
            if (name.startsWith(scopePrefix)) {
                result[name.slice(scopePrefix.length)] = value;
            }
        }
        return result;
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
        for (const { fields, message } of this.warningFields) {
            if (fields.every(fieldName => isEmpty(this[fieldName]) || this[fieldName] === false)) {
                console.warn(`${this.componentName}: ${message}`);
            }
        }
    }
}
