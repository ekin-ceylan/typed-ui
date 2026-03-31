import { createAttrType, inputBaseArgTypes } from '../../../utilities/common-arg-types.js';
import { Phonebox } from '../../../utilities/register.js';
import '../textbox/text-box.css';

export default {
    title: 'Bileşenler/Textbox/PhoneBox',
    argTypes: {
        ...inputBaseArgTypes,
        autounmask: createAttrType(
            'Bileşenin değerinin maskeli şekilde tutulup tutulmayacağını belirler. Açıksa, inputun görünen değeri maskelenirken bileşenin tuttuğu değer maskesiz olur. `unmask()` fonksiyonu tanımlanmış olmalıdır.',
            'boolean',
            'false'
        ),
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
        placeholder: '0(555) 555 5555',
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
        placeholder: '0(555) 555 5555',
    },
    parameters: {
        docs: {
            canvas: { sourceState: 'shown' }, // Canvas altında code otomatik açık gelir
        },
    },
};
