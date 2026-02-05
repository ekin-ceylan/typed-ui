import { Emailbox } from '../../utilities/register.js';
import '../textbox/text-box.css';

export default {
    title: 'Textbox/EmailBox',
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
            type: { name: 'string' },
            control: 'text',
            description: 'Seçim yapılmamışken gösterilecek yer tutucu metin.',
            table: {
                defaultValue: { summary: '' },
            },
        },
    },
};

// Mirrors index.html:
// <plate-box field-id="plate-no" label="Plaka Numarası" value="55  ty" required></plate-box>
export const Default = {
    render: args => Emailbox(args),
    args: {
        fieldId: 'email-address',
        label: 'E-Posta Adresi',
        placeholder: 'E-Posta adresinizi giriniz',
    },
    parameters: {
        docs: {
            canvas: { sourceState: 'shown' }, // Canvas altında code otomatik açık gelir
            codePanel: true,
        },
    },
};

export const PlaygroundStory = {
    render: args => Emailbox(args),
    tags: ['!dev'],
    args: {
        fieldId: 'email-address',
        label: 'E-Posta Adresi',
        placeholder: 'E-Posta adresinizi giriniz',
    },
    parameters: {
        docs: {
            canvas: { sourceState: 'shown' }, // Canvas altında code otomatik açık gelir
        },
    },
};
