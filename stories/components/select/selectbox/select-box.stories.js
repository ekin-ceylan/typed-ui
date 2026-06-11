import { createAttrType, createSlotType, createEventType, inputBaseArgTypes } from '../../../utilities/common-arg-types.js';
import { createForm, Selectbox } from '../../../utilities/register.js';
import '../../../assets/styles/select-box.css';

export default {
    title: 'Bileşenler/Seçim Bileşenleri/Select',
    argTypes: {
        defaultSlot: createSlotType('options için slot içeriği.', '""', 'default'),
        ...inputBaseArgTypes,
        noOptionsLabel: createAttrType('Seçenek yokken listede gösterilen metin.', 'string', 'Kayıt Bulunamadı', false, 'no-options-label'),
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
        name: 'country',
        label: 'Ülke',
        value: undefined,
        placeholder: 'Lütfen seçiniz',
        required: true,
        disabled: undefined,
        readonly: undefined,
        clearable: true,
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
        label: 'Arabalar',
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
        label: 'Ülke',
        placeholder: 'Lütfen seçiniz',
        required: true,
    },
};

export const PropAttrEventLists = {
    tags: ['!dev'],
    argTypes: {
        // 3. Events (İstersen bunları da elle ekleyebilirsin)
        input: createEventType('input', 'Kullanıcı listeden bir seçim yaptığında (anlık) tetiklenir.'),
        change: createEventType('change', 'Değer commit edildiğinde (Seçim tamamlandığında veya temizlendiğinde) tetiklenir.'),
        clear: createEventType('clear', 'Temizleme (X) butonuna tıklandığında tetiklenir.'),
        update: createEventType('update', 'Değer programatik olarak (JS ile `.value` alanına atama yapılarak) değiştirildiğinde tetiklenir.'),
        validate: createEventType('validate', 'Doğrulama işlemi tamamlandığında tetiklenir.', 'validationMessage: String'),
    },
};
