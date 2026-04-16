import { createAttrType, createEventType, createSlotType, inputBaseArgTypes } from '../../../utilities/common-arg-types.js';
import { Combobox } from '../../../utilities/register.js';
import '../../../assets/styles/combo-box.css';

export default {
    component: 'combo-box',
    title: 'Bileşenler/Seçim Bileşenleri/Combobox',
    argTypes: {
        defaultSlot: createSlotType('options için slot içeriği.', '""', 'default'),
        noOptionsSlot: createSlotType('options olmadığında gösterilecek option için slot içeriği.', '""', 'no-options'),
        ...inputBaseArgTypes,
        nativeBehavior: createAttrType('Klavye ile gezinirken tarayıcının *native* `<select>` davranışını kullanır.', 'boolean', 'false', false, 'native-behavior'),
    },
};

export const Default = {
    render: args => Combobox(args),
    args: {
        defaultSlot: `<option value="tr">
    <img src="https://flagcdn.com/tr.svg" alt="Turkey Flag" width="20" height="15" style="margin-right: 5px" />Türkiye
</option>
<option value="de">
    <img src="https://flagcdn.com/de.svg" alt="Germany Flag" width="20" height="15" style="margin-right: 5px" />Almanya
</option>
<option value="us">
    <img src="https://flagcdn.com/us.svg" alt="USA Flag" width="20" height="15" style="margin-right: 5px" />ABD
</option>
<option value="ch" disabled>
    <img src="https://flagcdn.com/cn.svg" alt="China Flag" width="20" height="15" style="margin-right: 5px" />Çin Halk Cumhuriyeti
</option>
<option value="kp">
    <img src="https://flagcdn.com/kp.svg" alt="North Korea Flag" width="20" height="15" style="margin-right: 5px" />Kuzey Kore
</option>
<option value="it">
    <img src="https://flagcdn.com/it.svg" alt="Italy Flag" width="20" height="15" style="margin-right: 5px" />İtalya
</option>
`,
        noOptionsSlot: `<template slot="no-options">Kayıt Bulunamadı</template>`,
        fieldId: 'country',
        label: 'Ülke',
        placeholder: 'Lütfen seçiniz',
        required: true,
    },
    parameters: {
        docs: {
            canvas: { sourceState: 'shown' }, // Canvas altında code otomatik açık gelir
            codePanel: true,
        },
    },
};

export const PlaygroundStory = {
    render: args => Combobox(args),
    tags: ['!dev'],
    args: {
        defaultSlot: `<option value="tr">
    <img src="https://flagcdn.com/tr.svg" alt="Turkey Flag" width="20" height="15" style="margin-right: 5px" />Türkiye
</option>
<option value="de">
    <img src="https://flagcdn.com/de.svg" alt="Germany Flag" width="20" height="15" style="margin-right: 5px" />Almanya
</option>
<option value="us">
    <img src="https://flagcdn.com/us.svg" alt="USA Flag" width="20" height="15" style="margin-right: 5px" />ABD
</option>
<option value="ch" disabled>
    <img src="https://flagcdn.com/cn.svg" alt="China Flag" width="20" height="15" style="margin-right: 5px" />Çin Halk Cumhuriyeti
</option>
<option value="kp">
    <img src="https://flagcdn.com/kp.svg" alt="North Korea Flag" width="20" height="15" style="margin-right: 5px" />Kuzey Kore
</option>
<option value="it">
    <img src="https://flagcdn.com/it.svg" alt="Italy Flag" width="20" height="15" style="margin-right: 5px" />İtalya
</option>
`,
        noOptionsSlot: `<template slot="no-options">Kayıt Bulunamadı</template>`,
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

export const NativeStory = {
    render: args => Combobox(args),
    tags: ['!dev'],
    args: {
        defaultSlot: `<option value="tr">
    <img src="https://flagcdn.com/tr.svg" alt="Turkey Flag" width="20" height="15" style="margin-right: 5px" />Türkiye
</option>
<option value="de">
    <img src="https://flagcdn.com/de.svg" alt="Germany Flag" width="20" height="15" style="margin-right: 5px" />Almanya
</option>
<option value="us">
    <img src="https://flagcdn.com/us.svg" alt="USA Flag" width="20" height="15" style="margin-right: 5px" />ABD
</option>
<option value="ch" disabled>
    <img src="https://flagcdn.com/cn.svg" alt="China Flag" width="20" height="15" style="margin-right: 5px" />Çin Halk Cumhuriyeti
</option>
<option value="kp">
    <img src="https://flagcdn.com/kp.svg" alt="North Korea Flag" width="20" height="15" style="margin-right: 5px" />Kuzey Kore
</option>
<option value="it">
    <img src="https://flagcdn.com/it.svg" alt="Italy Flag" width="20" height="15" style="margin-right: 5px" />İtalya
</option>
`,
        noOptionsSlot: `<template slot="no-options">Kayıt Bulunamadı</template>`,
        fieldId: 'country-native',
        label: 'Ülke (native)',
        placeholder: 'Lütfen seçiniz',
        nativeBehavior: true,
    },
};

export const PropAttrEventLists = {
    tags: ['!dev'],
    argTypes: {
        // 3. Events (İstersen bunları da elle ekleyebilirsin)
        input: createEventType('input', 'Kullanıcı listeden bir seçim yaptığında (anlık) tetiklenir.'),
        change: createEventType('change', 'Değer commit edildiğinde (Seçim tamamlandığında veya temizlendiğinde) tetiklenir.'),
        clear: createEventType('clear', 'Temizleme (X) butonuna tıklandığında tetiklenir.'),
        update: createEventType('update', 'Değer programatik olarak (JS ile .value set edilerek) değiştirildiğinde tetiklenir.'),
        validate: createEventType('validate', 'Değer programatik olarak (JS ile .value set edilerek) değiştirildiğinde tetiklenir.', 'validationMessage: String'),
    },
};
