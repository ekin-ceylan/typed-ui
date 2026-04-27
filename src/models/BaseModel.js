/** Represents the base class for all models. */
export default class BaseModel {
    constructor(data) {
        Object.keys(data).forEach(key => {
            if (Object.hasOwn(this, key)) {
                this[key] = data[key];
            }
        });
    }
}
