/**
 * Constructor shape used by static hooks in `init`.
 * @template {BaseModel} T
 * @typedef {{
 *   new (): T,
 *   postInit(obj: T, data?: object): T
 * }} BaseModelCtor
 */

/** Represents the base class for all models. */
export default class BaseModel {
    /**
     * A hook for post-initialization logic. Subclasses can override this method to perform additional processing after the instance has been initialized with data.
     * @template {BaseModel} T
     * @this {BaseModelCtor<T>}
     * @param {T} obj
     * @param {object} [data={}] - The data to initialize the model with.
     * @returns {T} The processed `obj`.
     */
    static postInit(obj, data) {
        // Placeholder for any post-initialization logic that subclasses might need.

        return obj;
    }

    /**
     * Initializes a new instance of the model with the provided data.
     * @template {BaseModel} T
     * @this {BaseModelCtor<T>}
     * @param {object} [data={}] - The data to initialize the model with.
     * @returns {T} The initialized model instance.
     */
    static init(data = {}) {
        /** @type {T} */
        const obj = new this();

        for (let key in data) {
            if (key in obj) {
                obj[key] = data[key];
            }
        }

        return /** @type {T} */ (this.postInit(obj, data));
    }
}
