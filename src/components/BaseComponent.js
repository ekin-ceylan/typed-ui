import { LitElement } from 'lit';

export class BaseComponent extends LitElement {
    static get properties() {
        return {
            value: { type: String, reflect: true },
        };
    }

    constructor() {
        super();
    }

    createRenderRoot() {
        return this; // Shadow DOM'u kapat
    }
}
