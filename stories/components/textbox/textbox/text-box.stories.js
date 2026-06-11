import { textBoxArgTypes } from '../../../utilities/common-arg-types.js';
import { Textbox } from '../../../utilities/register.js';
import '../../../assets/styles/text-box.css';

const argTypes = structuredClone(textBoxArgTypes);

argTypes.spellcheck.table.defaultValue.summary = 'true';

export default {
    title: 'Bileşenler/Metin Bileşenleri/TextBox',
    argTypes,
};

export const Default = {
    render: args => Textbox(args),
    args: {
        name: 'FirstName',
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
        name: 'FirstName',
        label: 'Adınız',
        value: undefined,
        placeholder: 'Adınızı giriniz',
        required: undefined,
        disabled: undefined,
        clearable: true,
    },
    parameters: {
        docs: {
            canvas: { sourceState: 'shown' }, // Canvas altında code otomatik açık gelir
        },
    },
};
