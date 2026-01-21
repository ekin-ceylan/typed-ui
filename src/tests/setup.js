/// <reference types="vitest/globals" />
/// <reference types="vitest" />

// import { describe, it, expect, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';

/**
 * Initializes a TextBox component for testing.
 * @param {string} elementStr
 * @returns {Promise<[HTMLInputElement, HTMLElement, import('@testing-library/user-event').UserEvent]>}
 */
async function init(elementStr) {
    document.body.innerHTML = elementStr;

    const host = document.body.firstChild;
    await host.updateComplete;

    const input = host.inputElement;
    input.focus();

    const user = userEvent.setup();

    return [input, host, user];
}

/**
 * Defines a custom element if not already defined.
 * @param {string} elementName
 * @param {CustomElementConstructor} ElementClass
 */
function defineElement(elementName, ElementClass) {
    if (!customElements.get(elementName)) {
        customElements.define(elementName, ElementClass);
    }
}

globalThis.init = init;
globalThis.defineElement = defineElement;
