class CustomButton extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = `<button>Click Me</button>`;
    }
}

customElements.define('custom-button', CustomButton);
