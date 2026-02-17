import { textBoxArgTypes } from '../../utilities/common-arg-types.js';
import { TcNumber } from '../../utilities/register.js';
import '../textbox/text-box.css';
import './tc-number.css';

export default {
    title: 'Textbox/Tc Number',
    argTypes: {
        ...textBoxArgTypes,
    },
};

export const Default = {
    render: args => TcNumber(args),
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
    render: args => TcNumber(args),
    tags: ['!dev'],
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
        },
    },
};
