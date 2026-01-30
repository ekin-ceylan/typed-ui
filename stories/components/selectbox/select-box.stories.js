import { Selectbox } from '../../utilities/register.js';
import './select-box.css';

export default {
    title: 'Components/SelectBox',
    argTypes: {
        defaultSlotHtml: {
            control: 'text',
            description: 'options için slot içeriği.',
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
        placeholder: {
            type: { name: 'string' },
            control: 'text',
            description: 'Seçim yapılmamışken gösterilecek yer tutucu metin.',
            table: {
                defaultValue: { summary: '' },
            },
        },
        noOptionsLabel: {
            type: { name: 'string' },
            control: 'text',
            description: 'Seçenek yokken gösterilecek metin.',
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
    render: args => Selectbox(args),
    args: {
        defaultSlotHtml: `<option value="tr">Türkiye</option>
<option value="de">Almanya</option>
<option value="us">ABD</option>`,
        fieldId: 'country',
        label: 'Ülke',
        placeholder: 'Lütfen seçiniz',
        noOptionsLabel: 'Kayıt Bulunamadı',
    },
    parameters: {
        docs: {
            canvas: { sourceState: 'shown' }, // Canvas altında code otomatik açık gelir
            codePanel: true,
        },
    },
};

export const PlaygroundStory = {
    render: args => Selectbox(args),
    tags: ['!dev'],
    args: {
        defaultSlotHtml: `<option value="tr">Türkiye</option>
<option value="de">Almanya</option>
<option value="us">ABD</option>`,
        fieldId: 'country',
        label: 'Ülke',
        placeholder: 'Lütfen seçiniz',
        noOptionsLabel: 'Kayıt Bulunamadı',
    },
    parameters: {
        docs: {
            canvas: { sourceState: 'shown' }, // Canvas altında code otomatik açık gelir
        },
    },
};

// export const WithSelectedValue = {
//     render: () => `
//         <select-box field-id="country-selected" label="Ülke Selected" value="tr" placeholder="Seçiniz" required>
//             <span slot="no-options">Kayıtsız</span>
//             <option value="tr">Türkiye</option>
//             <option value="de">Almanya</option>
//             <option value="us">ABD</option>
//             <option value="ch" selected>Çin Halk Cumhuriyeti Çin Halk Cumhuriyeti Çin Halk Cumhuriyeti</option>
//         </select-box>
//     `,
// };

// export const WithOptGroups = {
//     render: () => `
//         <select-box field-id="cars" label="Cars">
//             <optgroup label="Swedish Cars">
//                 <option value="volvo" selected>Volvo</option>
//                 <option value="saab">Saab</option>
//             </optgroup>
//             <optgroup label="German Cars">
//                 <option value="mercedes">Mercedes</option>
//                 <option value="audi">Audi</option>
//             </optgroup>
//         </select-box>
//     `,
// };

// export const DynamicOptionsProperty = {
//     render: () => {
//         const el = document.createElement('select-box');
//         el.setAttribute('field-id', 'sb-dynamic');
//         el.setAttribute('label', 'Dinamik');
//         el.setAttribute('placeholder', 'Dinamik Seçiniz');
//         el.setAttribute('no-options-label', 'Kayıtsız');

//         // Mirrors the dynamic assignment in index.html
//         el.options = [
//             { value: 'x', label: 'X' },
//             { value: 'y', label: 'Y', selected: true },
//             { value: 'z', label: 'Z' },
//         ];

//         return el;
//     },
// };
