/**
 * @typedef {Object} LocaleMessages
 * @property {(label?: string) => string} required
 * @property {(label?: string) => string} pattern
 * @property {(label?: string, min?: number) => string} minlength
 * @property {(label?: string, max?: number) => string} maxlength
* @property {(label?: string, min?: number) => string} min
 * @property {(label?: string, max?: number) => string} max
 * @property {(label?: string, min?: number, max?: number) => string} range
* @property {string} clearButtonAriaLabel
 */

/**
 * Registry of all known locales and their message shapes.
 * Consumers can extend this via module augmentation in their own `.d.ts` file:
 *
 * ```ts
 * // types.d.ts
 * declare module 'typed-ui/modules/locale' {
 *   interface LocaleRegistry {
 *     de: import('typed-ui/modules/locale').LocaleMessages;
 *   }
 * }
 * ```
 * @typedef {{ tr: LocaleMessages, en: LocaleMessages }} LocaleRegistry
 */

/**
 * Union of all registered locale keys. Derived from {@link LocaleRegistry}.
 * @typedef {keyof LocaleRegistry} LocaleKey
 */

/** @type {Record<LocaleKey, LocaleMessages>} */
const defaultMessages = {
    tr: {
        required: label => `${label || 'Bu alan'} gereklidir.`,
        pattern: label => `Lütfen geçerli bir ${label || 'değer'} giriniz.`,
        minlength: (label, min) => `${label || 'Bu alan'} en az ${min} karakter olmalıdır.`,
        maxlength: (label, max) => `${label || 'Bu alan'} en fazla ${max} karakter olabilir.`,
min: (label, min) => `${label || 'Bu alan'} ${min} değerinden az olamaz.`,
        max: (label, max) => `${label || 'Bu alan'} ${max} değerinden fazla olamaz.`,
        range: (label, min, max) => `${label || 'Bu alan'} ${min} ile ${max} arasında olmalıdır.`,
clearButtonAriaLabel: 'Değeri temizle',
    },
    en: {
        required: label => `${label || 'This field'} is required.`,
        pattern: label => `Please enter a valid ${label || 'value'}.`,
        minlength: (label, min) => `${label || 'This field'} must be at least ${min} characters.`,
        maxlength: (label, max) => `${label || 'This field'} must be at most ${max} characters.`,
min: (label, min) => `${label || 'This field'} cannot be less than ${min}.`,
        max: (label, max) => `${label || 'This field'} cannot be greater than ${max}.`,
        range: (label, min, max) => `${label || 'This field'} must be between ${min} and ${max}.`,
clearButtonAriaLabel: 'Clear value',
    },
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
 * Retrieves a formatted validation message for the given key in the active locale.
 * Falls back to 'tr' if the active locale or the specific key is missing.
 *
 * @param {keyof LocaleMessages} key - The message key.
 * @param {...any} args - Arguments forwarded to the message factory function.
 * @returns {string}
 */
function getMessage(key, ...args) {
    const factory = getMessages()[key];
    if (!factory) return '';
    if (typeof factory === 'function') return factory(...args);
    return factory;
}

export { getLocale, setLocale, configure, registerLocale, getMessages, getMessage };
