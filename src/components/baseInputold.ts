export default class BaseInput extends HTMLElement {
    private inputElement: HTMLInputElement;

    constructor() {
        super();
        // this.attachShadow({ mode: 'open' });
        this.inputElement = document.createElement('input');
    }

    connectedCallback() {
        this.syncAttributes(); // Başlangıçta attribute'ları uygula
        this.replaceWith(this.inputElement);

        new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'attributes' && mutation.attributeName) {
                    this.syncSingleAttribute(mutation.attributeName);
                }
            });
        }).observe(this, { attributes: true, attributeOldValue: true });
    }

    get value() {
        return this.inputElement.value;
    }

    set value(newValue: string) {
        console.log('update');
        this.inputElement.value = newValue;
        this.setAttribute('value', newValue);
    }

    private syncAttributes() {
        Array.from(this.attributes).forEach(attr => {
            this.inputElement.setAttribute(attr.name, attr.value);
        });
    }

    private syncSingleAttribute(attrName: string | null) {
        if (!attrName) return;

        const newValue = this.getAttribute(attrName);

        if (attrName === 'value') {
            console.log('mute');
            this.inputElement.value = newValue!;
            this.dispatchEvent(new CustomEvent('update', { detail: newValue }));
            return;
        }

        if (newValue !== null) {
            this.inputElement.setAttribute(attrName, newValue);
        } else {
            this.inputElement.removeAttribute(attrName);
        }
    }
}

customElements.define('base-input', BaseInput);
