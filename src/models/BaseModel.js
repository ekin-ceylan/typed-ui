/** Represents the base class for all models. */
export default class BaseModel {
    /**
     * Initializes a new instance of the model with the provided data.
     * @param {Object} data - The data to initialize the model with.
     */
    constructor(data) {
        Object.keys(data).forEach(key => {
            if (Object.hasOwn(this, key)) {
                this[key] = data[key];
            }
        });
    }
}
