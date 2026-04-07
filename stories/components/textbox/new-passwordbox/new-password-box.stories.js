import { NewPasswordbox } from '../../../utilities/register.js';
import '../../../assets/styles/text-box.css';
import '../passwordbox/password-box.css';
import { passwordboxArgTypes } from '../../../utilities/common-arg-types.js';

export default {
    title: 'Bileşenler/Textbox/NewPasswordBox',
    argTypes: passwordboxArgTypes,
};

export const Default = {
    render: args => NewPasswordbox(args),
    args: {
        fieldId: 'password',
        label: 'Şifre',
        placeholder: 'Şifrenizi giriniz',
        required: true,
    },
    parameters: {
        docs: {
            canvas: { sourceState: 'shown' }, // Canvas altında code otomatik açık gelir
            codePanel: true,
        },
    },
};

export const PlaygroundStory = {
    render: args => NewPasswordbox(args),
    tags: ['!dev'],
    args: {
        label: 'Yeni Şifre',
        fieldName: 'newPassword',
        placeholder: 'Şifrenizi giriniz',
    },
    parameters: {
        docs: {
            canvas: { sourceState: 'shown' }, // Canvas altında code otomatik açık gelir
        },
    },
};
