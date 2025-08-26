import { LitElement, html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

export class UrlLink extends LitElement {
    static get properties() {
        return {
            href: { type: String, attribute: 'href', reflect: true },
            target: { type: String, attribute: 'target', reflect: true },
            ariaLabel: { type: String, attribute: 'aria-label', reflect: true },
        };
    }

    #replaceSlot() {
        const anchor = this.renderRoot.querySelector('a');
        const fragment = document.createDocumentFragment();

        for (let i = 0; i < this.childNodes.length; ) {
            const child = this.childNodes[i];

            if (child === anchor || child.nodeType === Node.COMMENT_NODE) {
                i++;
                continue;
            }

            if (child.nodeType === Node.TEXT_NODE) {
                const text = child.textContent?.trim();

                if (text !== '') {
                    const textNode = document.createTextNode(text);
                    fragment.appendChild(textNode);
                }
            } else {
                fragment.appendChild(child.cloneNode(true));
            }

            child.remove();
        }

        anchor.innerHTML = '';
        anchor.appendChild(fragment);
    }

    firstUpdated() {
        this.#replaceSlot();
    }

    render() {
        const rel = this.target === '_blank' ? 'noopener noreferrer' : '';
        return html` <a href=${this.href} target=${this.target} rel=${rel} aria-label=${ifDefined(this.ariaLabel)}> </a> `;
    }

    createRenderRoot() {
        return this; // Shadow DOM'u kapat
    }

    constructor() {
        super();
        this.href = '#';
        this.target = '_self';
        this.ariaLabel = null;
    }
}

customElements.define('url-link', UrlLink);
