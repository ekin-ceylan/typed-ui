import { LitElement } from 'lit';

export default class LightComponentBase extends LitElement {
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
