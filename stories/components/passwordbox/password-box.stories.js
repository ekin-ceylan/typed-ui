import { textBoxArgTypes } from '../../utilities/common-arg-types.js';
import { Passwordbox } from '../../utilities/register.js';
import '../textbox/text-box.css';
import './password-box.css';

export default {
    title: 'Textbox/PasswordBox',
    argTypes: {
        ...textBoxArgTypes,
    },
};

// Mirrors index.html:
// <plate-box field-id="plate-no" label="Plaka Numarası" value="55  ty" required></plate-box>
export const Default = {
    render: args => Passwordbox(args),
    args: {
        fieldId: 'password',
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
        fieldId: 'password',
        label: 'Şifre',
        placeholder: 'Şifrenizi giriniz',
    },
    parameters: {
        docs: {
            canvas: { sourceState: 'shown' }, // Canvas altında code otomatik açık gelir
        },
    },
};
