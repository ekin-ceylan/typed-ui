import { LitElement } from 'lit';

/**
 * Base class for components that render into the **light DOM** (no ShadowRoot).
 * - Keep page/global styles affecting the component (no style encapsulation).
 * - Provide `getScopedAttrs()` helper for attribute forwarding.
 * - Provide `dispatchCustomEvent()` helper for consistent custom event dispatching.
 * - Provide a stable `componentName` for logs/errors (minify-safe).
 * - Because it extends `LitElement`, instances have `updateComplete`, `requestUpdate`, etc.
 * - `createRenderRoot()` returns `this`, so styles and DOM are not encapsulated.
 * @abstract DO NOT use this class directly in component definitions (e.g., customElements.define). It is intended to serve strictly as a base class and must be extended by concrete components.
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
}

// güvenli sorgu yardımcısı eklenebilir.
// $scope(selector) { return this.querySelector(selector); }
