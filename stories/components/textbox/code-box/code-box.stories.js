import { codeBoxArgTypes } from '../../../utilities/common-arg-types.js';
import { CodeBox } from '../../../utilities/register.js';
import '../textbox/text-box.css';
import './code-box.css';

export default {
    title: 'Bileşenler/Textbox/CodeBox',
    argTypes: {
        ...codeBoxArgTypes,
    },
};

export const Default = {
    render: args => CodeBox(args),
    args: {
        fieldId: undefined,
        fieldName: 'SubmitCode',
        label: 'Doğrulama Kodu',
        value: undefined,
        digits: 6,
        placeholder: undefined,
    },
    parameters: {
        docs: {
            canvas: { sourceState: 'shown' }, // Canvas altında code otomatik açık gelir
            codePanel: true,
        },
    },
};

export const PlaygroundStory = {
    render: args => CodeBox(args),
    tags: ['!dev'],
    args: {
        fieldId: undefined,
        fieldName: 'SubmitCode',
        label: 'Doğrulama Kodu',
        value: '565',
        digits: 6,
        placeholder: undefined,
    },
    parameters: {
        docs: {
            canvas: { sourceState: 'shown' }, // Canvas altında code otomatik açık gelir
        },
    },
};
