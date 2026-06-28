/**
 * @typedef {import('../base/text-control-base.js').default} TextControlBase
 */

import { html, nothing } from 'lit';
import { isEmpty } from '../modules/utilities.js';

/**
 * @template T
 * @typedef {import('./types').Constructor<T>} Constructor
 */

/**
 * @typedef {import('./types').GhostPlaceholder} GhostPlaceholder
 */

/**
 * Mixin that provides a ghost placeholder functionality for text input components.
 * - When the input value is being edited, a ghost placeholder is displayed to indicate the expected format or content.
 * - The ghost placeholder can be set via the `ghostPlaceholder` property. If not set, it defaults to the value of the `placeholder` property.
 * - The ghost placeholder is rendered as an underlay behind the actual input value, providing a visual cue to users.
 * - **Usage:** Extend your text input component with this mixin to enable ghost placeholder functionality.
 * - **Caution:** It overrides the `renderAdornment` method to render the ghost placeholder. Ensure that your component's `renderAdornment` method is available when using this mixin.
 * - **Constraint:** Can only be applied to classes extending `TextControlBase`.
 *
 * @template {Constructor<TextControlBase>} TBase
 * @param {TBase} Base - The base class to extend
 * @category mixins
 * @returns {TBase & Constructor<GhostPlaceholder>}
 */
export default function GhostPlaceholderMixin(Base) {
    return class GhostPlaceholder extends Base {
        #ghostMask1 = '';
        #ghostMask2 = '';
        #ghostPlaceholder = '';

        get ghostPlaceholder() {
            return this.#ghostPlaceholder || this.placeholder;
        }

        set ghostPlaceholder(value) {
            this.#ghostPlaceholder = value;
        }

        willUpdate(changed) {
            super.willUpdate(changed);

            if (changed.has('value')) {
                const len = this.maskedValue.length;
                this.#ghostMask1 = this.maskedValue;
                this.#ghostMask2 = this.ghostPlaceholder.slice(len);
            }
        }

        /** @inheritDoc */
        renderAdornment() {
            if (isEmpty(this.#ghostMask1) && isEmpty(this.#ghostMask2)) return nothing;

            // prettier-ignore
            return html`<div aria-hidden="true" data-role="underlay">
                <pre>${this.#ghostMask1}</pre><pre>${this.#ghostMask2}</pre>
            </div> `;
        }
    };
}
