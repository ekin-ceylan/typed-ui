import PropValidatorMixin from '../mixins/prop-validator-mixin.js';
import UniqueIdGeneratorMixin from '../mixins/unique-id-generator-mixin.js';
import { getMessages } from '../modules/locale.js';
import { lightMixins } from '../modules/mixin-utils.js';
import { isEmpty } from '../modules/utilities.js';

/**
 * Base class for form control components providing common functionality for form inputs and selects.
 *
 * IMPLEMENTATION REQUIREMENTS:
 * * `get inputElement()`: MUST be overridden to return the native DOM element (e.g., using `@query('input')`).
 * * `handleFirstInteraction()`: MUST be overridden to define how the component detects user interaction and dispatches the 'first-interaction' event.
 * * `label`: The `label` property is inherently required by this base class and must be provided by the consumer.
 * @abstract Not intended to be used directly in component definitions (for example, with customElements.define). Extend this class to create concrete components.
 * @mixes PropValidatorMixin - Provides required and warning field validation logic. Components can specify required fields that must be set and warning fields that trigger console warnings when empty.
 * @mixes UniqueIdGeneratorMixin - Provides a unique ID generator for creating stable, minify-safe component identifiers.
 */
export default class FormControlBase extends lightMixins(PropValidatorMixin, UniqueIdGeneratorMixin) {
    // #region STATICS, FIELDS, GETTERS

    /** @type {import('lit').PropertyDeclarations} */
    static get properties() {
        return {
            ...super.properties,
            name: { type: String },
            value: { type: String },
            label: { type: String },
            ariaInvalid: { type: String, attribute: false, reflect: false },
            required: { type: Boolean, reflect: true },
            disabled: { type: Boolean, reflect: true },
            readonly: { type: Boolean, reflect: true },
        };
    }

    #interacted = false;
    /** @type {string | null } */
    validationMessage = '';

    /**
     * Represents the native form control element (e.g., input, select) within the component.
     *
     * MUST be overridden by subclasses to provide a reference to the native form control element (e.g., input, select).
     * This is required for value synchronization and native form validation to work correctly.
     * Recommendation: Use Lit's `@query` decorator (e.g., `@query('input') get inputElement;`)
     * @abstract
     * @returns {HTMLInputElement | HTMLSelectElement | null}
     */
    get inputElement() {
        throw new Error(`[${this.componentName}]: 'inputElement' getter MUST be overridden. Subclasses must provide a reference to the native DOM element.`);
    }

    /**
     * Indicates whether the input has been interacted with by the user.
     * This can be used to determine when to show validation messages (e.g., only after the user has interacted with the input).
     * @returns {boolean}
     */
    get interacted() {
        return this.#interacted;
    }

    /**
     * Convenience boolean API for generic "invalid" state. `true` maps to `ariaInvalid='true'`, `false` clears `ariaInvalid`.
     *
     * Note: grammar/spelling should be set via ariaInvalid directly.
     * @returns {boolean}
     */
    get invalid() {
        return this.ariaInvalid === 'true' || this.ariaInvalid === 'grammar' || this.ariaInvalid === 'spelling';
    }
    set invalid(value) {
        this.ariaInvalid = value ? 'true' : undefined;
    }

    /**
     * Returns the unique ID for the form control element.
     * @returns {string}
     */
    get fieldId() {
        return `${this.componentName}-${this.uniqueId}`;
    }
    /**
     * Returns the unique ID for the label element.
     * @returns {string}
     */
    get labelId() {
        return `${this.componentName}-label-${this.uniqueId}`;
    }
    /**
     * Returns the unique ID for the error message element.
     * @returns {string | null}
     */
    get errorId() {
        return this.validationMessage ? `${this.componentName}-error-${this.uniqueId}` : null;
    }

    /**
     * Validation message to show when a required field is empty. By default, it uses a localized message based on the component's label.
     * Subclasses can override this getter to provide a custom message.
     * @returns {string}
     */
    get requiredValidationMessage() {
        return getMessages(this.lang).required(this.label);
    }

