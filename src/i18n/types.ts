/**
 * Signature for all validation message factories.
 *
 * Ensures consistency across validation messages while maintaining flexibility
 * for optional parameters. All validation messages follow this pattern:
 * - `label` is optional (consumer decides whether to pass it)
 * - Additional arguments vary by validation type (min, max, etc.)
 *
 * @example
 * // Usage is flexible - label can be omitted
 * getMessage('required') // Uses default label
 * getMessage('required', 'Email') // Uses provided label
 * getMessage('minlength', 'Password', 8) // With validation-specific args
 */
export type ValidationMessageFactory = (label?: string, ...args: any[]) => string;

/**
 * All localization messages for a specific locale.
 *
 * Messages are organized into categories:
 * - **Validation messages**: Consistent signature, optional label parameter
 * - **Simple strings**: Static text for UI elements
 * - **Complex messages**: Special logic (e.g., array-based strength levels)
 */
export interface LocaleMessages {
    // ===== Validation Messages (Consistent Signature) =====

    /**
     * Message factory for required field validation.
     * Signature: `(label?: string) => string`
     */
    required: ValidationMessageFactory;

    /**
     * Message factory for pattern/regex validation.
     * Signature: `(label?: string) => string`
     */
    pattern: ValidationMessageFactory;

    /**
     * Message factory for minimum length validation.
     * Signature: `(label?: string, min?: number) => string`
     */
    minlength: ValidationMessageFactory;

    /**
     * Message factory for maximum length validation.
     * Signature: `(label?: string, max?: number) => string`
     */
    maxlength: ValidationMessageFactory;

    /**
     * Message factory for minimum value validation.
     * Signature: `(label?: string, min?: number) => string`
     */
    min: ValidationMessageFactory;

    /**
     * Message factory for maximum value validation.
     * Signature: `(label?: string, max?: number) => string`
     */
    max: ValidationMessageFactory;

    /**
     * Message factory for range validation (both min and max).
     * Signature: `(label?: string, min?: number, max?: number) => string`
     */
    range: ValidationMessageFactory;

    // ===== Simple Strings =====

    /**
     * Aria label for the clear button in input components.
     * Example: "Clear value"
     */
    clearButtonAriaLabel: string;

    /**
     * Aria label for the password strength indicator.
     * Example: "Password strength"
     */
    passwordStrengthAriaLabel: string;

    // ===== Complex Messages with Special Logic =====

    /**
     * Message factory for password strength validation failure.
     * Allows optional label context for more specific messaging.
     * Signature: `(label?: string) => string`
     * Example: "Please choose a stronger password" or "Email password must be stronger"
     */
    passwordStrengthValidationMessage: ValidationMessageFactory;

    /**
     * Label describing the current password strength level.
     * Typically uses an array or mapping indexed by strength level (0-4).
     * Signature: `(strength?: number) => string`
     * Example results: "Weak", "Strong", "Very weak", "Medium"
     */
    passwordStrengthLabel: (strength?: number) => string;
}

/**
 * Registry of all known locales and their message shapes.
 *
 * Consumers can extend this via TypeScript module augmentation:
 *
 * ```typescript
 * // types.d.ts
 * declare module 'typed-ui/i18n/types' {
 *   interface LocaleRegistry {
 *     de: LocaleMessages;
 *     fr: LocaleMessages;
 *   }
 * }
 * ```
 *
 * This allows proper type-checking when registering new locales with {@link registerLocale}.
 */
export interface LocaleRegistry {
    /** Turkish locale */
    tr: LocaleMessages;
    /** English locale */
    en: LocaleMessages;
}

/**
 * Union of all registered locale keys.
 * Derived from the keys of {@link LocaleRegistry}.
 *
 * This ensures type safety when passing locale identifiers to functions like
 * {@link setLocale}, {@link getMessages}, and {@link registerLocale}.
 */
export type LocaleKey = keyof LocaleRegistry;
