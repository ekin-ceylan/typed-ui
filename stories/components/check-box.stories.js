import { Checkbox } from './register.js';

export default {
    component: 'check-box',
    title: 'Components/CheckBox',
    argTypes: {
        slotHtml: {
            control: 'text',
            description: 'Checkbox etiket içeriği.',
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
            description: 'Checkbox açıklaması',
            table: {
                defaultValue: { summary: '' },
            },
        },
        value: {
            type: { name: 'string' },
            defaultValue: undefined,
            description:
                "Checkbox'ın tuttuğu değer.\n\nSeçili olduğunda checked-value, seçili olmadığında `unchecked-value` değerini tutar.\n\n Başlangıçta yazılan değer `checked-value` ile eşleşiyorsa checkbox işaretli olur.",
            control: 'text',
            table: {
                defaultValue: { summary: 'null' },
                type: { summary: 'string|number' },
            },
        },
        checked: {
            control: 'boolean',
            table: {
                defaultValue: { summary: 'false' },
                type: { summary: 'boolean' },
            },
        },
        checkedValue: {
            type: { name: 'string' },
            description: "Seçili olduğunda gönderilecek değer. Atanmazsa attribute görünmez ve 'on' kabul edilir.",
            control: 'text',
            table: {
                defaultValue: { summary: '"on"' },
                type: { summary: 'string|number' },
            },
        },
        uncheckedValue: {
            type: { name: 'string' },
            description: 'Seçili olmadığında gönderilecek değer. Atanmazsa attribute görünmez ve undefined kabul edilir.',
            control: 'text',
            table: {
                defaultValue: { summary: 'undefined' },
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
        readonly: {
            control: 'boolean',
            table: {
                defaultValue: { summary: 'false' },
                type: { summary: 'boolean' },
            },
        },
        indeterminate: {
            control: 'boolean',
            table: {
                defaultValue: { summary: 'false' },
                type: { summary: 'boolean' },
            },
        },
    },
};

// native davranış
// lit component içinde value okuyan davranış
// indeterminate senaryosu: değeri etkilemez.
// disabled senaryosu
// readonly senaryosu

export const Default = {
    render: args => Checkbox(args),
    args: {
        slotHtml: 'Okudum, Anladım',
        fieldId: 'subscribe',
        label: 'Abone Ol',
    },
};

// export const Checked = {
//     render: args => Checkbox(args),
//     args: {
//         slotHtml: 'Seçiniz',
//         checked: true,
//         required: false,
//         disabled: false,
//         indeterminate: false,
//     },
// };

// export const Indeterminate = {
//     render: args => Checkbox(args),
//     args: {
//         slotHtml: 'Seçiniz',
//         checked: false,
//         required: false,
//         disabled: false,
//         indeterminate: true,
//     },
// };

// export const Disabled = {
//     render: args => Checkbox(args),
//     args: {
//         slotHtml: 'Seçiniz',
//         checked: false,
//         required: false,
//         disabled: true,
//         indeterminate: false,
//     },
// };
