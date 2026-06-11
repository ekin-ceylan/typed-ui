import { textBoxArgTypes } from '../../../utilities/common-arg-types.js';
import { Emailbox } from '../../../utilities/register.js';
import '../../../assets/styles/text-box.css';

export default {
    title: 'Bileşenler/Metin Bileşenleri/EmailBox',
    argTypes: {
        ...textBoxArgTypes,
    },
};

export const Default = {
    render: args => Emailbox(args),
    args: {
        label: 'E-Posta Adresi',
        placeholder: 'E-Posta adresinizi giriniz',
    },
    parameters: {
        docs: {
            canvas: { sourceState: 'shown' }, // Canvas altında code otomatik açık gelir
            codePanel: true,
        },
    },
};

export const PlaygroundStory = {
    render: args => Emailbox(args),
    tags: ['!dev'],
    args: {
        label: 'E-Posta Adresi',
        placeholder: 'E-Posta adresinizi giriniz',
    },
    parameters: {
        docs: {
            canvas: { sourceState: 'shown' }, // Canvas altında code otomatik açık gelir
        },
    },
};
