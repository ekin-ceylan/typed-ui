import { Phonebox } from '../../utilities/register.js';
import '../textbox/text-box.css';

export default {
    title: 'Textbox/PhoneBox',
    argTypes: {
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
            description: 'Plaka kutusunun tuttuğu değer.',
            control: 'text',
            table: {
                defaultValue: { summary: 'null' },
                type: { summary: 'string' },
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
            type: { name: 'string', required: true },
            control: 'text',
            description: 'Seçim yapılmamışken gösterilecek yer tutucu metin.',
            table: {
                defaultValue: { summary: '' },
            },
        },
    },
};

// Mirrors index.html:
// <phone-box field-id="phone-no" label="Telefon Numarası" value="0555 555 5555" required></phone-box>
export const Default = {
    render: args => Phonebox(args),
    args: {
        fieldId: 'phone-no',
        label: 'Telefon Numarası',
        placeholder: '0555 555 5555',
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
        placeholder: '0555 555 5555',
    },
    parameters: {
        docs: {
            canvas: { sourceState: 'shown' }, // Canvas altında code otomatik açık gelir
        },
    },
};
