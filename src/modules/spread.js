import { Directive, directive, PartType } from 'lit/directive.js';
import { toKebabCase } from './utilities.js';

/**
 * Lit directive that spreads a plain `{ name: value }` object as attributes
 * onto an element. Attributes set in a previous render that are no longer
 * present in the new object are removed.
 *
 * Attribute names are normalized to kebab-case before being applied:
 * `camelCase` -> `camel-case`, `PascalCase` -> `pascal-case`.
 *
 * Designed to be used with `LightComponentBase.getScopedAttrs(prefix)` but
 * accepts any object whose values are strings or `null`/`undefined`.
 *
 * @example
 * // In a render() method:
 * html`<img ${spread(this.getScopedAttrs('img'))} src=${this.src} />`
 */
class SpreadDirective extends Directive {
    /** @type {Set<string>} Names set during the previous render pass. */
    #previousNames = new Set();

    constructor(partInfo) {
        super(partInfo);

        if (partInfo.type !== PartType.ELEMENT) {
            throw new Error('`spread` directive must be used on an element binding.');
        }
    }

    /**
     * @param {import('lit').ElementPart} part
     * @param {[Record<string, string | null | undefined>, string]} props
     */
    update(part, [attrs, prefix = '']) {
        const element = part.element;
        const currentNames = new Set();

        for (const [name, value] of Object.entries(attrs)) {
            const fullName = `${prefix}${toKebabCase(name)}`.trim();
            currentNames.add(fullName);

            if (value === null || value === undefined) {
                element.removeAttribute(fullName);
            } else {
                element.setAttribute(fullName, String(value));
            }
        }

        // Remove attrs that were set previously but are gone now.
        for (const name of this.#previousNames) {
            if (!currentNames.has(name)) {
                element.removeAttribute(name);
            }
        }

        this.#previousNames = currentNames;
    }

    /** render() is never called for element parts but must be defined. */
    render(_attrs, _prefix) {
        return undefined;
    }
}

export const spread = directive(SpreadDirective);
