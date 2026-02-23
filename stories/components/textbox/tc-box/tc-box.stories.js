import { textBoxArgTypes } from '../../../utilities/common-arg-types.js';
import { TcBox } from '../../../utilities/register.js';
import '../textbox/text-box.css';
import './tc-box.css';

export default {
    title: 'Bileşenler/Textbox/TcBox',
    argTypes: {
        ...textBoxArgTypes,
    },
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
    },
    parameters: {
        docs: {
            canvas: { sourceState: 'shown' }, // Canvas altında code otomatik açık gelir
        },
    },
};
