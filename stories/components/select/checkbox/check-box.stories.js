import { inputBaseArgTypes } from '../../../utilities/common-arg-types.js';
import { Checkbox } from '../../../utilities/register.js';

export default {
    component: 'check-box',
    title: 'Bileşenler/Select/Checkbox',
    argTypes: {
        defaultSlot: {
            name: 'default',
            control: 'text',
            description: 'Checkbox etiket içeriği.',
            table: {
                category: 'Slots',
                type: { summary: 'html' },
                defaultValue: { summary: '' },
            },
        },
        ...structuredClone(inputBaseArgTypes),
        label: {
            type: { name: 'string', required: true },
            control: 'text',
            description: 'Checkbox açıklaması',
            table: {
                category: 'Attributes',
                defaultValue: { summary: '' },
            },
        },
        value: {
            type: { name: 'string' },
            description:
                "Checkbox'ın tuttuğu değer.\n\nSeçili olduğunda `checked-value`, seçili olmadığında `unchecked-value` değerini tutar.\n\n Başlangıçta yazılan değer `checked-value` ile eşleşiyorsa checkbox işaretli olur.",
            control: 'text',
            table: {
                category: 'Attributes',
                defaultValue: { summary: 'null' },
                type: { summary: 'string|number' },
            },
        },
        checked: {
            control: 'boolean',
            table: {
                category: 'Attributes',
                defaultValue: { summary: 'false' },
                type: { summary: 'boolean' },
            },
        },
        checkedValue: {
            type: { name: 'string' },
            description: "Seçili olduğunda gönderilecek değer. Atanmazsa attribute görünmez ve 'on' kabul edilir.",
            control: 'text',
            table: {
                category: 'Attributes',
                defaultValue: { summary: '"on"' },
                type: { summary: 'string|number' },
            },
        },
        uncheckedValue: {
            type: { name: 'string' },
            description: 'Seçili olmadığında gönderilecek değer. Atanmazsa attribute görünmez ve undefined kabul edilir.',
            control: 'text',
            table: {
                category: 'Attributes',
                defaultValue: { summary: 'undefined' },
                type: { summary: 'string|number' },
            },
        },
        indeterminate: {
            control: 'boolean',
            table: {
                category: 'Attributes',
                defaultValue: { summary: 'false' },
                type: { summary: 'boolean' },
            },
        },
    },
};

// native davranış
// lit component içinde value okuyan davranış
// indeterminate senaryosu: değeri etkilemez.
// required ve validation
// disabled senaryosu
// readonly senaryosu
// checked
// Indeterminate
// Events
// Props
// Attr

export const Default = {
    render: args => Checkbox(args),
    args: {
        defaultSlot: 'Okudum, Anladım',
        fieldId: 'subscribe',
        label: 'Abone Ol',
    },
    parameters: {
        controls: { expanded: true },
    },
};

export const PlaygroundStory = {
    render: args => Checkbox(args),
    tags: ['!dev'],
    args: {
        defaultSlot: 'Okudum, Anladım',
        fieldId: 'subscribe',
        label: 'Abone Ol',
    },
    parameters: {
        docs: {
            canvas: { sourceState: 'shown' }, // Canvas altında code otomatik açık gelir
        },
    },
};
