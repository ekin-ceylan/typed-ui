/**
 * @template T
 * @typedef {import('./types').Constructor<T>} Constructor
 */

/**
 * @typedef {import('./types').UniqueIdGenerator} UniqueIdGenerator
 */

/**
 * Unique ID generator mixin that provides functionality to generate and manage unique IDs for web components. It generates a unique ID for each instance of the component, which can be used for associating labels, error messages, and other elements in the DOM.
 * - Generates a unique ID for each component instance using an internal counter and converts it to a hexadecimal string.
 * - Provides a `uniqueId` getter to access the generated ID and a `generateUniqueId()` method to create new IDs if needed.
 * @template {Constructor<Object>} TBase
 * @param {TBase} Base - The base class to extend
 * @category mixins
 * @returns {TBase & Constructor<UniqueIdGenerator>}
 */
export default function UniqueIdGeneratorMixin(Base) {
    return class UniqueIdGenerator extends Base {
        #uniqueId = null; // Bileşen için benzersiz ID

        /**
         * Gets the unique ID of the component.
         * @returns {string}
         */
        get uniqueId() {
            return this.#uniqueId;
        }

        constructor(...args) {
            super(...args);
            this.#uniqueId = generateId(); // Bileşen için benzersiz ID oluştur
        }

        /**
         * Generates a unique ID string by incrementing an internal counter and converting it to a hexadecimal string. The resulting ID is padded with leading zeros to ensure it is at least 4 characters long.
         * @returns {string}
         */
        generateUniqueId() {
            return generateId();
        }
    };
}

let idCounter = 0;

/**
 * Generates a unique ID string by incrementing an internal counter and converting it to a hexadecimal string. The resulting ID is padded with leading zeros to ensure it is at least 4 characters long.
 * @returns {string}
 */
function generateId() {
    idCounter++;
    return idCounter.toString(16).padStart(4, '0');
}
