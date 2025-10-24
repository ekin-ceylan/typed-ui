import { LitElement, html, css } from 'lit';
import { injectStyles } from '../modules/utilities.js';

export default class ModalDialog extends LitElement {
    #styleId = 'modal-dialog-styles';
    #dialog = null;
    #timeout = null;

    static properties = {
        open: { type: Boolean },
        slots: { type: Object, attribute: false },
        backdropClose: { type: Boolean, attribute: 'backdrop-close' },
        escClose: { type: Boolean, attribute: 'esc-close' },
    };

    static styles = css`
        modal-dialog {
            --modal-close-size: 16px;
            --modal-close-location: 10px;
            --modal-close-bg-hover: rgba(0, 0, 0, 0.05);
            --modal-close-bg-active: rgba(0, 0, 0, 0.1);
            --modal-close-color: #6c6c6c;
            --modal-close-hover: #3e3e3e;
            --modal-close-active: #222;

            --modal-backdrop-color: black;
        }

        modal-dialog[data-not-ready] * {
            display: none;
            pointer-events: none;
        }

        modal-dialog > dialog {
            opacity: 0;
            transform: translateY(100vh) scale(0, 0);
            transition: all 0.3s ease;
        }

        modal-dialog > dialog[open].active {
            opacity: 1;
            transform: translateY(0) scale(1, 1);
        }

        modal-dialog > dialog::backdrop {
            opacity: 0;
            background: var(--modal-backdrop-color);
            transition: all 0.3s ease;
        }

        modal-dialog > dialog.active::backdrop {
            opacity: 0.5;
        }

        modal-dialog > dialog > .btn-close {
            position: absolute;
            top: var(--modal-close-location);
            right: var(--modal-close-location);
            width: var(--modal-close-size);
            height: var(--modal-close-size);
            color: var(--modal-close-color);
            transition: all 0.2s;
            background: none;
            border: none;
            border-radius: calc(var(--modal-close-size) / 8);
            cursor: pointer;
            padding: 2px;
        }

        modal-dialog > dialog > .btn-close:hover {
            background: var(--modal-close-bg-hover);
            color: var(--modal-close-hover);
        }

        modal-dialog > dialog > .btn-close:active {
            background: var(--modal-close-bg-active);
            color: var(--modal-close-active);
            transform: scale(0.85);
        }

        modal-dialog > dialog > .btn-close > svg {
            color: inherit;
            fill: currentColor;
        }
    `;

    show() {
        this.open = true;
    }
    hide() {
        this.open = false;
    }

    #show() {
        this.#dialog?.showModal();
        clearTimeout(this.#timeout);

        this.#timeout = setTimeout(() => {
            document.body.classList.add('overflow-hidden');
            this.#dialog?.classList.add('active');
        }, 20);
    }

    #hide() {
        this.#dialog?.classList.remove('active');
        document.body.classList.remove('overflow-hidden');
        clearTimeout(this.#timeout);

        this.#timeout = setTimeout(() => {
            this.#dialog?.close();
        }, 300);
    }

    #clickedOnBackdrop = e => {
        const r = this.#dialog.getBoundingClientRect();
        const [x, y] = [e.clientX, e.clientY];

        return x < r.left || x > r.right || y < r.top || y > r.bottom;
    };

    constructor() {
        super();
        this.toggleAttribute('data-not-ready', true);
        injectStyles(this.#styleId, this.constructor.styles.cssText);
        this.open = false;
    }

    connectedCallback() {
        super.connectedCallback();
        this.slots = this.renderRoot.querySelectorAll(':scope > *:not(dialog)');
    }

    firstUpdated() {
        this.#dialog = this.renderRoot.querySelector('dialog');
        this.toggleAttribute('data-not-ready', false);

        this.#dialog.addEventListener('cancel', e => {
            e.preventDefault(); // prevent browser to close modal immediately

            if (this.escClose) this.hide();
        });

        this.#dialog.addEventListener('click', e => {
            if (!this.backdropClose) return; // if no backdropClose attr
            if (!this.#clickedOnBackdrop(e)) return; //  if clicked inside dialog
            e.preventDefault();
            this.hide();
        });
    }

    updated() {
        if (this.#dialog) {
            this.open ? this.#show() : this.#hide();
        }
    }

    createRenderRoot() {
        return this;
    }

    render() {
        return html` <dialog role="dialog" aria-modal="true" tabindex="-1">
            <button type="button" @click=${this.hide} class="btn-close" aria-label="Close">
                <svg fill="currentColor" viewBox="0 0 460.775 460.775" aria-hidden="true" focusable="false">
                    <path
                        d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55  c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55  c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505  c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55  l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719  c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"
                    />
                </svg>
            </button>
            ${this.slots}
        </dialog>`;
    }
}

customElements.define('modal-dialog', ModalDialog);
