import { textBoxArgTypes } from '../../../utilities/common-arg-types.js';
import { Platebox } from '../../../utilities/register.js';
import '../../../assets/styles/text-box.css';

const argTypes = structuredClone(textBoxArgTypes);

delete argTypes.type;
delete argTypes.allowPattern;
delete argTypes.pattern;
delete argTypes.minlength;
delete argTypes.maxlength;

argTypes.autocomplete.table.defaultValue.summary = 'off';
argTypes.autounmask.table.defaultValue.summary = 'true';

export default {
    title: 'Bileşenler/Metin Bileşenleri/PlateBox',
    argTypes,
};

export const Default = {
    render: args => Platebox(args),
    args: {
        label: 'Plaka Numarası',
        placeholder: '34 ABC 123',
    },
    parameters: {
        docs: {
            canvas: { sourceState: 'shown' }, // Canvas altında code otomatik açık gelir
            codePanel: true,
        },
    },
};

export const PlaygroundStory = {
    render: args => Platebox(args),
    tags: ['!dev'],
    args: {
        label: 'Plaka Numarası',
        placeholder: '34 ABC 123',
    },
    parameters: {
        docs: {
            canvas: { sourceState: 'shown' }, // Canvas altında code otomatik açık gelir
        },
    },
};
