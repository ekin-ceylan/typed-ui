import { html } from 'lit';
import SlotCollectorMixin from '../mixins/slot-collector-mixin.js';
import LightComponentBase from '../core/light-component-base.js';
import { hideBodyScroll, showBodyScroll } from '../modules/scroll-lock-helper.js';
import { ifDefined } from '../modules/utilities.js';

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
        closeButtonClass: { type: String, attribute: 'close-button-class' },
        backdropClose: { type: Boolean, attribute: 'backdrop-close' },
        escClose: { type: Boolean, attribute: 'esc-close' },
    };

    // #region FIELDS

    #dialog = null;
    #timeout = undefined;

    // #endregion FIELDS

    constructor() {
        super();

        /** @type {boolean} */
        this.open = false;

        /** @type {boolean} */
        this.backdropClose = false;

        /** @type {boolean} Close when pressing the Escape key. */
        this.escClose = false;

        /** @type {string} CSS class for the close button. */
        this.closeButtonClass = '';
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
            hideBodyScroll();
            this.#dialog?.setAttribute('data-active', '');
        }, 20);
    }
    /** Hide with small delay for CSS transitions. */
    #hide() {
        this.#dialog?.removeAttribute('data-active');
        showBodyScroll();
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
        return html`<dialog role="dialog" aria-modal="true" tabindex="-1">
            <button type="button" class=${ifDefined(this.closeButtonClass)} @click=${this.hide} data-role="close" aria-label="Close">
                <slot name="close-button-icon">&times;</slot>
            </button>
            <slot></slot>
        </dialog>`;
    }
}

// TODO: aria-hidden="true" focusable="false" ekle btn slota
