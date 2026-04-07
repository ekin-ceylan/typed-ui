import { textBoxArgTypes } from '../../../utilities/common-arg-types.js';
import { Platebox } from '../../../utilities/register.js';
import '../../../assets/styles/text-box.css';

const argTypes = structuredClone(textBoxArgTypes);

delete argTypes.type;
delete argTypes.allowPattern;
delete argTypes.pattern;
delete argTypes.minlength;
delete argTypes.maxlength;

argTypes.autocomplete.table.defaultValue.summary = 'off';
argTypes.autounmask.table.defaultValue.summary = 'true';

export default {
    title: 'Bileşenler/Textbox/PlateBox',
    argTypes,
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
