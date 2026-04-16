import { inputBaseArgTypes, textBoxArgTypes } from '../../../utilities/common-arg-types.js';
import { TcBox } from '../../../utilities/register.js';
import '../../../assets/styles/text-box.css';

const argTypes = {
    ...structuredClone(inputBaseArgTypes),
    autocomplete: textBoxArgTypes.autocomplete,
};

export default {
    title: 'Bileşenler/Metin Bileşenleri/TcBox',
    argTypes,
};

export const Default = {
    render: args => TcBox(args),
    args: {
        fieldId: undefined,
        fieldName: 'TcNo',
        label: 'Kimlik Numaranız',
        value: undefined,
        placeholder: 'Kimlik numaranızı giriniz',
    },
    parameters: {
        docs: {
            canvas: { sourceState: 'shown' }, // Canvas altında code otomatik açık gelir
            codePanel: true,
        },
    },
};

export const PlaygroundStory = {
    render: args => TcBox(args),
    tags: ['!dev'],
    args: {
        fieldId: undefined,
        fieldName: 'TcNo',
        label: 'Kimlik Numaranız',
        value: undefined,
        placeholder: 'Kimlik numaranızı giriniz',
        required: undefined,
        disabled: undefined,
        readonly: undefined,
        clearable: true,
        hideLabel: undefined,
        autocomplete: undefined,
        requiredSign: '*',
    },
    parameters: {
        docs: {
            canvas: { sourceState: 'shown' }, // Canvas altında code otomatik açık gelir
        },
    },
};
