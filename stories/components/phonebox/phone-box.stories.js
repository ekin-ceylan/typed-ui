import { textBoxArgTypes } from '../../utilities/common-arg-types.js';
import { Phonebox } from '../../utilities/register.js';
import '../textbox/text-box.css';

export default {
    title: 'Textbox/PhoneBox',
    argTypes: {
        ...textBoxArgTypes,
    },
};

// Mirrors index.html:
// <phone-box field-id="phone-no" label="Telefon Numarası" value="0555 555 5555" required></phone-box>
export const Default = {
    render: args => Phonebox(args),
    args: {
        fieldId: undefined,
        fieldName: 'PhoneNumber',
        label: 'Telefon Numarası',
        value: undefined,
        placeholder: '0555 555 5555',
    },
    parameters: {
        docs: {
            canvas: { sourceState: 'shown' }, // Canvas altında code otomatik açık gelir
            codePanel: true,
        },
    },
};

export const PlaygroundStory = {
    render: args => Phonebox(args),
    tags: ['!dev'],
    args: {
        fieldId: 'phone-no',
        label: 'Telefon Numarası',
        placeholder: '0555 555 5555',
    },
    parameters: {
        docs: {
            canvas: { sourceState: 'shown' }, // Canvas altında code otomatik açık gelir
        },
    },
};
