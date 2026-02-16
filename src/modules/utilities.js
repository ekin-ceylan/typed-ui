import { nothing } from 'lit';

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

/**
 * Cleans up CSS style text by removing unnecessary whitespace and formatting.
 * Removes newlines, leading/trailing spaces, and normalizes spacing around CSS syntax characters.
 *
 * @param {string} styleText - The CSS style text to clean up.
 * @returns {string} The cleaned and minified CSS style text.
 */
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
 * @returns {T|typeof nothing} The original value or `undefined`.
 */
export function ifDefined(val) {
    return val === null || val === undefined ? nothing : val;
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

/**
 * Checks if a string is empty, undefined, or null.
 * @param {string|null|undefined} str - The string to check.
 * @returns {boolean} True if the string is empty, undefined, or null; otherwise false.
 */
export function isEmpty(str) {
    return str === '' || str === undefined || str === null;
}

/**
 * Defines a custom element if it is not already defined.
 * @param {string} name The name of the custom element.
 * @param {CustomElementConstructor} constructor The constructor of the custom element.
 */
export function defineComponent(name, constructor) {
    if (!customElements.get(name)) {
        customElements.define(name, constructor);
    }
}

/**
 * Validates a Turkish Identification Number (TC Kimlik No).
 * The TC Kimlik No must be 11 digits long, cannot start with 0, and must satisfy specific checksum rules.
 * @param {string|number} value - The TC Kimlik No to validate.
 * @returns {boolean} True if the TC Kimlik No is valid, otherwise false.
 */
export function checkTcNo(value) {
    const valueStr = value.toString();
    const valueArr = Array.from(valueStr.split(''), x => Number(x));

    // sıfırla başlayamaz
    if (valueArr[0] === 0) {
        return false;
    }

    // 11 basamaklı olmalı, rakamlardan oluşmalı
    if (!/^\d{11}$/.test(valueStr)) {
        return false;
    }

    const totalOdd = valueArr.slice(0, 9).reduce((acc, item, i) => (i % 2 === 0 ? acc + item : acc), 0); // 1, 3, 5, 7 ve 9. rakamın toplamı
    const totalEven = valueArr.slice(1, 8).reduce((acc, item, i) => (i % 2 === 0 ? acc + item : acc), 0); // 2, 4, 6 ve 8. rakamın toplamı

    // 1, 3, 5, 7 ve 9. rakamın toplamının 7 katı ile 2, 4, 6 ve 8. rakamın toplamının 9 katının toplamının birler basamağı 10. rakamı vermeli
    if ((totalOdd * 7 + totalEven * 9) % 10 !== valueArr[9]) {
        return false;
    }

    // 1, 3, 5, 7 ve 9. rakamın toplamının 8 katının birler basamağı 11. rakamı vermektedir.
    return (totalOdd * 8) % 10 === valueArr[10];
}
