import '../../utilities/register.js';
import { Platebox } from '../../utilities/register.js';

export default {
    title: 'Components/PlateBox',
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
// <plate-box field-id="plate-no" label="Plaka Numarası" value="55  ty" required></plate-box>
export const Default = {
    render: args => Platebox(args),
    args: {
        fieldId: 'plate-no',
        label: 'Plaka Numarası',
        placeholder: '34 ABC 123',
    },
    parameters: {
        docs: {
            canvas: { sourceState: 'shown' }, // Canvas altında code otomatik açık gelir
            codePanel: true,
        },
    },
};

export const PlaygroundStory = {
    render: args => Platebox(args),
    tags: ['!dev'],
    args: {
        fieldId: 'plate-no',
        label: 'Plaka Numarası',
        placeholder: '34 ABC 123',
    },
    parameters: {
        docs: {
            canvas: { sourceState: 'shown' }, // Canvas altında code otomatik açık gelir
        },
    },
};

// export const RequiredWithValue = {
//     render: () => `
//         <plate-box field-id="plate-no" label="Plaka Numarası" value="55  ty" required></plate-box>
//     `,
// };

// export const InAForm = {
//     render: () => `
//         <form>
//             <plate-box field-id="plate-no" label="Plaka Numarası" required></plate-box>
//             <div style="margin-top: 12px;">
//                 <button type="submit">Submit</button>
//             </div>
//         </form>
//     `,
// };

// export const MinLengthExample = {
//     render: () => `
//         <plate-box field-id="plate-no" label="Plaka Numarası" value="34A" required></plate-box>
//     `,
// };
