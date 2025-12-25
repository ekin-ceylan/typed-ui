import { html } from 'lit';
import SlotCollectorMixin from '../mixins/slot-collector-mixin.js';
import LightComponentBase from '../core/light-component-base.js';

/**
 * Modal dialog web component built with Lit.
 *
 * @tag modal-dialog
 * @summary Accessible modal dialog with optional backdrop & ESC close.
 * @slot default - Dialog content.
 */
export default class ModalDialog extends SlotCollectorMixin(LightComponentBase) {
    /**
     * Component reactive properties
     * @type {import('lit').PropertyDeclarations}
     */
    static properties = {
        open: { type: Boolean },
        backdropClose: { type: Boolean, attribute: 'backdrop-close' },
        escClose: { type: Boolean, attribute: 'esc-close' },
    };

    #dialog = null;
    #timeout = undefined;

    constructor() {
        super();

        /** @public @type {boolean} */
        this.open = false;

        /** @protected @type {NodeListOf<Element> | null} */
        this.backdropClose = false;

        /** @public @type {boolean} Close when pressing the Escape key. */
        this.escClose = false;
    }

    /** @override @protected */
    firstUpdated() {
        this.#dialog = this.renderRoot.querySelector('dialog');

        this.#dialog?.addEventListener('cancel', e => {
            e.preventDefault(); // prevent browser to close modal immediately

            if (this.escClose) this.hide();
        });

        this.#dialog?.addEventListener('click', e => {
            if (!this.backdropClose) return; // if no backdropClose attr
            if (!this.#clickedOnBackdrop(e)) return; //  if clicked inside dialog
            e.preventDefault();
            this.hide();
        });
    }

    /** @override @protected */
    updated() {
        if (this.#dialog) {
            this.open ? this.#show() : this.#hide();
        }
    }

    /** Open the dialog programmatically. */
    show() {
        this.open = true;
    }
    /** Close the dialog programmatically. */
    hide() {
        this.open = false;
    }

    /** Show with small delay for CSS transitions. */
    #show() {
        this.#dialog?.showModal();
        clearTimeout(this.#timeout);

        this.#timeout = setTimeout(() => {
            document.body.classList.add('overflow-hidden');
            this.#dialog?.classList.add('active');
        }, 20);
    }
    /** Hide with small delay for CSS transitions. */
    #hide() {
        this.#dialog?.classList.remove('active');
        document.body.classList.remove('overflow-hidden');
        clearTimeout(this.#timeout);

        this.#timeout = setTimeout(() => {
            this.#dialog?.close();
        }, 300);
    }

    /**
     * Returns true if click was on the backdrop area (outside dialog rect).
     * @param {MouseEvent} e
     */
    #clickedOnBackdrop = e => {
        const r = this.#dialog.getBoundingClientRect();
        const [x, y] = [e.clientX, e.clientY];

        return x < r.left || x > r.right || y < r.top || y > r.bottom;
    };

    /** @override @protected @returns {import('lit').TemplateResult} */
    render() {
        return html` <dialog role="dialog" aria-modal="true" tabindex="-1">
            <button type="button" @click=${this.hide} class="btn-close" aria-label="Close">
                <svg fill="currentColor" viewBox="0 0 460.775 460.775" aria-hidden="true" focusable="false">
                    <path
                        d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55  c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55  c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505  c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55  l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719  c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"
                    />
                </svg>
            </button>
            <slot></slot>
        </dialog>`;
    }
}

// customElements.define('modal-dialog', ModalDialog);
