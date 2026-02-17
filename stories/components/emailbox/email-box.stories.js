import { textBoxArgTypes } from '../../utilities/common-arg-types.js';
import { Emailbox } from '../../utilities/register.js';
import '../textbox/text-box.css';

export default {
    title: 'Textbox/EmailBox',
    argTypes: {
        ...textBoxArgTypes,
    },
};

// Mirrors index.html:
// <plate-box field-id="plate-no" label="Plaka Numarası" value="55  ty" required></plate-box>
export const Default = {
    render: args => Emailbox(args),
    args: {
        fieldId: 'email-address',
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
        fieldId: 'email-address',
        label: 'E-Posta Adresi',
        placeholder: 'E-Posta adresinizi giriniz',
    },
    parameters: {
        docs: {
            canvas: { sourceState: 'shown' }, // Canvas altında code otomatik açık gelir
        },
    },
};
