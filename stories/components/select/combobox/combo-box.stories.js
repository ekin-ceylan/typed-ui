import { Combobox } from '../../../utilities/register.js';
import './combo-box.css';

export default {
    component: 'combo-box',
    title: 'Bileşenler/Select/Combobox',
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
        noOptionsSlot: {
            name: 'no-options',
            control: 'text',
            description: 'options olmadığında gösterilecek option için slot içeriği.',
            table: {
                category: 'Slots',
                type: { summary: 'html' },
                defaultValue: { summary: '' },
            },
        },
        fieldId: {
            name: 'field-id',
            type: { name: 'string', required: true },
            control: 'text',
            description: 'Input elementinin id attribute değeri.',
            table: {
                category: 'Attributes',
                defaultValue: { summary: '' },
            },
        },
        fieldName: {
            name: 'field-name',
            type: { name: 'string' },
            control: 'text',
            description: 'Input elementinin name attribute değeri. Atanmazsa field-id değeri kullanılır.',
            table: {
                category: 'Attributes',
                defaultValue: { summary: 'field-id' },
            },
        },
        label: {
            type: { name: 'string', required: true },
            control: 'text',
            description: 'Input etiketi',
            table: {
                category: 'Attributes',
                defaultValue: { summary: '' },
            },
        },
        value: {
            type: { name: 'string' },
            defaultValue: undefined,
            description: 'Kombo kutusunun tuttuğu değer.\n\n Başlangıçta yazılan değer optionlar arasında bulunuyorsa o seçenek seçili olarak gelir.',
            control: 'text',
            table: {
                category: 'Attributes',
                defaultValue: { summary: 'null' },
                type: { summary: 'string|number' },
            },
        },
        hideLabel: {
            name: 'hide-label',
            control: 'boolean',
            description: 'Label etiketinin render edilmez. `aria-label` olarak kullanılır.',
            table: {
                category: 'Attributes',
                defaultValue: { summary: 'false' },
                type: { summary: 'boolean' },
            },
        },
        required: {
            control: 'boolean',
            table: {
                category: 'Attributes',
                defaultValue: { summary: 'false' },
                type: { summary: 'boolean' },
            },
        },
        disabled: {
            control: 'boolean',
            table: {
                category: 'Attributes',
                defaultValue: { summary: 'false' },
                type: { summary: 'boolean' },
            },
        },
        nativeBehavior: {
            name: 'native-behavior',
            control: 'boolean',
            description: 'Klavye ile gezinirken tarayıcının *native* `<select>` davranışını kullanır.',
            table: {
                category: 'Attributes',
                defaultValue: { summary: 'false' },
                type: { summary: 'boolean' },
            },
        },
        placeholder: {
            type: { name: 'string' },
            control: 'text',
            description: 'Seçim yapılmamışken gösterilecek yer tutucu metin.',
            table: {
                category: 'Attributes',
                defaultValue: { summary: '' },
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

export const Default = {
    render: args => Combobox(args),
    args: {
        defaultSlot: `<option value="tr">
    <img src="https://flagcdn.com/tr.svg" alt="Turkey Flag" width="20" height="15" style="vertical-align: middle; margin-right: 5px" />Türkiye
</option>
<option value="de">
    <img src="https://flagcdn.com/de.svg" alt="Germany Flag" width="20" height="15" style="vertical-align: middle; margin-right: 5px" />Almanya
</option>
<option value="us">
    <img src="https://flagcdn.com/us.svg" alt="USA Flag" width="20" height="15" style="vertical-align: middle; margin-right: 5px" />ABD
</option>`,
        noOptionsSlot: `<template slot="no-options">Kayıt Bulunamadı</template>`,
        fieldId: 'country',
        label: 'Ülke',
        placeholder: 'Lütfen seçiniz',
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
        fieldId: 'country',
        label: 'Ülke',
        placeholder: 'Lütfen seçiniz',
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
