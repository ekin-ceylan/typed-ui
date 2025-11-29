import { LitElement } from 'lit';

export default class LightComponentBase extends LitElement {
    constructor() {
        super();
        this.toggleAttribute('data-not-ready', true);
    }

    /** @override */
    connectedCallback() {
        super.connectedCallback();
        this.#firstUpdateCompleted();
    }

    async #firstUpdateCompleted() {
        await this.updateComplete;
        this.toggleAttribute('data-not-ready', false);
    }

    dispatchCustomEvent(eventName, originalEvent = null) {
        this.dispatchEvent(new CustomEvent(eventName, this.#eventInitDict(originalEvent)));
    }

    #eventInitDict(originalEvent) {
        return {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: {
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
