/** Represents the base class for all models. */
export default class BaseModel {
    /**
     * Initializes a new instance of the model with the provided data.
     * @template {BaseModel} T
     * @this {new () => T}
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

        return obj;
    }
}
