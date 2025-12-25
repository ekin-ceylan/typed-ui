export function injectStyles(styleId, styleText) {
    if (!styleId || !styleText || document.getElementById(styleId)) {
        return;
    }

    const clean = cleanupStyles(styleText);
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = clean;
    document.head.appendChild(style);
}

export function cleanupStyles(styleText) {
    return styleText
        .replaceAll(/(^\s+)|\n|(\s+$)/gm, '') // Remove newlines and leading/trailing spaces
        .replaceAll(/\s*;?\s*}\s*/g, '}') // Remove any unnecessary spaces around '}' and the last ';'
        .replaceAll(/\s*{\s*/g, '{') // Remove unnecessary spaces around '{'
        .replaceAll(/\s*:\s*/g, ':') // Remove unnecessary spaces around ':'
        .trim();
}

/**
 * Returns `undefined` if the value is `null` or `undefined`, otherwise returns the value itself.
 *
 * @template T
 * @param {T|null|undefined} val - The value to check.
 * @returns {T|undefined} The original value or `undefined`.
 */
export function ifDefined(val) {
    return val === null || val === undefined ? undefined : val;
}

/**
 * Combines class names conditionally.
 * Accepts any number of arguments, which can be strings or objects.
 * - Strings are always included.
 * - Objects include keys with truthy values.
 *
 * @param {...(string|Object<string, boolean>)} args - Class names as strings or objects.
 * @returns {string} A space-separated string of class names.
 *
 * @example
 * classMap('foo', { bar: true, baz: false }) // "foo bar"
 */
export function classMap(...args) {
    return args
        .flatMap(arg =>
            typeof arg === 'string'
                ? [arg]
                : Object.entries(arg)
                      .filter(([_, val]) => val)
                      .map(([key]) => key)
        )
        .join(' ');
}