    get requiredFields() {
        return [...super.requiredFields, 'label'];
    }

    // #endregion STATICS, FIELDS, GETTERS

    // #region LIFECYCLE HOOKS
    constructor() {
        super();

        /** @type {string} */
        this.name = '';
        /** @type {string} */
        this.label = '';
        /** @type {string} */
        this.value = '';
        /**
         * ARIA invalid state passed to the underlying control.
         *
         * Use `'true'` for generic validation errors, or `'grammar'`/`'spelling'` for language-specific issues. Keep undefined to omit the `aria-invalid` attribute.
         * @type {'true' | 'grammar' | 'spelling' | undefined}
         */
        this.ariaInvalid = undefined;
        /** @type {boolean} */
        this.required = false;
        /** @type {boolean} */
        this.disabled = false;
        /** @type {boolean} */
        this.readonly = false;
    }

    /** @protected @override */
    firstUpdated(changedProperties) {
        super.firstUpdated(changedProperties);
        this.addEventListener('first-interaction', () => (this.#interacted = true));
        this.handleFirstInteraction();
    }

    updated(changed) {
        super.updated(changed);

        if (changed.has('value') && this.inputElement?.value !== this.value) {
            this.inputElement.value = /** @type {string} */ (this.value);
            this.dispatchCustomEvent('update');
        }
    }

    // #endregion LIFECYCLE HOOKS

    // #region INTERNAL HOOKS

    /**
     * Sets up a mechanism to detect the user's first interaction with the component and dispatches a 'first-interaction' custom event.
     *
     * ```js
     * this.inputElement?.addEventListener('input', _e => this.dispatchCustomEvent('first-interaction'), { once: true });
     * ```
     *
     * Subclasses MUST override this method to provide the logic for detecting the first user interaction with the component.
     * This is necessary for proper validation behavior, as the component should only show validation messages after the user has interacted with it.
     * @abstract
     * @protected
     */
    handleFirstInteraction() {
        throw new Error(`[${this.componentName}]: 'handleFirstInteraction' function MUST be overridden. Subclasses must provide the logic to detect the first user interaction.`);
    }

    // #endregion INTERNAL HOOKS

    // #region PUBLIC API

    /** Clears the input value. */
    clear() {
        this.value = '';
    }

    /** Clears the validation message and resets the `invalid` state. */
    clearValidation() {
        this.validationMessage = '';
        this.invalid = false;
        this.inputElement?.setCustomValidity(this.validationMessage);
    }

    /** Resets the input value to its initial state, clears any validation messages, and resets the `interacted` state. */
    async reset() {
        const valueAttr = this.getAttribute('value');
        this.value = valueAttr || '';
        await this.updateComplete;
        this.clearValidation();
        this.#interacted = false;
        this.handleFirstInteraction();
    }

    /**
     * Validates the input value based on the `required` property and whether the user has interacted with the component.
     * If `force` is `true`, validation will run regardless of `interacted` state.
     * Updates the `validationMessage` and `invalid` state based on the validation result, and dispatches a `validate` custom event with the validation message.
     * @param {boolean} [force=false] If `true`, validation will run regardless of whether the user has interacted with the component.
     * @returns {boolean}
     */
    validate(force = false) {
        if (!this.required) return true; // zorunlu değilse dön
        if (!force && !this.interacted) return true;

        // this.inputElement.setCustomValidity('');
        this.validationMessage = isEmpty(this.value) ? this.requiredValidationMessage : '';
        this.invalid = !!this.validationMessage;
        this.inputElement.setCustomValidity(this.validationMessage || '');
        // this.requestUpdate('validationMessage');
        this.dispatchCustomEvent('validate', null, { validationMessage: this.validationMessage });

        return !this.validationMessage;
    }

    // #endregion PUBLIC API
}
