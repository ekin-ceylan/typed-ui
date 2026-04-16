import { createAttrType, createSlotType, inputBaseArgTypes } from '../../../utilities/common-arg-types.js';
import { Checkbox } from '../../../utilities/register.js';

export default {
    component: 'check-box',
    title: 'Bileşenler/Seçim Bileşenleri/Checkbox',
    argTypes: {
        defaultSlot: createSlotType('Checkbox etiket içeriği.', '""', 'default'),
        ...structuredClone(inputBaseArgTypes),
        label: createAttrType('Checkbox için görsel olmayan bir açıklama. Erişilebilirlik için önemlidir.', 'string', '""', true),
        value: createAttrType(
            "Checkbox'ın tuttuğu değer. Seçili olduğunda `checked-value`, seçili olmadığında `unchecked-value` değerini tutar. Başlangıçta yazılan değer `checked-value` ile eşleşiyorsa checkbox işaretli olur.",
            'string',
            'null'
        ),
        checked: createAttrType("Checkbox'ın seçili olup olmadığını belirler. Atanmazsa checkbox işaretli olmaz.", 'boolean', 'false'),
        checkedValue: createAttrType('Seçili olduğunda gönderilecek değer. Atanmazsa attribute görünmez ve "on" kabul edilir.', 'string', '"on"', false, 'checked-value'),
        uncheckedValue: createAttrType('Seçili olmadığında gönderilecek değer.', 'string', 'undefined', false, 'unchecked-value'),
        indeterminate: createAttrType("Checkbox'ın belirsiz (indeterminate) durumda olup olmayacağını belirler.", 'boolean', 'false'),
    },
};

// native davranış
// lit component içinde value okuyan davranış
// indeterminate senaryosu: değeri etkilemez.
// required ve validation
// disabled senaryosu
// readonly senaryosu
// checked
// Indeterminate
// Events
// Props
// Attr

export const Default = {
    render: args => Checkbox(args),
    args: {
        defaultSlot: 'Okudum, Anladım',
        fieldId: 'subscribe',
        label: 'Abone Ol',
    },
    parameters: {
        controls: { expanded: true },
    },
};

export const PlaygroundStory = {
    render: args => Checkbox(args),
    tags: ['!dev'],
    args: {
        defaultSlot: 'Okudum, Anladım',
        fieldId: 'subscribe',
        label: 'Abone Ol',
    },
    parameters: {
        docs: {
            canvas: { sourceState: 'shown' }, // Canvas altında code otomatik açık gelir
        },
    },
};
