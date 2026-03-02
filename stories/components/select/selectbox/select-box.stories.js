import { inputBaseArgTypes } from '../../../utilities/common-arg-types.js';
import { createForm, Selectbox } from '../../../utilities/register.js';
import './select-box.css';

export default {
    title: 'Bileşenler/Select/Select',
    argTypes: {
        defaultSlot: {
            name: 'default',
            control: 'text',
            description: 'options için slot içeriği.',
            table: {
                category: 'Slots',
                type: { summary: 'html' },
                defaultValue: { summary: '' },
            },
        },
        ...inputBaseArgTypes,
        noOptionsLabel: {
            name: 'no-options-label',
            type: { name: 'string' },
            control: 'text',
            description: 'Seçenek yokken listede gösterilen metin.',
            table: {
                category: 'Attributes',
                defaultValue: { summary: 'Kayıt Bulunamadı' },
            },
        },
        // readonly: {
        //     control: 'boolean',
        //     table: {
        //         defaultValue: { summary: 'false' },
        //         type: { summary: 'boolean' },
        //     },
        // },
    },
};

export const PlaygroundStory = {
    render: args => Selectbox(args),
    tags: ['!dev'],
    args: {
        defaultSlot: `<option value="tr">Türkiye</option>
<option value="de">Almanya</option>
<option value="us" selected>ABD</option>
<option value="ch" disabled>Çin Halk Cumhuriyeti</option>
<option value="kp">Kuzey Kore</option>
<option value="jp">Japonya</option>
<option value="it">İtalya</option>`,
        fieldId: undefined,
        fieldName: 'country',
        label: 'Ülke',
        value: undefined,
        placeholder: 'Lütfen seçiniz',
        required: true,
        disabled: undefined,
        readonly: undefined,
        clearable: true,
        requiredSign: '*',
    },
    parameters: {
        docs: {
            canvas: { sourceState: 'shown' }, // Canvas altında code otomatik açık gelir
        },
    },
};

export const BasicSlotUsage = {
    render: args => Selectbox(args),
    tags: ['!dev'],
    args: {
        defaultSlot: `<option value="tr">Türkiye</option>
<option value="de">Almanya</option>
<option value="us">ABD</option>
<option value="kp" disabled>Kuzey Kore</option>
<option value="jp">Japonya</option>
<option value="it">İtalya</option>`,
        fieldId: 'country',
        label: 'Ülke',
        placeholder: 'Lütfen seçiniz',
        id: 'basic-select',
    },
    parameters: {
        docs: {
            canvas: { sourceState: 'shown' }, // Canvas altında code otomatik açık gelir
        },
    },
};

export const OptGroupSlotUsage = {
    render: args => Selectbox(args),
    tags: ['!dev'],
    args: {
        defaultSlot: `<optgroup label="German Cars">
    <option value="audi">Audi</option>
    <option value="bmw">BMW</option>
</optgroup>
<optgroup label="Swedish Cars">
    <option value="volvo">Volvo</option>
    <option value="saab">Saab</option>
</optgroup>`,
        fieldId: 'country',
        label: 'Ülke',
        placeholder: 'Lütfen seçiniz',
        id: 'basic-select',
    },
};

export const BasicSelectedUsage = {
    render: args => Selectbox(args),
    tags: ['!dev'],
    args: {
        defaultSlot: `<option value="tr">Türkiye</option>
<option value="de">Almanya</option>
<option value="us">ABD</option>
<option value="jp">Japonya</option>`,
        fieldId: 'country',
        label: 'Ülke',
        placeholder: 'Lütfen seçiniz',
        value: 'de',
    },
};

export const ValidationUsage = {
    render: args => {
        const selectbox = Selectbox(args);
        return createForm(selectbox, 'SELECTBOX');
    },
    tags: ['!dev'],
    args: {
        defaultSlot: `<option value="tr">Türkiye</option>
<option value="de">Almanya</option>
<option value="us">ABD</option>`,
        fieldId: 'country',
        label: 'Ülke',
        placeholder: 'Lütfen seçiniz',
        required: true,
    },
};

export const PropAttrEventLists = {
    tags: ['!dev'],
    argTypes: {
        // 3. Events (İstersen bunları da elle ekleyebilirsin)
        input: {
            action: 'input', // Actions panelinde 'input' ismiyle loglar
            description: 'Kullanıcı listeden bir seçim yaptığında (anlık) tetiklenir.',
            table: {
                category: 'Events',
                type: { summary: 'CustomEvent' }, // Tip sütununda görünür
            },
        },
        change: {
            action: 'change',
            description: 'Değer commit edildiğinde (Seçim tamamlandığında veya temizlendiğinde) tetiklenir.',
            table: {
                category: 'Events',
                type: { summary: 'CustomEvent' },
            },
        },
        clear: {
            action: 'clear',
            description: 'Temizleme (X) butonuna tıklandığında tetiklenir.',
            table: {
                category: 'Events',
                type: { summary: 'CustomEvent' },
            },
        },
        update: {
            action: 'update',
            description: 'Değer programatik olarak (JS ile .value set edilerek) değiştirildiğinde tetiklenir.',
            control: false, // Bu bir event olduğu için kontrol edilemez
            table: {
                category: 'Events',
                type: { summary: 'CustomEvent' },
            },
        },
    },
};
