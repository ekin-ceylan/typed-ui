import BaseModel from './BaseModel';

/**
 * Model representing a warning configuration for a component. It specifies which fields should trigger a warning if not set, and an optional custom message to display when the warning is triggered.
 * This is used by components to define non-critical but recommended fields that developers should be aware of.
 * @property {string[]} fields - List of field names that should trigger a warning if not set.
 * @property {string?} [message] - Custom warning message. If not provided, a default message will be generated based on the fields.
 */
export default class WarningField extends BaseModel {
    /**
     * List of field names that should trigger a warning if not set.
     * @type {string[]}
     */
    fields = [];
    /**
     * Custom warning message. If not provided, a default message will be generated.
     * @type {string?}
     */
    message;
}
