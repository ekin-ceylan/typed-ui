import { LightComponentBase, ComboBox, html } from '../../../dist/typed-ui-with-lit.js';

import { defineComponent } from '../../../src/index.js';
import { generateId } from '../../../src/modules/id-generator.js';
import PhoneIntl2 from './phone-intl-2.js';

export default class PhoneNational2 extends LightComponentBase {
    static get properties() {
        return {
            ...super.properties,
            countryCode: { type: Number, attribute: 'phone-code' },
            label: { type: String },
            fieldId: { type: String, attribute: 'field-id' },
        };
    }

    constructor() {
        super();

        /** @type {string | undefined} */
        this.countryCode = 'tr';
        /** @type {string | undefined} */
        this.label = undefined;
        /** @type {string | undefined} */
        this.fieldId = undefined;
    }

    connectedCallback() {
        super.connectedCallback();
        if (!this.fieldId) this.fieldId = generateId(this.tagName.toLowerCase());
    }

    #handleCountryChange(event) {
        this.countryCode = event.target.value;
    }

    render() {
        return html`
            <label for="${this.fieldId}">${this.label}</label>
            <div role="container">
                <combo-box label="Country" hide-label .options="${options}" .value="${this.countryCode}" @change="${this.#handleCountryChange}"></combo-box>
                <phone-intl-2 label="Phone" field-id="${this.fieldId}" hide-label country-code="${this.countryCode}"></phone-intl-2>
            </div>
        `;
    }
}

defineComponent('combo-box', ComboBox);
defineComponent('phone-intl-2', PhoneIntl2);

class CountryPhone {
    value;
    phoneCode;
    label;

    get innerHTML() {
        return `<img src="https://flagcdn.com/${this.value}.svg" alt="${this.label} Bayrağı" width="20" height="15" style="margin-right: 5px" />
            <span>${this.label}</span>
            <span>+${this.phoneCode}</span>`;
    }

    constructor(data) {
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                this[key] = data[key];
            }
        }
    }
}

const options = [
    new CountryPhone({ phoneCode: '971', value: 'ae', label: 'Birleşik Arap Emirlikleri' }),
    new CountryPhone({ phoneCode: '54', value: 'ar', label: 'Arjantin' }),
    new CountryPhone({ phoneCode: '55', value: 'br', label: 'Brezilya' }),
    new CountryPhone({ phoneCode: '1', value: 'ca', label: 'Kanada' }),
    new CountryPhone({ phoneCode: '86', value: 'cn', label: 'Çin Halk Cumhuriyeti' }),
    new CountryPhone({ phoneCode: '57', value: 'co', label: 'Kolombiya' }),
    new CountryPhone({ phoneCode: '49', value: 'de', label: 'Almanya' }),
    new CountryPhone({ phoneCode: '20', value: 'eg', label: 'Mısır' }),
    new CountryPhone({ phoneCode: '34', value: 'es', label: 'İspanya' }),
    new CountryPhone({ phoneCode: '33', value: 'fr', label: 'Fransa' }),
    new CountryPhone({ phoneCode: '44', value: 'gb', label: 'Birleşik Krallık' }),
    new CountryPhone({ phoneCode: '91', value: 'in', label: 'Hindistan' }),
    new CountryPhone({ phoneCode: '39', value: 'it', label: 'İtalya' }),
    new CountryPhone({ phoneCode: '81', value: 'jp', label: 'Japonya' }),
    new CountryPhone({ phoneCode: '850', value: 'kp', label: 'Kuzey Kore' }),
    new CountryPhone({ phoneCode: '82', value: 'kr', label: 'Güney Kore' }),
    new CountryPhone({ phoneCode: '52', value: 'mx', label: 'Meksika' }),
    new CountryPhone({ phoneCode: '31', value: 'nl', label: 'Hollanda' }),
    new CountryPhone({ phoneCode: '48', value: 'pl', label: 'Polonya' }),
    new CountryPhone({ phoneCode: '351', value: 'pt', label: 'Portekiz' }),
    new CountryPhone({ phoneCode: '7', value: 'ru', label: 'Rusya' }),
    new CountryPhone({ phoneCode: '966', value: 'sa', label: 'Suudi Arabistan' }),
    new CountryPhone({ phoneCode: '46', value: 'se', label: 'İsveç' }),
    new CountryPhone({ phoneCode: '65', value: 'sg', label: 'Singapur' }),
    new CountryPhone({ phoneCode: '66', value: 'th', label: 'Tayland' }),
    new CountryPhone({ phoneCode: '90', value: 'tr', label: 'Türkiye' }),
    new CountryPhone({ phoneCode: '1', value: 'us', label: 'Amerika Birleşik Devletleri' }),
    new CountryPhone({ phoneCode: '84', value: 'vn', label: 'Vietnam' }),
];
