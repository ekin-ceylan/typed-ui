import BaseInput from './baseInput';

class TextBox extends HTMLElement {
    private inputElement: HTMLInputElement;

    static observedAttributes = ['value', 'disabled', 'placeholder'];

    constructor() {
        super();
        this.inputElement = document.createElement('input');
        this.attachShadow({ mode: 'closed' }).appendChild(this.inputElement);
    }

    connectedCallback() {
        this.syncAttributes();
        this.inputElement.addEventListener('input', this.handleInput.bind(this));
    }

    disconnectedCallback() {
        this.inputElement.removeEventListener('input', this.handleInput.bind(this));
    }

    attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
        if (name === 'value') {
            this.inputElement.value = newValue;
        } else if (name === 'disabled') {
            this.inputElement.disabled = newValue !== null;
        } else if (name === 'placeholder') {
            this.inputElement.placeholder = newValue;
        }
    }

    private handleInput(event: Event) {
        const target = event.target as HTMLInputElement;
        this.setAttribute('value', target.value);
        this.dispatchEvent(new CustomEvent('update', { detail: target.value }));
    }

    private syncAttributes() {
        ['value', 'disabled', 'placeholder'].forEach(attr => {
            if (this.hasAttribute(attr)) {
                this.attributeChangedCallback(attr, '', this.getAttribute(attr) || '');
            }
        });
    }

    get value(): string {
        return this.inputElement.value;
    }

    set value(newValue: string) {
        this.setAttribute('value', newValue);
    }
}

customElements.define('text-box', TextBox);
