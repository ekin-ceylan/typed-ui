import { defineComponent } from '../../../../dist/typed-ui-with-lit.js';
import { createAttrType, createEventType, inputBaseArgTypes } from '../../../utilities/common-arg-types.js';
import { Phonebox } from '../../../utilities/register.js';
import PhoneNational from '../../custom/phone-national-with-flag.js';
import PhoneNational2 from '../../custom/phone-national-with-flag-2.js';
import '../textbox/text-box.css';
import '../../../assets/styles/custom.css';
import '../../select/combobox/combo-box.css';

export default {
    title: 'Bileşenler/Textbox/PhoneBox',
    argTypes: {
        ...inputBaseArgTypes,
        autounmask: createAttrType(
            'Bileşenin değerinin maskeli şekilde tutulup tutulmayacağını belirler. Açıksa, inputun görünen değeri maskelenirken bileşenin tuttuğu değer maskesiz olur. `unmask()` fonksiyonu tanımlanmış olmalıdır.',
            'boolean',
            'false'
        ),
    },
};

// Mirrors index.html:
// <phone-box field-id="phone-no" label="Telefon Numarası" value="0555 555 5555" required></phone-box>
export const Default = {
    render: args => Phonebox(args),
    args: {
        fieldId: undefined,
        fieldName: 'PhoneNumber',
        label: 'Telefon Numarası',
        value: undefined,
        placeholder: '0(555) 555 5555',
    },
    parameters: {
        docs: {
            canvas: { sourceState: 'shown' }, // Canvas altında code otomatik açık gelir
            codePanel: true,
        },
    },
};

export const PlaygroundStory = {
    render: args => Phonebox(args),
    tags: ['!dev'],
    args: {
        fieldId: 'phone-no',
        label: 'Telefon Numarası',
        placeholder: '0(555) 555 5555',
    },
    parameters: {
        docs: {
            canvas: { sourceState: 'shown' }, // Canvas altında code otomatik açık gelir
        },
    },
};

export const IntlStory_1 = {
    render: _args => {
        defineComponent('phone-with-area', PhoneNational);
        const phone = new PhoneNational();

        return phone;
    },
    tags: ['!dev'],
    parameters: {
        docs: {
            canvas: { sourceState: 'shown' }, // Canvas altında code otomatik açık gelir
        },
    },
};

export const IntlStory_2 = {
    render: _args => {
        defineComponent('phone-with-area-2', PhoneNational2);
        const phone = new PhoneNational2();
        phone.label = 'Telefon Numarası';

        return phone;
    },
    tags: ['!dev'],
    parameters: {
        docs: {
            canvas: { sourceState: 'shown' }, // Canvas altında code otomatik açık gelir
        },
    },
};

export const PropAttrEventLists = {
    tags: ['!dev'],
    argTypes: {
        input: createEventType('input', 'Kullanıcı inputa her veri girişi yaptığında tetiklenir.'),
        change: createEventType('change', 'Inputun değeri değiştiğinde ve inputtan çıkıldığında tetiklenir.'),
        clear: createEventType('clear', 'Temizleme (X) butonuna tıklandığında tetiklenir.'),
        update: createEventType('update', 'Değer programatik olarak (JS ile .value set edilerek) değiştirildiğinde tetiklenir.'),
    },
};

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
    new CountryPhone({ phoneCode: '90', value: 'tr', label: 'Türkiye' }),
    new CountryPhone({ phoneCode: '1', value: 'us', label: 'Amerika Birleşik Devletleri' }),
    new CountryPhone({ phoneCode: '49', value: 'de', label: 'Almanya' }),
    new CountryPhone({ phoneCode: '33', value: 'fr', label: 'Fransa' }),
    new CountryPhone({ phoneCode: '86', value: 'cn', label: 'Çin Halk Cumhuriyeti' }),
    new CountryPhone({ phoneCode: '850', value: 'kp', label: 'Kuzey Kore' }),
    new CountryPhone({ phoneCode: '39', value: 'it', label: 'İtalya' }),
];
