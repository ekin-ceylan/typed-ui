import { passwordboxArgTypes } from '../../../utilities/common-arg-types.js';
import { Passwordbox } from '../../../utilities/register.js';
import '../../../assets/styles/text-box.css';
import './password-box.css';

export default {
    title: 'Bileşenler/Metin Bileşenleri/PasswordBox',
    argTypes: passwordboxArgTypes,
};

export const Default = {
    render: args => Passwordbox(args),
    args: {
        label: 'Şifre',
        placeholder: 'Şifrenizi giriniz',
    },
    parameters: {
        docs: {
            canvas: { sourceState: 'shown' }, // Canvas altında code otomatik açık gelir
            codePanel: true,
        },
    },
};

export const PlaygroundStory = {
    render: args => Passwordbox(args),
    tags: ['!dev'],
    args: {
        label: 'Şifre',
        placeholder: 'Şifrenizi giriniz',
    },
    parameters: {
        docs: {
            canvas: { sourceState: 'shown' }, // Canvas altında code otomatik açık gelir
        },
    },
};
