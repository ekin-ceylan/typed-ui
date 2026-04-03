import { LitElement } from 'lit';

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

    /** @override @protected Render in light DOM to keep page styles. */
    createRenderRoot() {
        return this; // Shadow DOM'u kapat
    }
}
