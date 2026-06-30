/**
 * @typedef {import('./types.ts').LocaleMessages} LocaleMessages
 * @typedef {import('./types.ts').LocaleRegistry} LocaleRegistry
 * @typedef {import('./types.ts').LocaleKey} LocaleKey
 */

import { trMessages } from './messages/tr.js';
import { enMessages } from './messages/en.js';

/** @type {Record<LocaleKey, LocaleMessages>} */
const defaultMessages = {
    tr: trMessages,
    en: enMessages,
};

/** @type {Record<LocaleKey, LocaleMessages>} */
let _messages = { ...defaultMessages };

/** @type {LocaleKey} */
const DEFAULT_LOCALE = 'tr';
/** @type {LocaleKey} */
let _fallback = getNavigatorLang() || DEFAULT_LOCALE;
/** @type {LocaleKey} */
let _locale = _fallback;

/**
 * Returns the active locale identifier.
 * @returns {LocaleKey}
 */
function getLocale() {
    return _locale;
}

/**
 * @param {unknown} locale
 * @returns {locale is LocaleKey}
 */
function isLocaleKey(locale) {
    return typeof locale === 'string' && locale in _messages;
}

/**
 * Reads and normalizes browser locale preference.
 * Prioritizes `navigator.languages[0]`, then `navigator.language`.
 * Values like `tr-TR` or `en_US` are normalized to `tr` / `en`.
 * Returns `null` if browser locale is unavailable or unsupported.
 *
 * @returns {LocaleKey | null}
 */
function getNavigatorLang() {
    if (typeof navigator === 'undefined') return null;

    const raw = navigator.languages?.[0] || navigator.language;
    if (!raw || typeof raw !== 'string') return null;

    const normalized = raw.toLowerCase().split(/[-_]/)[0];
    return isLocaleKey(normalized) ? normalized : null;
}

/**
 * Sets the active locale.
 * @param {LocaleKey} locale - A locale identifier (e.g. 'tr', 'en').
 */
function setLocale(locale) {
    if (!(typeof locale === 'string' && locale.trim())) return;
    _locale = locale;
    if (typeof document === 'undefined') return;
    document.dispatchEvent(new CustomEvent('locale-change', { detail: { locale } }));
}

/**
 * Registers a new locale with a full message map.
 * If the locale already exists, it is replaced.
 *
 * @param {LocaleKey} locale
 * @param {LocaleMessages} messages
 */
function registerLocale(locale, messages) {
    if (!locale || typeof locale !== 'string') return;
    if (!messages || typeof messages !== 'object') return;

    _messages[locale] = messages;
}

/**
 * Configures the locale and/or extends/overrides the message catalog.
 * Partial message objects are deeply merged per locale — only the keys you
 * provide are overridden; the rest fall back to the built-in defaults.
 *
 * @param {Object} options
 * @param {LocaleKey} [options.locale] - Locale to activate.
 * @param {Partial<Record<LocaleKey, Partial<LocaleMessages>>>} [options.messages] - Per-locale message overrides.
 *
 * @example
 * configure({ locale: 'en' });
 *
 * @example
 * configure({
 *     locale: 'en',
 *     messages: {
 *         en: { required: (label) => `${label} cannot be empty.` }
 *     }
 * });
 */
function configure({ locale, messages } = {}) {
    if (isLocaleKey(locale)) setLocale(locale);

    if (messages) {
        for (const [lang, overrides] of Object.entries(messages)) {
            if (isLocaleKey(lang) && overrides) {
                _messages[lang] = { ..._messages[lang], ...overrides };
            }
        }
    }
}

/**
 * Returns the message object for a locale.
 * If no locale is provided, active locale is used.
 * Falls back to 'tr' and finally to an empty no-op message object.
 *
 * @param {LocaleKey} [lang]
 * @returns {Readonly<LocaleMessages>}
 */
function getMessages(lang) {
    const currentLocale = isLocaleKey(lang) ? lang : _locale;
    const messages = _messages[currentLocale];

    if (!messages) {
        console.warn(`[Locale] No messages found for locale '${currentLocale}'. Falling back to '${_fallback}'.`);
        return _messages[_fallback];
    }

    return messages;
}

/**
 * Retrieves a formatted message for the given key in the active locale.
 *
 * Handles three message types:
 * - **Validation messages**: Pass optional label and validation-specific args
 * - **Simple strings**: Returns as-is without calling
 * - **Complex messages**: Pass any required parameters (e.g., strength level)
 *
 * Falls back to 'tr' locale if the active locale or the specific key is missing.
 *
 * @param {keyof LocaleMessages} key - The message key to retrieve
 * @param {...any} args - Arguments forwarded to the message factory function.
 *   - For validation: `(label?, ...validationArgs?)` e.g., `getMessage('minlength', 'Password', 8)`
 *   - For complex: Validation-specific params e.g., `getMessage('passwordStrengthLabel', 2)`
 *   - For simple strings: No args (returns the string as-is)
 *
 * @returns {string} The formatted message in the active locale
 *
 * @example
 * // Validation message without label (uses default)
 * getMessage('required')
 *
 * @example
 * // Validation message with label
 * getMessage('required', 'Email')
 *
 * @example
 * // Validation message with multiple args
 * getMessage('minlength', 'Password', 8)
 *
 * @example
 * // Complex message with special logic
 * getMessage('passwordStrengthLabel', 3)
 *
 * @example
 * // Simple string (no args)
 * getMessage('clearButtonAriaLabel')
 */
function getMessage(key, ...args) {
    const factory = getMessages()[key];
    if (!factory) return '';
    if (typeof factory === 'function') {
        /** @type {(...params: any[]) => string} */
        const callable = factory;
        return callable(...args);
    }
    return factory;
}

export { getLocale, setLocale, configure, registerLocale, getMessages, getMessage };
