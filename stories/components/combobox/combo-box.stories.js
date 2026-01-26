import { Combobox } from '../register.js';
import './combo-box.css';

export default {
    component: 'combo-box',
    title: 'Components/ComboBox',
    argTypes: {
        defaultSlotHtml: {
            control: 'text',
            description: 'options için slot içeriği.',
            table: {
                type: { summary: 'html' },
                defaultValue: { summary: '' },
            },
        },
        noOptionsSlotHtml: {
            control: 'text',
            description: 'options olmadığında gösterilecek option için slot içeriği.',
            table: {
                type: { summary: 'html' },
                defaultValue: { summary: '' },
            },
        },
        fieldId: {
            type: { name: 'string', required: true },
            control: 'text',
            description: 'Input elementinin id attribute değeri.',
            table: {
                defaultValue: { summary: '' },
            },
        },
        fieldName: {
            type: { name: 'string' },
            control: 'text',
            description: 'Input elementinin name attribute değeri. Atanmazsa field-id değeri kullanılır.',
            table: {
                defaultValue: { summary: 'field-id' },
            },
        },
        label: {
            type: { name: 'string', required: true },
            control: 'text',
            description: 'Input etiketi',
            table: {
                defaultValue: { summary: '' },
            },
        },
        value: {
            type: { name: 'string' },
            defaultValue: undefined,
            description: 'Kombo kutusunun tuttuğu değer.\n\n Başlangıçta yazılan değer optionlar arasında bulunuyorsa o seçenek seçili olarak gelir.',
            control: 'text',
            table: {
                defaultValue: { summary: 'null' },
                type: { summary: 'string|number' },
            },
        },
        required: {
            control: 'boolean',
            table: {
                defaultValue: { summary: 'false' },
                type: { summary: 'boolean' },
            },
        },
        disabled: {
            control: 'boolean',
            table: {
                defaultValue: { summary: 'false' },
                type: { summary: 'boolean' },
            },
        },
        nativeBehavior: {
            control: 'boolean',
            table: {
                defaultValue: { summary: 'false' },
                type: { summary: 'boolean' },
            },
        },
        placeholder: {
            type: { name: 'string', required: true },
            control: 'text',
            description: 'Seçim yapılmamışken gösterilecek yer tutucu metin.',
            table: {
                defaultValue: { summary: '' },
            },
        },
        // readonly: {
        //     control: 'boolean',
        //     table: {
        //         defaultValue: { summary: 'false' },
        //         type: { summary: 'boolean' },
        //     },
        // },
    },
};

export const Default = {
    render: args => Combobox(args),
    args: {
        defaultSlotHtml: `<option value="tr">
    <img src="https://flagcdn.com/tr.svg" alt="Turkey Flag" width="20" height="15" style="vertical-align: middle; margin-right: 5px" />Türkiye
</option>
<option value="de">
    <img src="https://flagcdn.com/de.svg" alt="Germany Flag" width="20" height="15" style="vertical-align: middle; margin-right: 5px" />Almanya
</option>
<option value="us">
    <img src="https://flagcdn.com/us.svg" alt="USA Flag" width="20" height="15" style="vertical-align: middle; margin-right: 5px" />ABD
</option>
<option value="ch" disabled>Çin Halk Cumhuriyeti Çin Halk Cumhuriyeti Çin Halk Cumhuriyeti</option>
<option value="kp">Kuzey Kore</option>
<option value="jp">Japonya</option>
<option value="it">İtalya</option>`,
        noOptionsSlotHtml: `<template slot="no-options">Kayıt Bulunamadı</template>`,
        fieldId: 'country',
        label: 'Ülke',
        placeholder: 'Lütfen seçiniz',
    },
    parameters: {
        docs: {
            canvas: { sourceState: 'shown' }, // Canvas altında code otomatik açık gelir
            codePanel: true,
        },
    },
};

export const Playground = {
    render: args => Combobox(args),
    tags: ['!dev'],
    args: {
        defaultSlotHtml: `<option value="tr">
    <img src="https://flagcdn.com/tr.svg" alt="Turkey Flag" width="20" height="15" />Türkiye
</option>
<option value="de">
    <img src="https://flagcdn.com/de.svg" alt="Germany Flag" width="20" height="15" />Almanya
</option>
<option value="us">
    <img src="https://flagcdn.com/us.svg" alt="USA Flag" width="20" height="15" />ABD
</option>
<option value="ch" disabled>Çin Halk Cumhuriyeti Çin Halk Cumhuriyeti Çin Halk Cumhuriyeti</option>
<option value="kp">Kuzey Kore</option>
<option value="jp">Japonya</option>
<option value="it">İtalya</option>`,
        noOptionsSlotHtml: `<template slot="no-options">Kayıt Bulunamadı</template>`,
        fieldId: 'country',
        label: 'Ülke',
        placeholder: 'Lütfen seçiniz',
    },
    parameters: {
        docs: {
            canvas: { sourceState: 'shown' }, // Canvas altında code otomatik açık gelir
            codePanel: true,
        },
    },
};

// export const NativeBehavior = {
//     render: () => `
//         <combo-box label="Kombo Native" field-id="combo-country-native" native-behavior placeholder="Seçiniz" value="de">
//             <option value="tr">Türkiye</option>
//             <option value="de">Almanya</option>
//             <option value="us">ABD</option>
//             <option value="ch" disabled>Çin Halk Cumhuriyeti Çin Halk Cumhuriyeti Çin Halk Cumhuriyeti</option>
//             <option value="kp">Kuzey Kore</option>
//             <option value="jp">Japonya</option>
//             <option value="it">İtalya</option>
//         </combo-box>
//     `,
// };

// export const DynamicOptionsProperty = {
//     render: () => {
//         const el = document.createElement('combo-box');
//         el.setAttribute('field-id', 'combo-dynamic');
//         el.setAttribute('label', 'Kombo Dinamik');
//         el.setAttribute('placeholder', 'Seçiniz');

//         // Property-driven options (alternative to slotted <option> children)
//         el.options = [
//             { value: 'tr', label: 'Türkiye' },
//             { value: 'de', label: 'Almanya', selected: true },
//             { value: 'us', label: 'ABD' },
//             { value: 'ch', label: 'Çin Halk Cumhuriyeti', disabled: true },
//         ];

//         return el;
//     },
// };
