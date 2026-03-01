import { textBoxArgTypes } from '../../../utilities/common-arg-types.js';
import { Textbox } from '../../../utilities/register.js';
import './text-box.css';

export default {
    title: 'Bileşenler/Textbox/TextBox',
    argTypes: textBoxArgTypes,
};

// Mirrors index.html:
// <plate-box field-id="plate-no" label="Plaka Numarası" value="55  ty" required></plate-box>
export const Default = {
    render: args => Textbox(args),
    args: {
        fieldName: 'FirstName',
        label: 'Adınız',
        placeholder: 'Adınızı giriniz',
    },
    parameters: {
        docs: {
            canvas: { sourceState: 'shown' }, // Canvas altında code otomatik açık gelir
            codePanel: true,
        },
    },
};

export const PlaygroundStory = {
    render: args => Textbox(args),
    tags: ['!dev'],
    args: {
        fieldId: undefined,
        fieldName: 'FirstName',
        label: 'Adınız',
        value: undefined,
        placeholder: 'Adınızı giriniz',
        required: undefined,
        requiredSign: '*',
        disabled: undefined,
        clearable: true,
    },
    parameters: {
        docs: {
            canvas: { sourceState: 'shown' }, // Canvas altında code otomatik açık gelir
        },
    },
};
