import { getAriaAttributesWithValues } from '../modules/utilities.js';
import BaseModel from './BaseModel.js';

/**
 * Represents a base model for HTML elements, providing common properties and a post-initialization hook to extract ARIA attributes from HTML elements during initialization.
 * This class extends the BaseModel and adds properties for handling hidden state, custom data attributes, and ARIA attributes.
 * It also includes a static postInit method that checks if the initialization data is an HTML element and, if so, extracts its ARIA attributes into the ariaset property.
 * Subclasses can utilize this base model to inherit these common functionalities and ensure consistent handling of HTML-related properties and ARIA attributes across different models.
 * @extends BaseModel
 */
export default class HtmlBaseModel extends BaseModel {
    hidden = false;
    /**
     * Custom data attributes map without `data-` prefix.
     * - Example: `{ testId: "city-option" }`.
     * - Rendered as `data-test-id` only if you also normalize key casing, otherwise it is prefixed directly.
     * @type {Record<string, string | number | boolean | null | undefined>}
     */
    dataset = {};
    /**
     * ARIA attribute map without `aria-` prefix.
     * - Example: `{ label: "City", describedby: "city-help" }`.
     * - Rendered as `aria-label` and `aria-describedby` via `spread(..., "aria-")`
     * @type {Record<string, string | null | undefined>}
     */
    ariaset = {};

    static postInit(obj, data) {
        if (data instanceof HTMLElement) {
            Object.assign(obj['ariaset'], getAriaAttributesWithValues(data));
        }

        return obj;
    }
}
