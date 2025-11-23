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

    /** @override @protected Render in light DOM to keep page styles. */
    createRenderRoot() {
        return this; // Shadow DOM'u kapat
    }
}
