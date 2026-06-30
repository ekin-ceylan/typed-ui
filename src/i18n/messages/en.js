/**
 * English locale messages
 *
 * Contains all validation error messages and UI text in English.
 * Follows the {@link LocaleMessages} interface specification.
 *
 * @type {import('../types.ts').LocaleMessages}
 */
export const enMessages = {
    required: label => `${label || 'This field'} is required.`,
    pattern: label => `Please enter a valid ${label || 'value'}.`,
    minlength: (label, min) => `${label || 'This field'} must be at least ${min} characters.`,
    maxlength: (label, max) => `${label || 'This field'} must be at most ${max} characters.`,
    min: (label, min) => `${label || 'This field'} cannot be less than ${min}.`,
    max: (label, max) => `${label || 'This field'} cannot be greater than ${max}.`,
    range: (label, min, max) => `${label || 'This field'} must be between ${min} and ${max}.`,
    clearButtonAriaLabel: 'Clear value',
    passwordStrengthValidationMessage: () => 'Please choose a stronger password.',
    passwordStrengthLabel: (strength = 0) => ['No password', 'Very weak password', 'Weak password', 'Medium password', 'Strong password'][strength] || 'No password',
    passwordStrengthAriaLabel: 'Password strength',
};
