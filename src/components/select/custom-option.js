import LightComponentBase from '../../core/light-component-base.js';

export default class CustomOption extends LightComponentBase {
    static get properties() {
        return {
            ...super.properties,
            label: { type: String },
            text: { type: String, noaccessor: true },
            value: { type: String },
            selected: { type: Boolean },
            disabled: { type: Boolean },
            hidden: { type: Boolean },
        };
    }

    get text() {
        return this.textContent.trim();
    }
}
