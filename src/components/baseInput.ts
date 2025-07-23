export default class BaseInput extends HTMLInputElement {
    constructor() {
        super();
    }

    static get observedAttributes() {
        return ['value']; // tell the platform about reactive attributes
    }

    connectedCallback() {
        this.addEventListener('update', event => {
            if (this.getAttribute('onupdate')) {
                new Function('event', this.getAttribute('onupdate')!).call(this, event);
            }
        });
    }

    disconnectedCallback() {}

    attributeChangedCallback(name: string, oldValue: any, newValue: any) {
        if (name === 'value' && oldValue !== newValue) {
            this.value = newValue;
            this.dispatchEvent(new CustomEvent('update'));
        }
    }
}

customElements.define('base-input', BaseInput, { extends: 'input' });
